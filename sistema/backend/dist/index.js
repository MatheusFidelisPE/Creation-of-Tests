"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const questoesRoutes_1 = __importDefault(require("./routes/questoesRoutes"));
const alternativasRoutes_1 = __importDefault(require("./routes/alternativasRoutes"));
const provasRoutes_1 = __importDefault(require("./routes/provasRoutes"));
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT || 3001);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rotas
app.get("/", (_req, res) => {
    res.json({
        message: "API backend sistema_de_provas em Node + TypeScript",
        version: "1.0.0",
        endpoints: {
            questoes: "/api/questoes",
            alternativas: "/api/alternativas",
            provas: "/api/provas",
        },
    });
});
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
// Integração das rotas
app.use("/api/questoes", questoesRoutes_1.default);
app.use("/api/alternativas", alternativasRoutes_1.default);
app.use("/api/provas", provasRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Servidor backend rodando em http://localhost:${PORT}`);
    console.log("API documentation:");
    console.log("- GET  /api/questoes - Listar todas as questões");
    console.log("- POST /api/questoes - Criar uma questão");
    console.log("- GET  /api/questoes/:id - Buscar uma questão");
    console.log("- PUT  /api/questoes/:id - Atualizar uma questão");
    console.log("- DELETE /api/questoes/:id - Deletar uma questão");
    console.log("");
    console.log("- POST /api/alternativas - Criar uma alternativa");
    console.log("- GET  /api/alternativas/questao/:questaoId - Listar alternativas");
    console.log("- PUT  /api/alternativas/:id - Atualizar uma alternativa");
    console.log("- DELETE /api/alternativas/:id - Deletar uma alternativa");
    console.log("");
    console.log("- POST /api/provas/gerar - Gerar uma prova");
    console.log("- POST /api/provas/gerar-gabaritos - Gerar ZIP com PDFs e gabaritos CSV para múltiplas provas");
    console.log("- GET  /api/provas - Listar todas as provas");
    console.log("- GET  /api/provas/:id - Buscar uma prova");
    console.log("- POST /api/provas/:id/corrigir - Corrigir uma prova");
    console.log("- DELETE /api/provas/:id - Deletar uma prova");
});
