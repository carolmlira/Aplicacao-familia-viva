"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.nestApi = void 0;
const functions = __importStar(require("firebase-functions/v1"));
const https_1 = require("firebase-functions/v2/https");
const express_1 = __importDefault(require("express"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createNestServer } = require("../../backend/dist/main");
const server = (0, express_1.default)();
let cachedHandler = null;
const emailConfig = functions.config().email || {};
process.env.EMAIL_USER =
    process.env.EMAIL_USER || emailConfig.user || "daniell.18sa@gmail.com";
process.env.EMAIL_PASS =
    process.env.EMAIL_PASS || emailConfig.pass || "jeswinrbqbibyylw";
process.env.JWT_SECRET =
    ((_a = functions.config().jwt) === null || _a === void 0 ? void 0 : _a.secret) ||
        process.env.JWT_SECRET ||
        "d646f7e030173ec33d28790690a7091c70cdc32ff363ee7bc341ff86849bcdd26ef48ac2814ea4553bece2ef63fb612f8015637f75950ae14563bfe43a490957";
console.log("Tem que atualizar crlh5");
async function initServer() {
    if (!cachedHandler) {
        console.log("Inicializando servidor NestJS...");
        // Aqui IMPORTANTE: atribuir a instância retornada (adaptada) à variável server
        // e criar o cachedHandler baseado nela
        const adaptedServer = await createNestServer(server);
        cachedHandler = (req, res) => adaptedServer(req, res);
    }
}
exports.nestApi = (0, https_1.onRequest)({
    region: "us-central1",
    timeoutSeconds: 120,
    memory: "512MiB",
}, async (req, res) => {
    await initServer();
    return cachedHandler(req, res);
});
//# sourceMappingURL=index.js.map