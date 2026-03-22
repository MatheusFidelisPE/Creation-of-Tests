"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvaRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ProvaRepository {
    // Criar uma nova prova
    async criar(data, questoesSelecionadas) {
        const prova = await prisma.prova.create({
            data: {
                tipoDeResposta: data.tipoDeResposta,
            },
        });
        // Adicionar as questões à prova
        for (let i = 0; i < questoesSelecionadas.length; i++) {
            await prisma.provaQuestao.create({
                data: {
                    provaId: prova.id,
                    questaoId: questoesSelecionadas[i],
                    ordem: i + 1,
                },
            });
        }
        return prova;
    }
    // Buscar uma prova pelo ID com detalhes
    async buscarPorId(id) {
        const prova = await prisma.prova.findUnique({
            where: { id },
            include: {
                questoes: {
                    include: {
                        questao: {
                            include: {
                                alternativas: true,
                            },
                        },
                    },
                    orderBy: {
                        ordem: "asc",
                    },
                },
            },
        });
        return prova;
    }
    // Buscar todas as provas
    async buscarTodas() {
        return await prisma.prova.findMany({
            include: {
                questoes: {
                    include: {
                        questao: true,
                    },
                    orderBy: {
                        ordem: "asc",
                    },
                },
            },
        });
    }
    // Deletar uma prova
    async deletar(id) {
        return await prisma.prova.delete({
            where: { id },
        });
    }
}
exports.ProvaRepository = ProvaRepository;
