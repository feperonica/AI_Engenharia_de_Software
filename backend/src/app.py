import requests

def buscar_clima(cidade):
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": -23.55,
        "longitude": -46.63,
        "current_weather": True
    }

    resposta = requests.get(url, params=params)

    if resposta.status_code == 200:
        dados = resposta.json()
        temperatura = dados["current_weather"]["temperature"]
        print(f"Temperatura atual em {cidade}: {temperatura}°C")
    else:
        print("Erro ao buscar dados meteorológicos.")

# Exemplo de uso
buscar_clima("São Paulo")
