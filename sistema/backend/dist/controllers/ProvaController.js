"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvaController = void 0;
const ProvaService_1 = require("../services/ProvaService");
const provaService = new ProvaService_1.ProvaService();
class ProvaController {
    // Gerar uma prova com questões aleatórias
    static async gerar(req, res) {
        try {
            const { quantidadeQuestoes, tipoDeResposta } = req.body;
            const prova = await provaService.gerarProva({
                quantidadeQuestoes,
                tipoDeResposta: tipoDeResposta || "LETRAS",
            });
            res.status(201).json({
                success: true,
                data: prova,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    // Buscar uma prova
    static async buscar(req, res) {
        try {
            const { id } = req.params;
            const prova = await provaService.buscarProva(Number(id));
            res.status(200).json({
                success: true,
                data: prova,
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                error: error.message,
            });
        }
    }
    // Listar todas as provas
    static async listar(req, res) {
        try {
            const provas = await provaService.listarProvas();
            res.status(200).json({
                success: true,
                data: provas,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
    // Corrigir uma prova
    static async corrigir(req, res) {
        try {
            const { id } = req.params;
            const { respostas } = req.body;
            const resultado = await provaService.corrigirProva(Number(id), respostas);
            res.status(200).json({
                success: true,
                data: resultado,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    // Deletar uma prova
    static async deletar(req, res) {
        try {
            const { id } = req.params;
            await provaService.deletarProva(Number(id));
            res.status(200).json({
                success: true,
                message: "Prova deletada com sucesso",
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
exports.ProvaController = ProvaController;
