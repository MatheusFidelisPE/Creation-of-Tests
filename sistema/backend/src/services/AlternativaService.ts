import { AlternativaRepository } from "../repositories/AlternativaRepository";

export class AlternativaService {
  private alternativaRepository: AlternativaRepository;

  constructor() {
    this.alternativaRepository = new AlternativaRepository();
  }

  // Criar uma nova alternativa
  async criarAlternativa(
    questaoId: number,
    correta: boolean,
    descricao: string
  ) {
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
  async buscarAlternativasPorQuestao(questaoId: number) {
    return await this.alternativaRepository.buscarPorQuestaoId(questaoId);
  }

  // Atualizar uma alternativa
  async atualizarAlternativa(
    id: number,
    correta?: boolean,
    descricao?: string
  ) {
    const alternativa = await this.alternativaRepository.buscarPorId(id);
    if (!alternativa) {
      throw new Error(`Alternativa com id ${id} não encontrada`);
    }

    const dataAtualizar: any = {};
    if (correta !== undefined) dataAtualizar.correta = correta;
    if (descricao !== undefined && descricao.trim().length > 0) {
      dataAtualizar.descricao = descricao.trim();
    }

    return await this.alternativaRepository.atualizar(id, dataAtualizar);
  }

  // Deletar uma alternativa
  async deletarAlternativa(id: number) {
    const alternativa = await this.alternativaRepository.buscarPorId(id);
    if (!alternativa) {
      throw new Error(`Alternativa com id ${id} não encontrada`);
    }

    return await this.alternativaRepository.deletar(id);
  }
}
