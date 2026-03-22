"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestaoService = void 0;
const QuestaoRepository_1 = require("../repositories/QuestaoRepository");
class QuestaoService {
    constructor() {
        this.questaoRepository = new QuestaoRepository_1.QuestaoRepository();
    }
    // Criar uma nova questão
    async criarQuestao(enunciado) {
        if (!enunciado || enunciado.trim().length === 0) {
            throw new Error("Enunciado não pode ser vazio");
        }
        return await this.questaoRepository.criar({
            enunciado: enunciado.trim(),
        });
    }
    // Buscar uma questão
    async buscarQuestao(id) {
        const questao = await this.questaoRepository.buscarPorId(id);
        if (!questao) {
            throw new Error(`Questão com id ${id} não encontrada`);
        }
        return questao;
    }
    // Listar todas as questões
    async listarQuestoes() {
        return await this.questaoRepository.buscarTodas();
    }
    // Atualizar uma questão
    async atualizarQuestao(id, enunciado) {
        if (!enunciado || enunciado.trim().length === 0) {
            throw new Error("Enunciado não pode ser vazio");
        }
        const questao = await this.questaoRepository.buscarPorId(id);
        if (!questao) {
            throw new Error(`Questão com id ${id} não encontrada`);
        }
        return await this.questaoRepository.atualizar(id, {
            enunciado: enunciado.trim(),
        });
    }
    // Deletar uma questão
    async deletarQuestao(id) {
        const questao = await this.questaoRepository.buscarPorId(id);
        if (!questao) {
            throw new Error(`Questão com id ${id} não encontrada`);
        }
        return await this.questaoRepository.deletar(id);
    }
}
exports.QuestaoService = QuestaoService;
