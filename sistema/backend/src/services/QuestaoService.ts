import { QuestaoRepository } from "../repositories/QuestaoRepository";
import { AlternativaService } from "./AlternativaService";

export class QuestaoService {
  private questaoRepository: QuestaoRepository;
  private alternativaService: AlternativaService;

  constructor() {
    this.questaoRepository = new QuestaoRepository();
    this.alternativaService = new AlternativaService();
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

  // Atualizar uma questão (enunciado + alternativas)
  async atualizarQuestao(
    id: number,
    enunciado: string,
    alternativas?: Omit<{ id?: number; questaoId?: number; descricao: string; correta: boolean; }, 'id' | 'questaoId'>[]
  ) {
    if (!enunciado || enunciado.trim().length === 0) {
      throw new Error("Enunciado não pode ser vazio");
    }

    const questao = await this.questaoRepository.buscarPorId(id);
    if (!questao) {
      throw new Error(`Questão com id ${id} não encontrada`);
    }

    const questaoAtualizada = await this.questaoRepository.atualizar(id, {
      enunciado: enunciado.trim(),
    });

    if (alternativas && alternativas.length > 0) {
      await this.alternativaService.deletarAlternativasPorQuestao(id);

      for (const alt of alternativas) {
        await this.alternativaService.criarAlternativa(id, alt.correta, alt.descricao);
      }
    }

    return await this.questaoRepository.buscarPorId(id);
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
