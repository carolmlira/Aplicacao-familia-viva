import * as functions from "firebase-functions/v1";
import { onRequest } from "firebase-functions/v2/https";
import express, { Request, Response } from "express";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createNestServer } = require("../../backend/dist/main");

const server = express();

let cachedHandler: ((req: Request, res: Response) => void) | null = null;

const emailConfig = functions.config().email || {};
process.env.EMAIL_USER =
  process.env.EMAIL_USER || emailConfig.user || "daniell.18sa@gmail.com";
process.env.EMAIL_PASS =
  process.env.EMAIL_PASS || emailConfig.pass || "jeswinrbqbibyylw";

process.env.JWT_SECRET =
  functions.config().jwt?.secret ||
  process.env.JWT_SECRET ||
  "d646f7e030173ec33d28790690a7091c70cdc32ff363ee7bc341ff86849bcdd26ef48ac2814ea4553bece2ef63fb612f8015637f75950ae14563bfe43a490957";
console.log("Tem que atualizar crlh5");

async function initServer() {
  if (!cachedHandler) {
    console.log("Inicializando servidor NestJS...");
    // Aqui IMPORTANTE: atribuir a instância retornada (adaptada) à variável server
    // e criar o cachedHandler baseado nela
    const adaptedServer = await createNestServer(server);
    cachedHandler = (req: Request, res: Response) => adaptedServer(req, res);
  }
}

export const nestApi = onRequest(
  {
    region: "us-central1",
    timeoutSeconds: 120,
    memory: "512MiB",
  },
  async (req: Request, res: Response) => {
    await initServer();
    return cachedHandler!(req, res);
  }
);
