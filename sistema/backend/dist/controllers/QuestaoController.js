"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestaoController = void 0;
const QuestaoService_1 = require("../services/QuestaoService");
const questaoService = new QuestaoService_1.QuestaoService();
class QuestaoController {
    // Criar uma questão
    static async criar(req, res) {
        try {
            const { enunciado } = req.body;
            const questao = await questaoService.criarQuestao(enunciado);
            res.status(201).json({
                success: true,
                data: questao,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    // Buscar uma questão
    static async buscar(req, res) {
        try {
            const { id } = req.params;
            const questao = await questaoService.buscarQuestao(Number(id));
            res.status(200).json({
                success: true,
                data: questao,
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                error: error.message,
            });
        }
    }
    // Listar todas as questões
    static async listar(req, res) {
        try {
            const questoes = await questaoService.listarQuestoes();
            res.status(200).json({
                success: true,
                data: questoes,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
    // Atualizar uma questão
    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { enunciado, alternativas } = req.body;
            const questao = await questaoService.atualizarQuestao(Number(id), enunciado, alternativas);
            res.status(200).json({
                success: true,
                data: questao,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    // Deletar uma questão
    static async deletar(req, res) {
        try {
            const { id } = req.params;
            await questaoService.deletarQuestao(Number(id));
            res.status(200).json({
                success: true,
                message: "Questão deletada com sucesso",
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                error: error.message,
            });
        }
    }
}
exports.QuestaoController = QuestaoController;
