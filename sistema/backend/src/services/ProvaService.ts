import { ProvaRepository } from "../repositories/ProvaRepository";
import { QuestaoRepository } from "../repositories/QuestaoRepository";
import { CreateProvaDTO, CreateProvaComQuestoesSelecionadasDTO, ResultadoCorrecaoDTO, UpdateProvaDTO, GeradorGabaritosDTO, Gabarito } from "../models/Prova";
import { CorrecaoService } from "./CorrecaoService";

export class ProvaService {
  private provaRepository: ProvaRepository;
  private questaoRepository: QuestaoRepository;
  private correcaoService: CorrecaoService;

  constructor() {
    this.provaRepository = new ProvaRepository();
    this.questaoRepository = new QuestaoRepository();
    this.correcaoService = new CorrecaoService();
  }

  // Gerar uma prova com questões aleatórias
  async gerarProva(data: CreateProvaDTO) {
    if (data.quantidadeQuestoes < 1) {
      throw new Error("Quantidade de questões deve ser no mínimo 1");
    }

    const tipo = data.tipoDeResposta;

    // Buscar questões aleatórias
    const questoesAleatorias =
      await this.questaoRepository.buscarAleatorias(
        data.quantidadeQuestoes
      );

    // Embaralhar alternativas de cada questão
    const questoesComAlternativasEmbaralhadas = questoesAleatorias.map(
      (questao) => ({
        ...questao,
        alternativas: questao.alternativas.sort(() => Math.random() - 0.5),
      })
    );

    // Criar a prova no banco
    const questaoIds = questoesAleatorias.map((q) => q.id);
    const prova = await this.provaRepository.criar({ quantidadeQuestoes: data.quantidadeQuestoes, tipoDeResposta: tipo }, questaoIds);

    // Retornar com as questões
    const provaComQuestoes = await this.provaRepository.buscarPorId(prova.id);

    return {
      ...provaComQuestoes,
      questoes: questoesComAlternativasEmbaralhadas.map((q) => ({
        ...q,
        alternativas: undefined,
      })),
    };
  }

  // Criar uma prova com questões selecionadas
  async criarProvaSelecionada(data: CreateProvaComQuestoesSelecionadasDTO) {
    if (!data.questoes || data.questoes.length < 1) {
      throw new Error("Deve ser selecionado no mínimo 1 questão");
    }

    // Buscar as questões selecionadas
    const questoesSelecionadas = await Promise.all(
      data.questoes.map((id) => this.questaoRepository.buscarPorId(id))
    );

    // Validar que todas as questões foram encontradas
    const questoesValidas = questoesSelecionadas.filter((q) => q !== null);
    if (questoesValidas.length !== data.questoes.length) {
      throw new Error("Uma ou mais questões não foram encontradas");
    }

    // Embaralhar alternativas de cada questão
    const questoesComAlternativasEmbaralhadas = questoesValidas.map(
      (questao: any) => ({
        ...questao,
        alternativas: questao.alternativas.sort(() => Math.random() - 0.5),
      })
    );

    // Criar a prova no banco
    const createProvaDTO: CreateProvaDTO = {
      quantidadeQuestoes: data.questoes.length,
      tipoDeResposta: data.tipoDeResposta === "NUMEROS" ? "SOMA_EXPONENCIAL" : "LETRAS",
    };
    
    const prova = await this.provaRepository.criar(createProvaDTO, data.questoes);

    // Retornar com as questões
    const provaComQuestoes = await this.provaRepository.buscarPorId(prova.id);

    return {
      ...provaComQuestoes,
      questoes: questoesComAlternativasEmbaralhadas.map((q) => ({
        ...q,
        alternativas: undefined,
      })),
    };
  }

