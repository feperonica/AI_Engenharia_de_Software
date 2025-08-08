# weather_app_final.py
import requests
import time

API_URL = "https://api.open-meteo.com/v1/forecast"
CACHE_EXPIRATION = 60 * 60  # 1 hora em segundos
cache = {}

# --- Funcionalidade principal: Obter clima atual com cache e tratamento de erros ---
def get_current_weather(city_name, lat, lon, unit="celsius"):
    """
    Busca o clima atual de uma cidade, usando cache em memória para reduzir chamadas à API.
    """
    cache_key = f"{city_name.lower()}_{unit}"
    now = time.time()

    # Verifica se há cache válido
    if cache_key in cache:
        cached_time = cache[cache_key]["timestamp"]
        if now - cached_time < CACHE_EXPIRATION:
            print(f"🧠 [CACHE] {city_name}: {cache[cache_key]['data']['temperature']}°{unit[0].upper()}")
            return cache[cache_key]["data"]

    try:
        response = requests.get(API_URL, params={
            "latitude": lat,
            "longitude": lon,
            "current_weather": True,
            "temperature_unit": unit
        })
        response.raise_for_status()
        data = response.json().get("current_weather")

        if not data:
            raise ValueError("Nenhum dado de clima retornado pela API.")

        cache[cache_key] = {"data": data, "timestamp": now}
        print(f"🌐 [API] {city_name}: {data['temperature']}°{unit[0].upper()}")
        return data

    except requests.RequestException as e:
        print(f"❌ Erro na requisição da API para {city_name}: {e}")
        return None
    except Exception as e:
        print(f"⚠️ Erro inesperado para {city_name}: {e}")
        return None


# --- Funcionalidade avançada: Previsão para 5 dias ---
def get_5_day_forecast(city_name, lat, lon, unit="celsius"):
    """Busca e imprime a previsão de 5 dias com temperaturas mínimas e máximas."""
    try:
        response = requests.get(API_URL, params={
            "latitude": lat,
            "longitude": lon,
            "daily": "temperature_2m_max,temperature_2m_min",
            "timezone": "auto",
            "temperature_unit": unit
        })
        response.raise_for_status()
        data = response.json()["daily"]

        print(f"\n📅 Previsão de 5 dias para {city_name}:")
        for i in range(5):
            print(f"{data['time'][i]} ➤ {data['temperature_2m_min'][i]}° / {data['temperature_2m_max'][i]}° {unit[0].upper()}")

    except Exception as e:
        print(f"❌ Falha ao buscar a previsão para {city_name}: {e}")


# --- Cidades a serem consultadas ---
cities = [
    {"name": "São Paulo", "lat": -23.55, "lon": -46.63},
    {"name": "Recife", "lat": -8.05, "lon": -34.88}
]

if __name__ == "__main__":
    print("🌦️ Aplicativo do Clima - Clima Atual e Previsão\n")
    for city in cities:
        get_current_weather(city["name"], city["lat"], city["lon"])
        get_5_day_forecast(city["name"], city["lat"], city["lon"])


# --- Testes básicos ---
def test_api_response():
    """Testa se a API retorna dados de clima válidos."""
    data = get_current_weather("Cidade Teste", -23.55, -46.63)
    assert data is not None and "temperature" in data
    print("✅ test_api_response passou com sucesso")

def test_cache_functionality():
    """Testa se o resultado em cache é reutilizado dentro do tempo de expiração."""
    start = time.time()
    get_current_weather("Cidade Cache", -23.55, -46.63)
    first_duration = time.time() - start

    start = time.time()
    get_current_weather("Cidade Cache", -23.55, -46.63)  # Deve vir do cache
    second_duration = time.time() - start

    assert second_duration < first_duration
    print("✅ test_cache_functionality passou com sucesso")

# Executar testes
    print("\n🧪 Executando Testes...")
    test_api_response()
    test_cache_functionality()


# --- Nota sobre Segurança & Ética ---
"""
Este código não utiliza nenhuma chave de API sensível.
Em projetos reais com APIs privadas, use variáveis de ambiente e nunca armazene dados sensíveis diretamente no código.
Também não foi usada nenhuma biblioteca de terceiros com licenciamento restritivo.
Todo o código foi revisado com apoio da IA, mas avaliado criticamente antes da implementação.
"""