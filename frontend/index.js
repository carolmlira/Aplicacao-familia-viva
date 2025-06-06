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
    distDir: ".next",
  },
});

const handle = nextApp.getRequestHandler();
const expressApp = express();
expressApp.set("trust proxy", true);

expressApp.use(
  cors({
    origin: true, // Permite todas as origens (em desenvolvimento)
    credentials: true, // Permite cookies
  })
);

// Servir arquivos estáticos do Next.js

// 2. Configuração do NextAuth.js (exemplo)
const staticPath = path.join(__dirname, ".next/static");
console.log("Serving static files from:", staticPath);
expressApp.use("/_next/static", express.static(staticPath));

// 3. Todas outras rotas vão para o Next.js
expressApp.all("*", (req, res) => {
  console.log("[NEXT] Handling request:", req.method, req.url);
  return handle(req, res);
});

// Prepare uma vez
let isPrepared = false;
const prepareApp = async () => {
  if (!isPrepared) {
    await nextApp.prepare();
    isPrepared = true;
  }
};
// Inicialização
exports.Familia_Viva_Recife = onRequest(
  {
    region: "us-central1",
    timeoutSeconds: 60,
    memory: "512MiB",
    maxInstances: 2,
    concurrency: 80,
  },
  async (req, res) => {
    console.log(`Request to: ${req.url} `);
    try {
      await prepareApp(); // Prepara o Next.js
      return expressApp(req, res);
    } catch (err) {
      console.error("Error:", err);
      res.status(500).send("Server Error");
    }
  }
);
