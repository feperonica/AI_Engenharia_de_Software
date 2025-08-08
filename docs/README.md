# Aplicativo do Clima – Python + Open-Meteo | HTML + CSS + JavaScript

## 📋 Descrição
Este projeto contém **duas versões** de um aplicativo de previsão do tempo usando a API pública **Open-Meteo**:

1. **Versão Python** (`weather_app_final.py`):
   - Exibe o clima atual em múltiplas cidades com **cache** de 1 hora.
   - Mostra a previsão de **5 dias** com temperaturas mínimas e máximas.
   - Inclui testes básicos para validar funcionamento.
   - Desenvolvido como prática de desenvolvimento iterativo com assistência de IA na **Generation Brasil**.

2. **Versão HTML + CSS + JavaScript** (`index.html`, `style.css`, `app.js`):
   - Interface web responsiva, sem dependências externas.
   - Busca de cidade com **Open-Meteo Geocoding** e fallback **Nominatim/OSM**.
   - Clima atual e previsão de 5 dias com cache de 1 hora no `localStorage`.
   - Troca de unidades °C/°F.
   - Funciona diretamente no navegador.

---

## 🚀 Funcionalidades

### Python
- **Clima Atual**: Consulta e exibe a temperatura em tempo real.
- **Cache Inteligente**: Evita requisições repetidas à API dentro de 1 hora.
- **Previsão de 5 Dias**: Mostra as mínimas e máximas diárias.
- **Tratamento de Erros**: Mensagens claras para problemas de rede ou ausência de dados.
- **Testes Automatizados**: Valida resposta da API e funcionamento do cache.

### HTML + CSS + JavaScript
- **Busca de Cidade**: Digite o nome da cidade para obter coordenadas automaticamente.
- **Fallback de Geocoding**: Caso Open-Meteo falhe, utiliza Nominatim (OpenStreetMap).
- **Clima Atual + Previsão**: Temperatura, descrição (WMO) e previsão de 5 dias.
- **Cache Local**: `localStorage` com expiração de 1 hora.
- **Troca de Unidades**: °C ↔ °F.
- **Interface Responsiva**: CSS adaptado para desktop e mobile.

---

## 📦 Requisitos

### Python
- Python 3.8 ou superior
- Biblioteca `requests`
```bash
pip install requests
