import { Router } from "express";
import { ProvaController } from "../controllers/ProvaController";
import multer from "multer";

const router = Router();

// Configurar multer para upload de arquivos em memória
const upload = multer({ storage: multer.memoryStorage() });

// Rotas para Provas
router.post("/", ProvaController.criarSelecionada);
router.post("/gerar", ProvaController.gerar);
router.post("/gerar-gabaritos", ProvaController.gerarGabaritos);
router.post(
  "/corrigir-provas",
  upload.fields([
    { name: "gabaritos", maxCount: 1 },
    { name: "respostas", maxCount: 1 },
  ]),
  ProvaController.corrigirProvasCSV
);
router.get("/", ProvaController.listar);
router.get("/:id", ProvaController.buscar);
router.put("/:id", ProvaController.atualizar);
router.post("/:id/corrigir", ProvaController.corrigir);
router.delete("/:id", ProvaController.deletar);

export default router;
