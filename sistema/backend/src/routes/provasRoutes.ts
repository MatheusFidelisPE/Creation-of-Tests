import { Router } from "express";
import { ProvaController } from "../controllers/ProvaController";

const router = Router();

// Rotas para Provas
router.post("/", ProvaController.criarSelecionada);
router.post("/gerar", ProvaController.gerar);
router.post("/gerar-gabaritos", ProvaController.gerarGabaritos);
router.get("/", ProvaController.listar);
router.get("/:id", ProvaController.buscar);
router.put("/:id", ProvaController.atualizar);
router.post("/:id/corrigir", ProvaController.corrigir);
router.delete("/:id", ProvaController.deletar);

export default router;
