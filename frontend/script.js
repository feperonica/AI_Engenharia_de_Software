async function getWeather(city, unit = "celsius") {
  if (!city || typeof city !== "string") {
    alert("Cidade inválida.");
    return;
  }

  const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;

  try {
    const geoResponse = await fetch(geocodeUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      document.getElementById("resultado").textContent = "Cidade não encontrada.";
      return;
    }

    const { latitude, longitude } = geoData.results[0];

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=${unit}`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    if (!weatherData.current_weather) {
      document.getElementById("resultado").textContent = "Erro ao obter os dados do clima.";
      return;
    }

    const temp = weatherData.current_weather.temperature;
    const wind = weatherData.current_weather.windspeed;
    const unitSymbol = unit === "fahrenheit" ? "°F" : "°C";

    document.getElementById("resultado").textContent =
      `Temperatura: ${temp}${unitSymbol}, Vento: ${wind} km/h`;

  } catch (err) {
    document.getElementById("resultado").textContent = "Erro inesperado: " + err.message;
  }
}

document.getElementById("buscar").addEventListener("click", () => {
  const cidade = document.getElementById("cidade").value;
  getWeather(cidade);
});
