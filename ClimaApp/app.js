// ========= util =========
const $ = (sel) => document.querySelector(sel);
const $list = (sel) => Array.from(document.querySelectorAll(sel));

const API_FORECAST = "https://api.open-meteo.com/v1/forecast";
const TTL_MS = 60 * 60 * 1000; // 1h

const WMO_MAP = {
  0: "Céu limpo",
  1: "Principalmente limpo",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Nevoeiro",
  48: "Nevoeiro com gelo",
  51: "Garoa fraca",
  53: "Garoa moderada",
  55: "Garoa intensa",
  61: "Chuva fraca",
  63: "Chuva moderada",
  65: "Chuva forte",
  71: "Neve fraca",
  73: "Neve moderada",
  75: "Neve forte",
  80: "Aguaceiros fracos",
  81: "Aguaceiros moderados",
  82: "Aguaceiros fortes",
  95: "Trovoadas",
  96: "Trovoadas com granizo",
  99: "Trovoadas fortes com granizo",
};

function stripDiacritics(s) {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function cacheGet(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { t, v } = JSON.parse(raw);
    if (Date.now() - t < TTL_MS) return v;
  } catch {}
  return null;
}
function cacheSet(key, v) {
  try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), v })); } catch {}
}
function k(prefix, city, unit) {
  return `wthr:${prefix}:${city.toLowerCase()}:${unit}`;
}

// ========= geocoding (Open‑Meteo + fallback Nominatim) =========
async function geocodeOpenMeteo(q, countryCode) {
  const params = new URLSearchParams({
    name: q, count: "7", language: "pt", format: "json"
  });
  if (countryCode) params.set("country", countryCode);
  const url = `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding HTTP ${res.status}`);
  const data = await res.json();
  return (data?.results ?? []).map(c => ({
    name: c.name, country: c.country, latitude: c.latitude, longitude: c.longitude, admin1: c.admin1
  }));
}

async function geocodeNominatim(q, countryCode) {
  const query = countryCode ? `${q}, ${countryCode}` : q;
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.search = new URLSearchParams({
    q: query, format: "json", limit: "7", addressdetails: "1", "accept-language": "pt-BR"
  }).toString();
  const res = await fetch(url.toString(), {
    headers: { "User-Agent": "weather-vanilla-demo/1.0 (educational)" }
  });
  if (!res.ok) throw new Error(`Nominatim HTTP ${res.status}`);
  const data = await res.json();
  return data.map(c => ({
    name: c.display_name.split(",")[0],
    country: c.address?.country ?? "",
    latitude: Number(c.lat),
    longitude: Number(c.lon),
    admin1: c.address?.state
  }));
}

async function searchCityAll(query, countryCode = "BR") {
  const q = query.trim();
  if (q.length < 2) return [];
  try {
    let res = await geocodeOpenMeteo(q, countryCode);
    if (res.length) return res;
    const plain = stripDiacritics(q);
    if (plain !== q) {
      res = await geocodeOpenMeteo(plain, countryCode);
      if (res.length) return res;
    }
  } catch (_) {
    // cai no fallback
  }
  try {
    return await geocodeNominatim(q, countryCode);
  } catch (e2) {
    return [];
  }
}

// ========= forecast =========
async function getCurrent(cityName, lat, lon, unit = "celsius") {
  const key = k("current", cityName, unit);
  const cached = cacheGet(key);
  if (cached) return cached;

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: "temperature_2m,weather_code,wind_speed_10m,is_day",
    temperature_unit: unit,
    timezone: "auto",
  });

  const res = await fetch(`${API_FORECAST}?${params.toString()}`);
  if (!res.ok) throw new Error(`API current ${res.status}`);
  const data = await res.json();
  cacheSet(key, data);
  return data;
}

async function getForecast5(cityName, lat, lon, unit = "celsius") {
  const key = k("forecast5", cityName, unit);
  const cached = cacheGet(key);
  if (cached) return cached;

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    daily: "temperature_2m_max,temperature_2m_min",
    forecast_days: "5",
    timezone: "auto",
    temperature_unit: unit,
  });

  const res = await fetch(`${API_FORECAST}?${params.toString()}`);
  if (!res.ok) throw new Error(`API daily ${res.status}`);
  const data = await res.json();
  cacheSet(key, data);
  return data;
}

