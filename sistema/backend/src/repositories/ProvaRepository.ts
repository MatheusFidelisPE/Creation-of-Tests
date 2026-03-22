import { PrismaClient } from "@prisma/client";
import { CreateProvaDTO } from "../models/Prova";

const prisma = new PrismaClient();

export class ProvaRepository {
  // Criar uma nova prova
  async criar(data: CreateProvaDTO, questoesSelecionadas: number[]) {
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
  async buscarPorId(id: number) {
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

  // Atualizar uma prova (tipo de resposta e questões)
  async atualizar(id: number, questoesSelecionadas: number[], tipoDeResposta: string) {
    await prisma.prova.update({
      where: { id },
      data: { tipoDeResposta },
    });

    await prisma.provaQuestao.deleteMany({
      where: { provaId: id },
    });

    for (let i = 0; i < questoesSelecionadas.length; i++) {
      await prisma.provaQuestao.create({
        data: {
          provaId: id,
          questaoId: questoesSelecionadas[i],
          ordem: i + 1,
        },
      });
    }

    return await this.buscarPorId(id);
  }

  // Deletar uma prova
  async deletar(id: number) {
    return await prisma.prova.delete({
      where: { id },
    });
  }
}
