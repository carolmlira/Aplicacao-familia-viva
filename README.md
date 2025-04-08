# Aplicação Família Viva - Guia de Configuração

Este guia explica como configurar e rodar o projeto **Família Viva**, que agora está dividido em duas partes principais: **frontend (Next.js)** e **backend (NestJS)**. 

## ✅ Pré-requisitos

Antes de começar, verifique se você tem instalado:

- [Node.js (versão LTS)](https://nodejs.org/)
- [Git](https://git-scm.com/)
- Um editor de código (ex: [VS Code](https://code.visualstudio.com/))

---

## 🚀 Passo a passo para rodar o projeto

### 1️⃣ Clonar o repositório
```bash
git clone <URL_DO_REPOSITORIO>
cd Aplicacao-familia-viva
```

## 2️⃣ Instalar dependências

### 🔧 Firebase (na raiz do projeto)
```bash
npm install
```

### 🔧 Backend (NestJS)
```bash
cd backend
npm install
```

### 🔧 Frontend (Next.js)
```bash
cd ../fronted
npm install
```

## 3️⃣ Configurar variáveis de ambiente

**Backend** (`backend/.env`)

Crie um arquivo chamado `firebase-config.json` dentro da pasta `src/config/` com as credenciais do Firebase:

```json
{
  "type": "service_account",
  "project_id": "seu_project_id",
  "private_key_id": "sua_private_key_id",
  "private_key": "-----BEGIN PRIVATE KEY-----\\nSUA_CHAVE_AQUI\\n-----END PRIVATE KEY-----\\n",
  "client_email": "seu_email@firebase.gserviceaccount.com",
  "client_id": "seu_client_id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "sua_cert_url"
}

```
🔒 Nunca adicione esse arquivo ao repositório público.

Ele deve estar apenas localmente no ambiente de desenvolvimento.

**Frontend** (`frontend/.env.local`)

Crie um arquivo `.env.local` na pasta `frontend` com variáveis de ambiente necessárias para o funcionamento do Next.js, como:
```env
FIREBASE_API_KEY=<sua_api_key>
FIREBASE_AUTH_DOMAIN=<seu_auth_domain>
FIREBASE_PROJECT_ID=<seu_project_id>
FIREBASE_STORAGE_BUCKET=<seu_storage_bucket>
FIREBASE_MESSAGING_SENDER_ID=<seu_sender_id>
FIREBASE_APP_ID=<seu_app_id>
FIREBASE_MEASUREMENT_ID=<seu_measurement_id>
```
O acesso das credênciais acesse o drive do projeto.

## 4️⃣ Rodar os servidores
**Backend**

```bash
cd backend
npm run start:dev
```
O backend será executado em http://localhost:3000 (ou outra porta definida no projeto).

**Frontend**

Abra outro terminal:
```bash
cd frontend
npm run dev
```
O frontend será executado em http://localhost:3000 (ou 3001 se você mudar a porta do backend).

Se der erro por falta do Next.js:
```bash
npm install next react react-dom
```

## 🧱 Estrutura do Projeto

```txt
Aplicacao-familia-viva/
│
├── backend/                   # Backend (NestJS)
│   ├── src/
│   │   └── config/            # Contém o firebase-config.json
│   ├── package.json
│   └── ...
│
├── frontend/                  # Frontend (Next.js)
│   ├── src/
│   │   ├── app/               # Estrutura de rotas do Next.js
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── firebase/          # Configurações do Firebase
│   │   └── styles/            # Estilos globais
│   ├── public/
│   │   ├── fonts/             # Fontes utilizadas no projeto
│   │   ├── images/            # Imagens estáticas
│   │   └── *.svg              # Arquivos SVG
│   ├── .env.local             # Variáveis de ambiente do frontend
│   ├── package.json
│   └── ...
│
├── node_modules/              # Dependências globais para o Firebase Hosting
├── .gitignore                 # Arquivos ignorados pelo Git
├── package.json               # Configuração do Firebase Hosting
├── package-lock.json          # Lockfile de dependências
├── README.md                  # Documentação do projeto

```