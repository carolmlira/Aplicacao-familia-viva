# Aplicação Família Viva - Guia de Configuração

Este documento fornece um guia passo a passo para configurar o ambiente de desenvolvimento da **Aplicação Família Viva**.

## 📌 Pré-requisitos
Antes de iniciar, certifique-se de ter instalado:
- [Node.js](https://nodejs.org/) (versão recomendada: LTS)
- [Git](https://git-scm.com/)
- Um editor de código, como [Visual Studio Code](https://code.visualstudio.com/)

## 🚀 Configuração do Projeto
### 1️⃣ Clonar o repositório
````sh
git clone <URL_DO_REPOSITORIO>
cd Aplicacao-familia-viva
````

### 2️⃣ Instalar as dependências
````sh
npm install
````


### 3️⃣ Configurar variáveis de ambiente
Crie um arquivo .env na raiz do projeto e adicione as seguintes configurações:
````env
FIREBASE_API_KEY=<sua_api_key>
FIREBASE_AUTH_DOMAIN=<seu_auth_domain>
FIREBASE_PROJECT_ID=<seu_project_id>
FIREBASE_STORAGE_BUCKET=<seu_storage_bucket>
FIREBASE_MESSAGING_SENDER_ID=<seu_sender_id>
FIREBASE_APP_ID=<seu_app_id>
FIREBASE_MEASUREMENT_ID=<seu_measurement_id>
````

### 4️⃣ Rodar o servidor
````sh
node server.js
````

O servidor deve iniciar e a aplicação estará disponível em http://localhost:3000 (ou outra porta configurada).

## 📁 Estrutura do Projeto após o Firebase
````
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
````
---

## Instalação do nest.js

### 📌 1. Instalar o CLI do NestJS
Se ainda não tem o NestJS instalado globalmente, execute:
````
npm install -g @nestjs/cli
````
### 📌 2. Criar o Projeto NestJS dentro do Repositório
Como você já tem um repositório iniciado, crie o NestJS dentro do diretório da aplicação:
````
nest new backend
````
Isso criará uma pasta chamada backend com a estrutura do NestJS.

### 📌 3. Entrar no Diretório e Instalar as Dependências
````
cd backend
npm install
````
### 📌 4. Adicionar o Firebase ao NestJS
No backend do NestJS, instale o SDK do Firebase:
````
npm install firebase-admin
````
### 📌 5. Rodar o Servidor NestJS
````
npm run start
````
Isso inicia o backend no http://localhost:3000.

## 📁 Estrutura do Projeto após o nest.js
````
Aplicacao-familia-viva/
│-- backend/               # Backend NestJS
│   ├── dist/              # Código compilado
│   ├── node_modules/      # Dependências do Node.js
│   ├── src/               # Código-fonte do NestJS
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   ├── main.ts
│   ├── test/              # Testes
│   ├── .gitignore         # Arquivos ignorados no Git
│   ├── nest-cli.json      # Configuração do NestJS
│   ├── package.json       # Configuração do backend
│   ├── tsconfig.json      # Configuração do TypeScript
│   ├── tsconfig.build.json # Configuração de build
│-- node_modules/          # Dependências do Node.js
│-- public/
│   ├── js/                # Scripts JavaScript
│   ├── static/
│   │   ├── styles/        # Arquivos CSS
│   │   ├── templates/     # Arquivos HTML (index.html)
│-- .env                   # Variáveis de ambiente
│-- package.json           # Configuração do frontend
│-- server.js              # Servidor Node.js
│-- README.md              # Documentação
````
## 🚀 Passos para adicionar Next.js ao projeto

### 🛠 1. Instalar o Next.js
No terminal do VS Code, vá até a pasta do projeto e rode o comando:
````sh
npx create-next-app@latest frontend
````
### 📌 Configuração Recomendada
````
    1. Nome do projeto: frontend 

    2. TypeScript: ✅ Yes 

    3. ESLint: ✅ Yes 

    4. Tailwind CSS: ✅ Yes 

    5. Usar diretório src/: ✅ Yes 

    6. App Router (recomendado): ✅ Yes 

    7. Turbopack para next dev: ✅ Yes 

    8. Customizar alias de importação?: ❌ No 
````
Isso criará uma nova pasta chamada frontend com toda a estrutura do Next.js.

📂 2. Estrutura do Projeto
Depois da instalação, sua estrutura ficará assim:
````
Aplicacao-familia-viva/
│-- backend/               # Backend NestJS
│-- frontend/              # Frontend Next.js
│-- node_modules/          # Dependências do Node.js
│-- public/
│   ├── js/                # Scripts JavaScript
│   ├── static/
│   │   ├── styles/        # Arquivos CSS
│   │   ├── templates/     # Arquivos HTML (index.html)
│-- .env                   # Variáveis de ambiente
│-- package.json           # Configuração do frontend
│-- server.js              # Servidor Node.js
│-- README.md              # Documentação
````

### ⚙ 3. Configurar o Servidor Express para servir o Next.js
Agora, no server.js, atualize para incluir o Next.js:
````javascript
const express = require("express");
const next = require("next");
const path = require("path");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    // Servir arquivos estáticos da pasta "public"
    server.use(express.static(path.join(__dirname, "public")));

    // Rota principal para servir o Next.js
    server.all("*", (req, res) => {
        return handle(req, res);
    });

    const PORT = 3000;
    server.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
});

````
### 🏃‍♂️ 4. Rodar o Projeto
Agora, dentro da pasta frontend, rode:

````sh
npm run dev
````
E acesse http://localhost:3000 para ver o Next.js rodando! 🎉

⚠ Caso o `next.js` não seja reconhecido, use este comando:
````bash
npm install next react react-dom
````
Em seguida, rode novamente