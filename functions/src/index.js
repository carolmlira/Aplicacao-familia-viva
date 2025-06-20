"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nestApi = void 0;
const https_1 = require("firebase-functions/v2/https");
const express_1 = __importDefault(require("express"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createNestServer } = require("../backend-dist/main");
const server = (0, express_1.default)();
let nestApp = null;
process.env.EMAIL_USER =
    process.env.EMAIL_USER || "recifefamiliaviva@gmail.com";
process.env.EMAIL_PASS = process.env.EMAIL_PASS || "familiaviva4567";
process.env.JWT_SECRET =
    "d646f7e030173ec33d28790690a7091c70cdc32ff363ee7bc341ff86849bcdd26ef48ac2814ea4553bece2ef63fb612f8015637f75950ae14563bfe43a490957";
console.log("Tem que atualizar crlh6");
exports.nestApi = (0, https_1.onRequest)({
    region: "us-central1",
    timeoutSeconds: 540,
    memory: "256MiB",
    maxInstances: 1,
    concurrency: 80,
}, async (req, res) => {
    if (!nestApp) {
        console.log("🚀 Inicializando NestJS no Firebase...");
        try {
            process.env.PORT = "8080"; // Força a porta que o Cloud Run espera
            nestApp = await createNestServer(server);
            console.log("✅ NestJS inicializado com sucesso");
        }
        catch (error) {
            console.error("❌ Falha na inicialização:", error);
            return res.status(500).send("Erro interno do servidor");
        }
    }
    return server(req, res);
});
//# sourceMappingURL=index.js.map