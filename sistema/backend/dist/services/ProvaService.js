"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvaService = void 0;
const ProvaRepository_1 = require("../repositories/ProvaRepository");
const QuestaoRepository_1 = require("../repositories/QuestaoRepository");
const CorrecaoService_1 = require("./CorrecaoService");
class ProvaService {
    constructor() {
        this.provaRepository = new ProvaRepository_1.ProvaRepository();
        this.questaoRepository = new QuestaoRepository_1.QuestaoRepository();
        this.correcaoService = new CorrecaoService_1.CorrecaoService();
    }
    // Gerar uma prova com questões aleatórias
    async gerarProva(data) {
        if (data.quantidadeQuestoes < 1) {
            throw new Error("Quantidade de questões deve ser no mínimo 1");
        }
        // Buscar questões aleatórias
        const questoesAleatorias = await this.questaoRepository.buscarAleatorias(data.quantidadeQuestoes);
        // Embaralhar alternativas de cada questão
        const questoesComAlternativasEmbaralhadas = questoesAleatorias.map((questao) => ({
            ...questao,
            alternativas: questao.alternativas.sort(() => Math.random() - 0.5),
        }));
        // Criar a prova no banco
        const questaoIds = questoesAleatorias.map((q) => q.id);
        const prova = await this.provaRepository.criar(data, questaoIds);
        // Retornar com as questões
        const provaComQuestoes = await this.provaRepository.buscarPorId(prova.id);
        return {
            ...provaComQuestoes,
            questoes: questoesComAlternativasEmbaralhadas.map((q, index) => ({
                ...q,
                alternativas: undefined,
            })),
        };
    }
    // Buscar uma prova
    async buscarProva(id) {
        const prova = await this.provaRepository.buscarPorId(id);
        if (!prova) {
            throw new Error(`Prova com id ${id} não encontrada`);
        }
        return prova;
    }
    // Listar todas as provas
    async listarProvas() {
        return await this.provaRepository.buscarTodas();
    }
    // Corrigir uma prova
    async corrigirProva(provaId, respostasDoUsuario) {
        const prova = await this.provaRepository.buscarPorId(provaId);
        if (!prova) {
            throw new Error(`Prova com id ${provaId} não encontrada`);
        }
        return await this.correcaoService.corrigir(prova, respostasDoUsuario);
    }
    // Deletar uma prova
    async deletarProva(id) {
        const prova = await this.provaRepository.buscarPorId(id);
        if (!prova) {
            throw new Error(`Prova com id ${id} não encontrada`);
        }
        return await this.provaRepository.deletar(id);
    }
}
exports.ProvaService = ProvaService;
