"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlternativaRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class AlternativaRepository {
    // Criar uma nova alternativa
    async criar(data) {
        return await prisma.alternativa.create({
            data: {
                questaoId: data.questaoId,
                correta: data.correta,
                descricao: data.descricao,
            },
        });
    }
    // Buscar alternativas por questão
    async buscarPorQuestaoId(questaoId) {
        return await prisma.alternativa.findMany({
            where: { questaoId },
        });
    }
    // Buscar uma alternativa pelo ID
    async buscarPorId(id) {
        return await prisma.alternativa.findUnique({
            where: { id },
        });
    }
    // Atualizar uma alternativa
    async atualizar(id, data) {
        return await prisma.alternativa.update({
            where: { id },
            data,
        });
    }
    // Deletar uma alternativa
    async deletar(id) {
        return await prisma.alternativa.delete({
            where: { id },
        });
    }
}
exports.AlternativaRepository = AlternativaRepository;
