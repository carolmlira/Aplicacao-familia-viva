const { onRequest } = require("firebase-functions/v2/https");
const express = require("express");
const next = require("next");
const path = require("path");
const cors = require("cors");

// Configuração do Next.js
const dev = false; // Sempre false em produção (Firebase)
const nextApp = next({
  dev,
  conf: {
    distDir: ".next", // Ou o diretório de build do seu Next.js
  },
});

process.env.NEXT_PUBLIC_FIREBASE_API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  "AIzaSyCQNt0wHVINKz3Ia0-oSg4bcgyo-00du1E";
process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN =
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
  "familia-viva-recife.firebaseapp.com";
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "familia-viva-recife";
process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
  "familia-viva-recife.firebasestorage.app";
process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID =
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "698056339313";
process.env.NEXT_PUBLIC_FIREBASE_APP_ID =
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
  "1:698056339313:web:20a804d35012ef96bfd0d0";
process.env.NEXT_PUBLIC_API_URL = "https://nestapi-7xc53kzq6a-uc.a.run.app/";
process.env.NEXT_PUBLIC_API_URL_NEXT =
  process.env.NEXT_PUBLIC_API_URL_NEXT ||
  "https://familia-viva-recife.web.app/";
process.env.NEXTAUTH_URL =
  process.env.NEXTAUTH_URL || "https://familia-viva-recife.web.app/";

const handle = nextApp.getRequestHandler();
const expressApp = express();

// Configurações do Express antes do handler do Next.js
expressApp.use(cors()); // cors() deve ser chamado como função
expressApp.use(express.json()); // Para parsing de JSON
expressApp.use(express.urlencoded({ extended: true })); // Para parsing de forms

// Servir arquivos estáticos do Next.js
expressApp.use(
  "/_next/static",
  express.static(path.join(__dirname, ".next/static"))
);

// 2. Configuração do NextAuth.js (exemplo)
expressApp.all("/api/auth/*", (req, res) => {
  // Seu código NextAuth.js aqui
  return handle(req, res); // Ou manipulação customizada
});

// 3. Todas outras rotas vão para o Next.js
expressApp.all("*", (req, res) => {
  return handle(req, res);
});

// Inicialização
exports.nextssr = onRequest(
  {
    region: "us-central1",
    timeoutSeconds: 60,
    memory: "512MiB",
    maxInstances: 2,
    concurrency: 80,
  },
  async (req, res) => {
    try {
      await nextApp.prepare(); // Prepara o Next.js
      return expressApp(req, res);
    } catch (err) {
      console.error("Error:", err);
      res.status(500).send("Server Error");
    }
  }
);
