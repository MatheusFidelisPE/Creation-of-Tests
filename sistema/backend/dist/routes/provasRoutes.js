"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProvaController_1 = require("../controllers/ProvaController");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
// Configurar multer para upload de arquivos em memória
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// Rotas para Provas
router.post("/", ProvaController_1.ProvaController.criarSelecionada);
router.post("/gerar", ProvaController_1.ProvaController.gerar);
router.post("/gerar-gabaritos", ProvaController_1.ProvaController.gerarGabaritos);
router.post("/corrigir-provas", upload.fields([
    { name: "gabaritos", maxCount: 1 },
    { name: "respostas", maxCount: 1 },
]), ProvaController_1.ProvaController.corrigirProvasCSV);
router.get("/", ProvaController_1.ProvaController.listar);
router.get("/:id", ProvaController_1.ProvaController.buscar);
router.put("/:id", ProvaController_1.ProvaController.atualizar);
router.post("/:id/corrigir", ProvaController_1.ProvaController.corrigir);
router.delete("/:id", ProvaController_1.ProvaController.deletar);
exports.default = router;
