import { QuestaoRepository } from "../repositories/QuestaoRepository";

export class QuestaoService {
  private questaoRepository: QuestaoRepository;

  constructor() {
    this.questaoRepository = new QuestaoRepository();
  }

  // Criar uma nova questão
  async criarQuestao(enunciado: string) {
    if (!enunciado || enunciado.trim().length === 0) {
      throw new Error("Enunciado não pode ser vazio");
    }

    return await this.questaoRepository.criar({
      enunciado: enunciado.trim(),
    });
  }

  // Buscar uma questão
  async buscarQuestao(id: number) {
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
  async atualizarQuestao(id: number, enunciado: string) {
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
  async deletarQuestao(id: number) {
    const questao = await this.questaoRepository.buscarPorId(id);
    if (!questao) {
      throw new Error(`Questão com id ${id} não encontrada`);
    }

    return await this.questaoRepository.deletar(id);
  }
}