// ========= UI & lógica =========
const elQ = $("#q");
const elBtn = $("#btnSearch");
const elSug = $("#suggestions");
const elStatus = $("#status");
const elUnit = $("#unit");

const elCityTitle = $("#cityTitle");
const elTempNow = $("#tempNow");
const elDescNow = $("#descNow");
const elWindNow = $("#windNow");
const elDayNow = $("#dayNow");
const elForecast = $("#forecast");

let selectedCity = { name: "São Paulo", country: "Brazil", latitude: -23.55, longitude: -46.63 };
let unit = elUnit.value; // "celsius" | "fahrenheit"

function setLoading(on, msg = "Carregando...") {
  elStatus.textContent = on ? msg : "";
}
function setError(msg) {
  elStatus.textContent = msg;
}

function renderSuggestions(list) {
  elSug.innerHTML = "";
  list.forEach((c) => {
    const li = document.createElement("li");
    li.textContent = `${c.name}${c.admin1 ? ", " + c.admin1 : ""} — ${c.country}`;
    li.title = li.textContent;
    li.addEventListener("click", () => {
      selectedCity = c;
      elQ.value = `${c.name}`;
      elSug.innerHTML = "";
      loadWeather();
    });
    elSug.appendChild(li);
  });
}

async function doSearch() {
  const q = elQ.value.trim();
  if (!q) return;
  setLoading(true, "Buscando cidades...");
  try {
    const results = await searchCityAll(q, "BR");
    if (!results.length) {
      renderSuggestions([]);
      setError("Nenhum resultado. Tente sem acentos ou inclua o país (ex: “Cidade, BR”).");
    } else {
      renderSuggestions(results);
      setLoading(false, "");
    }
  } catch (e) {
    renderSuggestions([]);
    setError("Erro na busca. Verifique sua rede/DNS/antivírus e tente novamente.");
  } finally {
    setLoading(false);
  }
}

async function loadWeather() {
  elCityTitle.textContent = `${selectedCity.name} — ${selectedCity.country}`;
  elTempNow.textContent = "—";
  elDescNow.textContent = "—";
  elWindNow.textContent = "Vento: — km/h";
  elDayNow.textContent = "—";
  elForecast.innerHTML = "";
  setLoading(true, "Carregando clima...");

  try {
    const [now, daily] = await Promise.all([
      getCurrent(selectedCity.name, selectedCity.latitude, selectedCity.longitude, unit),
      getForecast5(selectedCity.name, selectedCity.latitude, selectedCity.longitude, unit)
    ]);

    const c = now.current || {};
    const t = Math.round(c.temperature_2m ?? 0);
    elTempNow.textContent = `${t}${unit === "celsius" ? "°C" : "°F"}`;
    elDescNow.textContent = WMO_MAP[c.weather_code] ?? `WMO: ${c.weather_code ?? "-"}`;
    elWindNow.textContent = `Vento: ${Math.round(c.wind_speed_10m ?? 0)} km/h`;
    elDayNow.textContent = (c.is_day ?? 1) === 1 ? "Dia" : "Noite";

    const d = daily.daily;
    const days = d.time.map((date, i) => ({
      date,
      min: Math.round(d.temperature_2m_min[i]),
      max: Math.round(d.temperature_2m_max[i]),
    }));

    elForecast.innerHTML = "";
    days.forEach((it) => {
      const div = document.createElement("div");
      div.className = "day";
      div.innerHTML = `
        <div class="date">${new Date(it.date).toLocaleDateString()}</div>
        <div>Mín: <b>${it.min}${unit === "celsius" ? "°C" : "°F"}</b></div>
        <div>Máx: <b>${it.max}${unit === "celsius" ? "°C" : "°F"}</b></div>
      `;
      elForecast.appendChild(div);
    });

    setLoading(false);
  } catch (e) {
    setError("Falha ao carregar clima. Verifique sua rede/DNS/antivírus e tente novamente.");
  } finally {
    setLoading(false);
  }
}

// eventos
elBtn.addEventListener("click", doSearch);
elQ.addEventListener("keydown", (e) => {
  if (e.key === "Enter") doSearch();
});
elUnit.addEventListener("change", (e) => {
  unit = e.target.value;
  // Recarrega com a unidade nova
  loadWeather();
});

// primeira carga
loadWeather();
