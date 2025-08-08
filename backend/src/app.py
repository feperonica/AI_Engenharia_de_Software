import requests

def buscar_clima(cidade, unidade="celsius"):
    """
    Obtém a temperatura atual para uma cidade usando a API Open-Meteo, com base em coordenadas fixas (São Paulo).

    Esta função envia uma requisição à API Open-Meteo para obter os dados meteorológicos atuais
    com base em coordenadas predefinidas. O nome da cidade é usado apenas para exibição no console.

    Args:
        cidade (str): Nome da cidade para exibição (não afeta a busca real).
        unidade (str, opcional): Unidade de temperatura desejada. Aceita "celsius" (padrão) ou "fahrenheit".

    Returns:
        dict: Dicionário com dados do clima contendo:
            - temperature (float): Temperatura atual.
            - windspeed (float): Velocidade do vento em km/h.
            - winddirection (float): Direção do vento em graus.
            - weathercode (int): Código numérico representando o tempo atual.
            - time (str): Data e hora da coleta dos dados.
        Retorna None se a requisição falhar ou os dados estiverem ausentes.

    Raises:
        requests.exceptions.RequestException: Em caso de falha na requisição HTTP.

    Example:
        >>> buscar_clima("São Paulo", "celsius")
        Temperatura atual em São Paulo: 24°C
        {'temperature': 24.0, 'windspeed': 10.2, 'winddirection': 220, 'weathercode': 2, 'time': '2025-08-07T12:00'}
    """

    # Coordenadas fixas para São Paulo como exemplo (ideal: usar API de geocodificação)
    coordenadas = {
        "latitude": -23.55,
        "longitude": -46.63
    }

    params = {
        "latitude": coordenadas["latitude"],
        "longitude": coordenadas["longitude"],
        "current_weather": True,
        "temperature_unit": unidade
    }

    try:
        resposta = requests.get("https://api.open-meteo.com/v1/forecast", params=params)
        resposta.raise_for_status()
        dados = resposta.json()

        if "current_weather" in dados:
            clima = dados["current_weather"]
            temperatura = clima["temperature"]
            print(f"Temperatura atual em {cidade}: {temperatura}°{'F' if unidade == 'fahrenheit' else 'C'}")
            return clima
        else:
            print("Dados de clima não encontrados na resposta.")
            return None

    except requests.exceptions.RequestException as e:
        print(f"Erro na requisição: {e}")
        return None
