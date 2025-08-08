# 🌤️ Clima App

Aplicativo simples que consulta o clima atual de qualquer cidade utilizando a [API Open-Meteo](https://open-meteo.com/).

Este projeto combina um **back-end em Python** com um **front-end em JavaScript**, demonstrando como consumir APIs públicas de forma eficaz com auxílio de ferramentas de IA.

---

## 🗂 Estrutura do Projeto

```
clima-app/
├── backend/
│   ├── src/
│   │   └── app.py
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css (opcional)
│
├── .gitignore
└── README.md
```

---

## ⚙️ Tecnologias Utilizadas

- Python 3
- JavaScript
- HTML5
- [Open-Meteo API](https://open-meteo.com/)
- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
- Ferramentas de IA: ChatGPT, GitHub Copilot

---

## 🚀 Como Usar

### 🐍 Backend (Python)

1. Navegue até `clima-app/backend/`
2. Instale as dependências:

```bash
pip install -r requirements.txt
```

3. Rode o script de teste:

```bash
python src/app.py
```

---

### 🌐 Frontend (JavaScript)

1. Navegue até `clima-app/frontend/`
2. Abra o arquivo `index.html` em um navegador (Chrome, Firefox etc.)
3. Digite o nome de uma cidade e clique em "Buscar" para ver a temperatura e velocidade do vento atuais.

---

## ✅ Funcionalidades

- Busca de clima com entrada de nome da cidade.
- Conversão automática de nome de cidade para latitude/longitude via Geocoding API.
- Exibição de temperatura e vento atual.
- Tratamento de erros para entradas inválidas ou falhas da API.
- Interface simples, amigável e pronta para personalização.

---

## 💡 Aprendizados

Este projeto foi desenvolvido como parte da trilha **AI-SWE** da Generation, aplicando:
- Refinamento de prompts com TRACI
- Depuração assistida por IA
- Testes automatizados baseados em sugestões da IA

---

## 📁 Licença

Uso educacional. Você pode reutilizar e adaptar este código livremente.

