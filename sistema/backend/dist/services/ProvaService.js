"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvaService = void 0;
const ProvaRepository_1 = require("../repositories/ProvaRepository");
const QuestaoRepository_1 = require("../repositories/QuestaoRepository");
const CorrecaoService_1 = require("./CorrecaoService");
const pdfkit_1 = __importDefault(require("pdfkit"));
class ProvaService {
    constructor() {
        this.provaRepository = new ProvaRepository_1.ProvaRepository();
        this.questaoRepository = new QuestaoRepository_1.QuestaoRepository();
        this.correcaoService = new CorrecaoService_1.CorrecaoService();
    }
    // Gerar uma prova com questões aleatórias
    async gerarProva(data) {
        if (data.quantidadeQuestoes < 1) {
            throw new Error("Quantidade de questões deve ser no mínimo 1");
        }
        const tipo = data.tipoDeResposta;
        // Buscar questões aleatórias
        const questoesAleatorias = await this.questaoRepository.buscarAleatorias(data.quantidadeQuestoes);
        // Embaralhar alternativas de cada questão
        const questoesComAlternativasEmbaralhadas = questoesAleatorias.map((questao) => ({
            ...questao,
            alternativas: questao.alternativas.sort(() => Math.random() - 0.5),
        }));
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
    async criarProvaSelecionada(data) {
        if (!data.questoes || data.questoes.length < 1) {
            throw new Error("Deve ser selecionado no mínimo 1 questão");
        }
        // Buscar as questões selecionadas
        const questoesSelecionadas = await Promise.all(data.questoes.map((id) => this.questaoRepository.buscarPorId(id)));
        // Validar que todas as questões foram encontradas
        const questoesValidas = questoesSelecionadas.filter((q) => q !== null);
        if (questoesValidas.length !== data.questoes.length) {
            throw new Error("Uma ou mais questões não foram encontradas");
        }
        // Embaralhar alternativas de cada questão
        const questoesComAlternativasEmbaralhadas = questoesValidas.map((questao) => ({
            ...questao,
            alternativas: questao.alternativas.sort(() => Math.random() - 0.5),
        }));
        // Criar a prova no banco
        const createProvaDTO = {
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
    async buscarProva(id) {
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
    async corrigirProva(provaId, respostasDoUsuario) {
        const prova = await this.provaRepository.buscarPorId(provaId);
        if (!prova) {
            throw new Error(`Prova com id ${provaId} não encontrada`);
        }
        return await this.correcaoService.corrigir(prova, respostasDoUsuario);
    }
    // Atualizar uma prova (adicionar/remover questões e tipo de resposta)
    async atualizarProva(id, data) {
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
    async deletarProva(id) {
        const prova = await this.provaRepository.buscarPorId(id);
        if (!prova) {
            throw new Error(`Prova com id ${id} não encontrada`);
        }
        return await this.provaRepository.deletar(id);
    }
    // Gerar múltiplas provas com gabaritos e PDFs
    async gerarGabaritos(data) {
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
        const questoesDaProva = prova.questoes.map((pq) => pq.questao);
        if (questoesDaProva.length === 0) {
            throw new Error("A prova não possui questões");
        }
        // Arrays para armazenar gabaritos e provas
        const gabaritos = [];
        const provasGeradas = [];
        // Gerar n provas diferentes
        for (let i = 0; i < data.quantidade_provas; i++) {
            // Embaralhar ordem das questões
            const questoesEmbaralhadas = [...questoesDaProva].sort(() => Math.random() - 0.5);
            // Para cada questão, embaralhar as alternativas e extrair as corretas
            const gabaritoDaProva = [];
            const questoesParaPDF = [];
            for (const questao of questoesEmbaralhadas) {
                // Embaralhar alternativas
                const alternativasEmbaralhadas = [...questao.alternativas].sort(() => Math.random() - 0.5);
                // Armazenar questão com alternativas embaralhadas para PDF
                questoesParaPDF.push({
                    id: questao.id,
                    enunciado: questao.enunciado,
                    alternativas: alternativasEmbaralhadas.map((alt) => ({
                        id: alt.id,
                        descricao: alt.descricao,
                        correta: alt.correta,
                    })),
                });
                // Gerar gabarito baseado no tipo de resposta
                if (prova.tipoDeResposta === "LETRAS") {
                    // Retornar as letras corretas (A, B, C, D, E, etc)
                    const letras = [];
                    alternativasEmbaralhadas.forEach((alt, index) => {
                        if (alt.correta) {
                            letras.push(String.fromCharCode(65 + index));
                        }
                    });
                    gabaritoDaProva.push(letras.join(""));
                }
                else if (prova.tipoDeResposta === "SOMA_EXPONENCIAL") {
                    // Retornar a soma de 2^(posição)
                    let soma = 0;
                    alternativasEmbaralhadas.forEach((alt, index) => {
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
            provasGeradas.push({
                id: idUnico,
                questoes: questoesParaPDF,
            });
        }
        // Gerar CSV
        const csv = this.gerarCSV(gabaritos, questoesDaProva.length);
        return { csv, gabaritos, provas: provasGeradas, tipoResposta: prova.tipoDeResposta };
    }
    // Gerar CSV a partir dos gabaritos
    gerarCSV(gabaritos, quantidadeQuestoes) {
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
    // Gerar PDF com todas as provas
    async gerarPDF(provas, tipoResposta, nomeProfessor, nomeDisciplina, data) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new pdfkit_1.default({
                    size: "A4",
                    margin: 40,
                    bufferPages: true,
                });
                const chunks = [];
                doc.on("data", (chunk) => {
                    chunks.push(chunk);
                });
                doc.on("end", () => {
                    resolve(Buffer.concat(chunks));
                });
                doc.on("error", (err) => {
                    reject(err);
                });
                // Gerar conteúdo para cada prova
                for (let i = 0; i < provas.length; i++) {
                    const prova = provas[i];
                    // Sempre começar uma nova página para cada prova
                    if (i > 0) {
                        doc.addPage();
                    }
                    // Cabeçalho da prova
                    doc.fontSize(16).font("Helvetica-Bold");
                    doc.text(`Prova ID: ${prova.id}`, { underline: true });
                    doc.moveDown(0.5);
                    doc.fontSize(11).font("Helvetica");
                    doc.text(`Professor: ${nomeProfessor}`);
                    doc.text(`Disciplina: ${nomeDisciplina}`);
                    doc.text(`Data: ${data}`);
                    doc.moveDown(0.5);
                    // Tipo de resposta
                    if (tipoResposta === "LETRAS") {
                        doc.text("Tipo de Resposta: Letras (Marque as alternativas corretas)");
                    }
                    else {
                        doc.text("Tipo de Resposta: Soma Exponencial (2^0 + 2^1 + ... = Soma)");
                    }
                    doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
                    doc.moveDown(0.5);
                    // Questões
                    for (let j = 0; j < prova.questoes.length; j++) {
                        const questao = prova.questoes[j];
                        // Verificar se está próximo do fim da página
                        if (doc.y > 700) {
                            doc.addPage();
                        }
                        // Número da questão
                        doc.fontSize(12).font("Helvetica-Bold");
                        doc.text(`Questão ${j + 1}:`, { underline: true });
                        doc.moveDown(0.3);
                        // Enunciado
                        doc.fontSize(11).font("Helvetica");
                        doc.text(questao.enunciado, { align: "left" });
                        doc.moveDown(0.4);
                        // Alternativas
                        const letras = ["A", "B", "C", "D", "E", "F", "G", "H"];
                        for (let k = 0; k < questao.alternativas.length; k++) {
                            const alternativa = questao.alternativas[k];
                            if (doc.y > 720) {
                                doc.addPage();
                            }
                            doc.fontSize(10);
                            doc.text(`${letras[k]}) ${alternativa.descricao}`);
                            doc.moveDown(0.3);
                        }
                        // Espaço para resposta
                        doc.moveDown(0.3);
                        doc.fontSize(10).font("Helvetica-Bold");
                        if (tipoResposta === "LETRAS") {
                            doc.text("Resposta: ________________");
                        }
                        else {
                            doc.text("Resposta (Soma): ________________");
                        }
                        doc.moveDown(0.5);
                        doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
                        doc.moveDown(0.5);
                    }
                }
                // Finalizar documento
                doc.end();
            }
            catch (error) {
                reject(error);
            }
        });
    }
}
exports.ProvaService = ProvaService;
