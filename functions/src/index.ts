import { onRequest } from "firebase-functions/v2/https";
import express from "express";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createNestServer } = require("../backend-dist/main");

const server = express();
let nestApp: any = null;

process.env.EMAIL_USER = process.env.EMAIL_USER || "daniell.18sa@gmail.com";
process.env.EMAIL_PASS = process.env.EMAIL_PASS || "jeswinrbqbibyylw";

process.env.JWT_SECRET =
  "d646f7e030173ec33d28790690a7091c70cdc32ff363ee7bc341ff86849bcdd26ef48ac2814ea4553bece2ef63fb612f8015637f75950ae14563bfe43a490957";
console.log("Tem que atualizar crlh6");

export const nestApi = onRequest(
  {
    region: "us-central1",
    timeoutSeconds: 540,
    memory: "256MiB",
    maxInstances: 1,
    concurrency: 80,
  },
  async (req, res) => {
    if (!nestApp) {
      console.log("🚀 Inicializando NestJS no Firebase...");
      try {
        process.env.PORT = "8080"; // Força a porta que o Cloud Run espera
        nestApp = await createNestServer(server);
        console.log("✅ NestJS inicializado com sucesso");
      } catch (error) {
        console.error("❌ Falha na inicialização:", error);
        return res.status(500).send("Erro interno do servidor");
      }
    }
    return server(req, res);
  }
);
