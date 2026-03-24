"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvaController = void 0;
const ProvaService_1 = require("../services/ProvaService");
const CorrecaoCSVService_1 = require("../services/CorrecaoCSVService");
const archiver_1 = __importDefault(require("archiver"));
const provaService = new ProvaService_1.ProvaService();
class ProvaController {
    // Gerar uma prova com questões aleatórias
    static async gerar(req, res) {
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
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    // Criar uma prova com questões selecionadas
    static async criarSelecionada(req, res) {
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
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    // Buscar uma prova
    static async buscar(req, res) {
        try {
            const { id } = req.params;
            const prova = await provaService.buscarProva(Number(id));
            res.status(200).json({
                success: true,
                data: prova,
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                error: error.message,
            });
        }
    }
    // Listar todas as provas
    static async listar(req, res) {
        try {
            const provas = await provaService.listarProvas();
            res.status(200).json({
                success: true,
                data: provas,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
    // Corrigir uma prova
    static async corrigir(req, res) {
        try {
            const { id } = req.params;
            const { respostas } = req.body;
            const resultado = await provaService.corrigirProva(Number(id), respostas);
            res.status(200).json({
                success: true,
                data: resultado,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    // Atualizar uma prova existente
    static async atualizar(req, res) {
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
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    // Deletar uma prova
    static async deletar(req, res) {
        try {
            const { id } = req.params;
            await provaService.deletarProva(Number(id));
            res.status(200).json({
                success: true,
                message: "Prova deletada com sucesso",
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                error: error.message,
            });
        }
    }
    // Gerar gabaritos para múltiplas provas
    static async gerarGabaritos(req, res) {
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
            // Gerar PDF
            const pdfBuffer = await provaService.gerarPDF(result.provas, result.tipoResposta, nome_professor, nome_disciplina, data);
            // Criar arquivo ZIP
            const archive = (0, archiver_1.default)("zip", {
                zlib: { level: 9 } // Melhor compressão
            });
            // Configurar headers para download do ZIP
            res.setHeader("Content-Type", "application/zip");
            res.setHeader("Content-Disposition", `attachment; filename="provas_gabaritos_${prova_id}_${Date.now()}.zip"`);
            // Pipe do archive para a resposta
            archive.pipe(res);
            // Adicionar PDF ao ZIP
            archive.append(pdfBuffer, { name: `provas_${prova_id}.pdf` });
            // Adicionar CSV ao ZIP
            archive.append(result.csv, { name: `gabaritos_${prova_id}.csv` });
            // Finalizar o archive
            await archive.finalize();
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    // Corrigir provas baseado em arquivos CSV
    static async corrigirProvasCSV(req, res) {
        try {
            const files = req.files;
            const { tipo_resposta, rigor } = req.body;
            // Validar arquivos
            if (!files || files.length !== 2) {
                return res.status(400).json({
                    success: false,
                    error: "Deve ser enviado exatamente 2 arquivos CSV (gabarito e respostas)",
                });
            }
            // Validar tipo de resposta
            if (!tipo_resposta || !["LETRAS", "SOMA_EXPONENCIAL"].includes(tipo_resposta)) {
                return res.status(400).json({
                    success: false,
                    error: "tipo_resposta deve ser 'LETRAS' ou 'SOMA_EXPONENCIAL'",
                });
            }
            // Validar rigor
            /*if (rigor === undefined || typeof rigor !== "boolean") {
              return res.status(400).json({
                success: false,
                error: "rigor deve ser um valor booleano (true ou false)",
              });
            }*/
            let bRigor = false;
            if (rigor === "true") {
                bRigor = true;
            }
            else if (rigor === "false") {
                bRigor = false;
            }
            // Extrair arquivos
            const gabaritosFile = files.find((f) => f.originalname === "gabaritos.csv");
            const respostasFile = files.find((f) => f.originalname === "respostas.csv");
            if (!gabaritosFile || !respostasFile) {
                return res.status(400).json({
                    success: false,
                    error: "Arquivos devem ter fieldnames 'gabaritos' e 'respostas'",
                });
            }
            // Convertar buffers para string
            const gabaritosConteudo = gabaritosFile.buffer.toString("utf-8");
            const respostasConteudo = respostasFile.buffer.toString("utf-8");
            // Corrigir provas
            const correcaoService = new CorrecaoCSVService_1.CorrecaoCSVService();
            const resultados = await correcaoService.corrigirProvas(gabaritosConteudo, respostasConteudo, tipo_resposta, bRigor);
            res.status(200).json({
                success: true,
                data: resultados,
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
}
exports.ProvaController = ProvaController;
