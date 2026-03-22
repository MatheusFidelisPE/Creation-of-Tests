import { Router } from "express";
import { QuestaoController } from "../controllers/QuestaoController";

const router = Router();

// Rotas para Questões
router.post("/", QuestaoController.criar);
router.get("/", QuestaoController.listar);
router.get("/:id", QuestaoController.buscar);
router.put("/:id", QuestaoController.atualizar);
router.delete("/:id", QuestaoController.deletar);

export default router;
