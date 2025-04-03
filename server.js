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
