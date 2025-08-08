# README.md

## Aplicativo do Clima – Python + Open-Meteo

### 📋 Descrição
Este projeto é um aplicativo de previsão do tempo em Python que utiliza a API pública **Open-Meteo** para:
- Exibir o clima atual em múltiplas cidades com **cache** de 1 hora.
- Mostrar a previsão de **5 dias** com temperaturas mínimas e máximas.
- Tratar erros de conexão ou falha na API.
- Realizar dois testes básicos para validar o funcionamento.

Este projeto foi desenvolvido como prática de desenvolvimento iterativo com assistência de IA na **Generation Brasil**.

---

### 🚀 Funcionalidades
- **Clima Atual**: Consulta e exibe a temperatura em tempo real.
- **Cache Inteligente**: Evita requisições repetidas à API dentro de 1 hora.
- **Previsão de 5 Dias**: Mostra as mínimas e máximas diárias.
- **Tratamento de Erros**: Mensagens claras para problemas de rede ou ausência de dados.
- **Testes Automatizados**: Valida resposta da API e funcionamento do cache.

---

### 📦 Requisitos
- Python 3.8 ou superior
- Biblioteca `requests`

Instale com:
```bash
pip install requests
```

---

### ▶️ Como Executar
1. Clone ou baixe este repositório.
2. Instale as dependências (`requests`).
3. Execute o script:
```bash
python weather_app_final.py
```

---

### 🧪 Testes
Os testes são executados automaticamente no final do script:
- **`test_api_response`**: Confirma se a API retorna dados válidos.
- **`test_cache_functionality`**: Verifica se o cache é reutilizado corretamente.

---

### 🔒 Segurança & Ética
- Nenhuma chave de API sensível é utilizada.
- Não há bibliotecas com licenciamento restritivo.
- Código revisado manualmente após sugestões da IA.
- Em projetos reais, armazene chaves e credenciais usando **variáveis de ambiente**.

---

### 📜 Licença
Projeto de uso livre para fins educacionais e de prática.