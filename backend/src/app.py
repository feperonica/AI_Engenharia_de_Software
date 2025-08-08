import requests
import time

API_URL = "https://api.open-meteo.com/v1/forecast"
TEMPO_EXPIRACAO = 60 * 60  # 60 minutos
cache = {}

# Lista de cidades com coordenadas fixas
cidades = [
    {"nome": "São Paulo", "lat": -23.55, "lon": -46.63},
    {"nome": "Rio de Janeiro", "lat": -22.91, "lon": -43.17},
    {"nome": "Recife", "lat": -8.05, "lon": -34.88}
]

def buscar_clima_com_cache(nome, lat, lon, unidade="celsius"):
    """
    Busca o clima atual com cache (1h) usando latitude e longitude.
    """
    chave_cache = f"{nome.lower()}_{unidade}"
    agora = time.time()

    if chave_cache in cache:
        tempo_salvo = cache[chave_cache]["timestamp"]
        if agora - tempo_salvo < TEMPO_EXPIRACAO:
            clima = cache[chave_cache]["dados"]
            print(f"🧠 [CACHE] {nome}: {clima['temperature']}°{'F' if unidade == 'fahrenheit' else 'C'}")
            return clima

    try:
        resposta = requests.get(API_URL, params={
            "latitude": lat,
            "longitude": lon,
            "current_weather": True,
            "temperature_unit": unidade
        })
        resposta.raise_for_status()
        dados = resposta.json().get("current_weather")

        if dados:
            cache[chave_cache] = {
                "dados": dados,
                "timestamp": agora
            }
            print(f"🌐 [API] {nome}: {dados['temperature']}°{'F' if unidade == 'fahrenheit' else 'C'}")
            return dados
        else:
            print(f"⚠️ Clima não encontrado para {nome}")
            return None

    except Exception as e:
        print(f"❌ Erro ao buscar clima para {nome}: {e}")
        return None

def previsao_5_dias(nome, lat, lon, unidade="celsius"):
    """
    Busca e exibe a previsão de 5 dias (min/máx) usando a API Open-Meteo.
    """
    try:
        resposta = requests.get(API_URL, params={
            "latitude": lat,
            "longitude": lon,
            "daily": "temperature_2m_max,temperature_2m_min",
            "timezone": "auto",
            "temperature_unit": unidade
        })
        resposta.raise_for_status()
        dados = resposta.json()

        dias = dados["daily"]["time"]
        temp_max = dados["daily"]["temperature_2m_max"]
        temp_min = dados["daily"]["temperature_2m_min"]

        print(f"\n📅 Previsão de 5 dias para {nome}:\n")
        for i in range(5):
            print(f"{dias[i]} ➤ {temp_min[i]}° / {temp_max[i]}° {'F' if unidade == 'fahrenheit' else 'C'}")
    except Exception as e:
        print(f"❌ Erro ao buscar previsão para {nome}: {e}")

if __name__ == "__main__":
    print("🌦️ Buscando clima atual com cache e previsão de 5 dias...\n")

    for cidade in cidades:
        nome = cidade["nome"]
        lat = cidade["lat"]
        lon = cidade["lon"]

        buscar_clima_com_cache(nome, lat, lon)
        previsao_5_dias(nome, lat, lon)

    print("\n✅ Finalizado.")
