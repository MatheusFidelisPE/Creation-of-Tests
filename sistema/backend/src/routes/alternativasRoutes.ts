import { Router } from "express";
import { AlternativaController } from "../controllers/AlternativaController";

const router = Router();

// Rotas para Alternativas
router.post("/", AlternativaController.criar);
router.get("/questao/:questaoId", AlternativaController.listarPorQuestao);
router.put("/:id", AlternativaController.atualizar);
router.delete("/:id", AlternativaController.deletar);

export default router;
