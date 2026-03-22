"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const QuestaoController_1 = require("../controllers/QuestaoController");
const router = (0, express_1.Router)();
// Rotas para Questões
router.post("/", QuestaoController_1.QuestaoController.criar);
router.get("/", QuestaoController_1.QuestaoController.listar);
router.get("/:id", QuestaoController_1.QuestaoController.buscar);
router.put("/:id", QuestaoController_1.QuestaoController.atualizar);
router.delete("/:id", QuestaoController_1.QuestaoController.deletar);
exports.default = router;
