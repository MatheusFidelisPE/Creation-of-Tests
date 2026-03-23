"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProvaController_1 = require("../controllers/ProvaController");
const router = (0, express_1.Router)();
// Rotas para Provas
router.post("/", ProvaController_1.ProvaController.criarSelecionada);
router.post("/gerar", ProvaController_1.ProvaController.gerar);
router.post("/gerar-gabaritos", ProvaController_1.ProvaController.gerarGabaritos);
router.get("/", ProvaController_1.ProvaController.listar);
router.get("/:id", ProvaController_1.ProvaController.buscar);
router.put("/:id", ProvaController_1.ProvaController.atualizar);
router.post("/:id/corrigir", ProvaController_1.ProvaController.corrigir);
router.delete("/:id", ProvaController_1.ProvaController.deletar);
exports.default = router;