  // Buscar uma prova
  async buscarProva(id: number) {
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
  async corrigirProva(
    provaId: number,
    respostasDoUsuario: { questaoId: number; resposta: string }[]
  ): Promise<ResultadoCorrecaoDTO> {
    const prova = await this.provaRepository.buscarPorId(provaId);
    if (!prova) {
      throw new Error(`Prova com id ${provaId} não encontrada`);
    }

    return await this.correcaoService.corrigir(prova, respostasDoUsuario);
  }

  // Atualizar uma prova (adicionar/remover questões e tipo de resposta)
  async atualizarProva(id: number, data: UpdateProvaDTO) {
    const prova = await this.provaRepository.buscarPorId(id);
    if (!prova) {
      throw new Error(`Prova com id ${id} não encontrada`);
    }

    if (!data.questoes || data.questoes.length < 1) {
      throw new Error("Deve ser selecionado no mínimo 1 questão");
    }

    const tipo = data.tipoDeResposta === "NUMEROS" ? "SOMA_EXPONENCIAL" : "LETRAS";

    const provaAtualizada = await this.provaRepository.atualizar(id, data.questoes, tipo);
    return provaAtualizada;
  }

  // Deletar uma prova
  async deletarProva(id: number) {
    const prova = await this.provaRepository.buscarPorId(id);
    if (!prova) {
      throw new Error(`Prova com id ${id} não encontrada`);
    }

    return await this.provaRepository.deletar(id);
  }

  // Gerar múltiplas provas com gabaritos
  async gerarGabaritos(data: GeradorGabaritosDTO): Promise<{ csv: string; gabaritos: Gabarito[] }> {
    // Validar entrada
    if (data.quantidade_provas < 1) {
      throw new Error("Quantidade de provas deve ser no mínimo 1");
    }

    // Buscar a prova com suas questões
    const prova = await this.provaRepository.buscarPorId(data.prova_id);
    if (!prova) {
      throw new Error(`Prova com id ${data.prova_id} não encontrada`);
    }

    // Extrair questões da prova
    const questoesDaProva = prova.questoes.map((pq: any) => pq.questao);

    if (questoesDaProva.length === 0) {
      throw new Error("A prova não possui questões");
    }

    // Array para armazenar os gabaritos
    const gabaritos: Gabarito[] = [];

    // Gerar n provas diferentes
    for (let i = 0; i < data.quantidade_provas; i++) {
      // Embaralhar ordem das questões
      const questoesEmbaralhadas = [...questoesDaProva].sort(() => Math.random() - 0.5);
      
      // Para cada questão, embaralhar as alternativas e extrair as corretas
      const gabaritoDaProva: (string | number)[] = [];

      for (const questao of questoesEmbaralhadas) {
        // Embaralhar alternativas
        const alternativasEmbaralhadas = [...questao.alternativas].sort(() => Math.random() - 0.5);

        // Gerar gabarito baseado no tipo de resposta
        if (prova.tipoDeResposta === "LETRAS") {
          // Retornar as letras corretas (A, B, C, D, E, etc)
          const letras: string[] = [];
          alternativasEmbaralhadas.forEach((alt: any, index: number) => {
            if (alt.correta) {
              letras.push(String.fromCharCode(65 + index));
            }
          });
          gabaritoDaProva.push(letras.join(""));
        } else if (prova.tipoDeResposta === "SOMA_EXPONENCIAL") {
          // Retornar a soma de 2^(posição)
          let soma = 0;
          alternativasEmbaralhadas.forEach((alt: any, index: number) => {
            if (alt.correta) {
              soma += Math.pow(2, index);
            }
          });
          gabaritoDaProva.push(soma);
        }
      }

      // Gerar ID único para a prova
      const idUnico = `${data.prova_id}_${Date.now()}_${i}`;

      gabaritos.push({
        id: idUnico,
        gabaritos: gabaritoDaProva,
      });
    }

    // Gerar CSV
    const csv = this.gerarCSV(gabaritos, questoesDaProva.length);

    return { csv, gabaritos };
  }

  // Gerar CSV a partir dos gabaritos
  private gerarCSV(gabaritos: Gabarito[], quantidadeQuestoes: number): string {
    // Cabeçalho
    const headers = ["ID"];
    for (let i = 1; i <= quantidadeQuestoes; i++) {
      headers.push(`Questão ${i}`);
    }

    let csv = headers.join(",") + "\n";

    // Dados
    for (const gabarito of gabaritos) {
      const linha = [gabarito.id, ...gabarito.gabaritos];
      csv += linha.join(",") + "\n";
    }

    return csv;
  }
}
