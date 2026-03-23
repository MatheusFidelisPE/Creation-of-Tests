import { Request, Response } from "express";
import { ProvaService } from "../services/ProvaService";

const provaService = new ProvaService();

export class ProvaController {
  // Gerar uma prova com questões aleatórias
  static async gerar(req: Request, res: Response) {
    try {
      const { quantidadeQuestoes, tipoDeResposta } = req.body;

      const tipo = tipoDeResposta === "NUMEROS" ? "SOMA_EXPONENCIAL" : "LETRAS";
      const prova = await provaService.gerarProva({
        quantidadeQuestoes,
        tipoDeResposta: tipo,
      });

      res.status(201).json({
        success: true,
        data: prova,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Criar uma prova com questões selecionadas
  static async criarSelecionada(req: Request, res: Response) {
    try {
      const { questoes, tipoDeResposta } = req.body;

      const prova = await provaService.criarProvaSelecionada({
        questoes,
        tipoDeResposta,
      });

      res.status(201).json({
        success: true,
        data: prova,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Buscar uma prova
  static async buscar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const prova = await provaService.buscarProva(Number(id));
      res.status(200).json({
        success: true,
        data: prova,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Listar todas as provas
  static async listar(req: Request, res: Response) {
    try {
      const provas = await provaService.listarProvas();
      res.status(200).json({
        success: true,
        data: provas,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Corrigir uma prova
  static async corrigir(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { respostas } = req.body;

      const resultado = await provaService.corrigirProva(Number(id), respostas);

      res.status(200).json({
        success: true,
        data: resultado,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Atualizar uma prova existente
  static async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { questoes, tipoDeResposta } = req.body;

      const provaAtualizada = await provaService.atualizarProva(Number(id), {
        questoes,
        tipoDeResposta,
      });

      res.status(200).json({
        success: true,
        data: provaAtualizada,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Deletar uma prova
  static async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await provaService.deletarProva(Number(id));
      res.status(200).json({
        success: true,
        message: "Prova deletada com sucesso",
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Gerar gabaritos para múltiplas provas
  static async gerarGabaritos(req: Request, res: Response) {
    try {
      const { prova_id, quantidade_provas, nome_professor, nome_disciplina, data } = req.body;

      // Validar campos obrigatórios
      if (!prova_id || !quantidade_provas || !nome_professor || !nome_disciplina || !data) {
        return res.status(400).json({
          success: false,
          error: "Todos os campos são obrigatórios: prova_id, quantidade_provas, nome_professor, nome_disciplina, data",
        });
      }

      const result = await provaService.gerarGabaritos({
        prova_id: Number(prova_id),
        quantidade_provas: Number(quantidade_provas),
        nome_professor,
        nome_disciplina,
        data,
      });

      // Retornar CSV
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="gabarito_${prova_id}_${Date.now()}.csv"`);
      res.status(200).send(result.csv);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
}
