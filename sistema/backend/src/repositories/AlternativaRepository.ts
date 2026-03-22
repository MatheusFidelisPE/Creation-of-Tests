import { PrismaClient } from "@prisma/client";
import { CreateAlternativaDTO } from "../models/Alternativa";

const prisma = new PrismaClient();

export class AlternativaRepository {
  // Criar uma nova alternativa
  async criar(data: CreateAlternativaDTO) {
    return await prisma.alternativa.create({
      data: {
        questaoId: data.questaoId,
        correta: data.correta,
        descricao: data.descricao,
      },
    });
  }

  // Buscar alternativas por questão
  async buscarPorQuestaoId(questaoId: number) {
    return await prisma.alternativa.findMany({
      where: { questaoId },
    });
  }

  // Buscar uma alternativa pelo ID
  async buscarPorId(id: number) {
    return await prisma.alternativa.findUnique({
      where: { id },
    });
  }

  // Atualizar uma alternativa
  async atualizar(id: number, data: Partial<CreateAlternativaDTO>) {
    return await prisma.alternativa.update({
      where: { id },
      data,
    });
  }

  // Deletar uma alternativa
  async deletar(id: number) {
    return await prisma.alternativa.delete({
      where: { id },
    });
  }
}
