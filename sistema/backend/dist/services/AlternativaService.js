"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlternativaService = void 0;
const AlternativaRepository_1 = require("../repositories/AlternativaRepository");
class AlternativaService {
    constructor() {
        this.alternativaRepository = new AlternativaRepository_1.AlternativaRepository();
    }
    // Criar uma nova alternativa
    async criarAlternativa(questaoId, correta, descricao) {
        if (!descricao || descricao.trim().length === 0) {
            throw new Error("Descrição não pode ser vazia");
        }
        return await this.alternativaRepository.criar({
            questaoId,
            correta,
            descricao: descricao.trim(),
        });
    }
    // Buscar alternativas de uma questão
    async buscarAlternativasPorQuestao(questaoId) {
        return await this.alternativaRepository.buscarPorQuestaoId(questaoId);
    }
    // Atualizar uma alternativa
    async atualizarAlternativa(id, correta, descricao) {
        const alternativa = await this.alternativaRepository.buscarPorId(id);
        if (!alternativa) {
            throw new Error(`Alternativa com id ${id} não encontrada`);
        }
        const dataAtualizar = {};
        if (correta !== undefined)
            dataAtualizar.correta = correta;
        if (descricao !== undefined && descricao.trim().length > 0) {
            dataAtualizar.descricao = descricao.trim();
        }
        return await this.alternativaRepository.atualizar(id, dataAtualizar);
    }
    // Deletar uma alternativa
    async deletarAlternativa(id) {
        const alternativa = await this.alternativaRepository.buscarPorId(id);
        if (!alternativa) {
            throw new Error(`Alternativa com id ${id} não encontrada`);
        }
        return await this.alternativaRepository.deletar(id);
    }
    async deletarAlternativasPorQuestao(questaoId) {
        return this.alternativaRepository.buscarPorQuestaoId(questaoId).then(alternativas => {
            return Promise.all(alternativas.map(alt => this.deletarAlternativa(alt.id)));
        });
    }
}
exports.AlternativaService = AlternativaService;
