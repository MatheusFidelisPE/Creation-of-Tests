import { PrismaClient } from "@prisma/client";
import { CreateQuestaoDTO } from "../models/Questao";

const prisma = new PrismaClient();

export class QuestaoRepository {
  // Criar uma nova questão
  async criar(data: CreateQuestaoDTO) {
    return await prisma.questao.create({
      data: {
        enunciado: data.enunciado,
      },
    });
  }

  // Buscar uma questão pelo ID
  async buscarPorId(id: number) {
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
  async buscarAleatorias(quantidade: number) {
    const totalQuestoes = await prisma.questao.count();

    if (quantidade > totalQuestoes) {
      throw new Error(
        `Não há questões suficientes. Total: ${totalQuestoes}, Solicitado: ${quantidade}`
      );
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
  async atualizar(id: number, data: Partial<CreateQuestaoDTO>) {
    return await prisma.questao.update({
      where: { id },
      data,
      include: {
        alternativas: true,
      },
    });
  }

  // Deletar uma questão
  async deletar(id: number) {
    return await prisma.questao.delete({
      where: { id },
    });
  }
}
