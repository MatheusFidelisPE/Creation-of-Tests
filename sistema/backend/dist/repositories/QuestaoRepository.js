"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestaoRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class QuestaoRepository {
    // Criar uma nova questão
    async criar(data) {
        return await prisma.questao.create({
            data: {
                enunciado: data.enunciado,
            },
        });
    }
    // Buscar uma questão pelo ID
    async buscarPorId(id) {
        return await prisma.questao.findUnique({
            where: { id },
            include: {
                alternativas: true,
            },
        });
    }
    // Buscar todas as questões
    async buscarTodas() {
        return await prisma.questao.findMany({
            include: {
                alternativas: true,
            },
        });
    }
    // Buscar questões aleatórias
    async buscarAleatorias(quantidade) {
        const totalQuestoes = await prisma.questao.count();
        if (quantidade > totalQuestoes) {
            throw new Error(`Não há questões suficientes. Total: ${totalQuestoes}, Solicitado: ${quantidade}`);
        }
        // Buscar todas as questões
        const todasAsQuestoes = await prisma.questao.findMany({
            include: {
                alternativas: true,
            },
        });
        // Embaralhar e pegar a quantidade solicitada
        const questoesEmbaralhadas = todasAsQuestoes
            .sort(() => Math.random() - 0.5)
            .slice(0, quantidade);
        return questoesEmbaralhadas;
    }
    // Atualizar uma questão
    async atualizar(id, data) {
        return await prisma.questao.update({
            where: { id },
            data,
            include: {
                alternativas: true,
            },
        });
    }
    // Deletar uma questão
    async deletar(id) {
        return await prisma.questao.delete({
            where: { id },
        });
    }
}
exports.QuestaoRepository = QuestaoRepository;
