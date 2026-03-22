"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AlternativaController_1 = require("../controllers/AlternativaController");
const router = (0, express_1.Router)();
// Rotas para Alternativas
router.post("/", AlternativaController_1.AlternativaController.criar);
router.get("/questao/:questaoId", AlternativaController_1.AlternativaController.listarPorQuestao);
router.put("/:id", AlternativaController_1.AlternativaController.atualizar);
router.delete("/:id", AlternativaController_1.AlternativaController.deletar);
exports.default = router;
