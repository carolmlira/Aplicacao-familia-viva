# Aplicação Família Viva - Guia de Configuração

Este documento fornece um guia passo a passo para configurar o ambiente de desenvolvimento da **Aplicação Família Viva**.

## 📌 Pré-requisitos
Antes de iniciar, certifique-se de ter instalado:
- [Node.js](https://nodejs.org/) (versão recomendada: LTS)
- [Git](https://git-scm.com/)
- Um editor de código, como [Visual Studio Code](https://code.visualstudio.com/)

## 🚀 Configuração do Projeto
### 1️⃣ Clonar o repositório
```sh
git clone <URL_DO_REPOSITORIO>
cd Aplicacao-familia-viva
```

### 2️⃣ Instalar as dependências
```sh
npm install
```

### 3️⃣ Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto e adicione as seguintes configurações:
```env
FIREBASE_API_KEY=<sua_api_key>
FIREBASE_AUTH_DOMAIN=<seu_auth_domain>
FIREBASE_PROJECT_ID=<seu_project_id>
FIREBASE_STORAGE_BUCKET=<seu_storage_bucket>
FIREBASE_MESSAGING_SENDER_ID=<seu_sender_id>
FIREBASE_APP_ID=<seu_app_id>
FIREBASE_MEASUREMENT_ID=<seu_measurement_id>
```

### 4️⃣ Rodar o servidor
```sh
node server.js
```

O servidor deve iniciar e a aplicação estará disponível em `http://localhost:3000` (ou outra porta configurada).

## 📁 Estrutura do Projeto
```
Aplicacao-familia-viva/
│-- node_modules/      # Dependências do Node.js
│-- public/
│   ├── js/            # Scripts JavaScript
│   ├── static/
│   │   ├── styles/    # Arquivos CSS
│   │   ├── templates/ # Arquivos HTML (index.html)
│-- .env               # Variáveis de ambiente
│-- package.json       # Configuração do projeto
│-- server.js          # Servidor Node.js
│-- README.md          # Documentação
```


