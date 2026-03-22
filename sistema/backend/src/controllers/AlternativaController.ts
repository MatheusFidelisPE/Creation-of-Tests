import { Request, Response } from "express";
import { AlternativaService } from "../services/AlternativaService";

const alternativaService = new AlternativaService();

export class AlternativaController {
  // Criar uma alternativa
  static async criar(req: Request, res: Response) {
    try {
      const { questaoId, correta, descricao } = req.body;

      const alternativa = await alternativaService.criarAlternativa(
        questaoId,
        correta,
        descricao
      );
      res.status(201).json({
        success: true,
        data: alternativa,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Listar alternativas de uma questão
  static async listarPorQuestao(req: Request, res: Response) {
    try {
      const { questaoId } = req.params;
      const alternativas =
        await alternativaService.buscarAlternativasPorQuestao(Number(questaoId));
      res.status(200).json({
        success: true,
        data: alternativas,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Atualizar uma alternativa
  static async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { correta, descricao } = req.body;

      const alternativa = await alternativaService.atualizarAlternativa(
        Number(id),
        correta,
        descricao
      );
      res.status(200).json({
        success: true,
        data: alternativa,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  // Deletar uma alternativa
  static async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await alternativaService.deletarAlternativa(Number(id));
      res.status(200).json({
        success: true,
        message: "Alternativa deletada com sucesso",
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    }
  }
}
