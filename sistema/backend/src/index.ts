import express, { Request, Response } from "express";
import cors from "cors";
import questoesRoutes from "./routes/questoesRoutes";
import alternativasRoutes from "./routes/alternativasRoutes";
import provasRoutes from "./routes/provasRoutes";

const app = express();
const PORT = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json());

// Rotas
app.get("/", (_req: Request, res: Response) => {
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

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Integração das rotas
app.use("/api/questoes", questoesRoutes);
app.use("/api/alternativas", alternativasRoutes);
app.use("/api/provas", provasRoutes);

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
  console.log("- GET  /api/provas - Listar todas as provas");
  console.log("- GET  /api/provas/:id - Buscar uma prova");
  console.log("- POST /api/provas/:id/corrigir - Corrigir uma prova");
  console.log("- DELETE /api/provas/:id - Deletar uma prova");
});
