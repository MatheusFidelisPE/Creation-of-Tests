"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorrecaoCSVService = void 0;
const sync_1 = require("csv-parse/sync");
class CorrecaoCSVService {
    // Parsear CSV e converter em objeto chave-valor
    parseCSV(conteudo) {
        const linhas = (0, sync_1.parse)(conteudo, {
            columns: false,
            skip_empty_lines: true,
        });
        if (linhas.length === 0) {
            throw new Error('Arquivo CSV vazio');
        }
        const resultado = {};
        // Ignorar cabeçalho (primeira linha)
        for (let i = 1; i < linhas.length; i++) {
            const linha = linhas[i];
            if (linha.length > 0) {
                const idProva = linha[0];
                const respostas = linha.slice(1); // Começar do índice 1 para pular o ID
                resultado[idProva] = respostas;
            }
        }
        return resultado;
    }
    // Extrair alternativas corretas de um valor (LETRAS ou SOMA_EXPONENCIAL)
    extrairAlternativasCorretas(valor, tipo) {
        const alternativas = new Set();
        if (tipo === 'LETRAS') {
            // Para LETRAS, cada caractere representa uma alternativa correta
            // Ex: "AC" significa alternativas 0 (A) e 2 (C)
            for (let i = 0; i < valor.length; i++) {
                const letra = valor[i];
                const indice = letra.charCodeAt(0) - 65; // Converter A=0, B=1, C=2, etc
                alternativas.add(indice);
            }
        }
        else if (tipo === 'SOMA_EXPONENCIAL') {
            // Para SOMA_EXPONENCIAL, decompor a soma em potências de 2
            // Ex: "6" = 2^1 + 2^2, então alternativas 1 e 2
            const soma = parseInt(valor);
            let indice = 0;
            let temp = soma;
            while (temp > 0) {
                if (temp % 2 === 1) {
                    alternativas.add(indice);
                }
                temp = Math.floor(temp / 2);
                indice++;
            }
        }
        return alternativas;
    }
    // Calcular pontuação de uma questão
    calcularPontuacaoQuestao(resposta, gabarito, tipo, rigor) {
        if (!resposta || !gabarito) {
            return 0;
        }
        if (rigor) {
            // Correção rigorosa: tudo ou nada
            return resposta === gabarito ? 1 : 0;
        }
        // Correção lena: pontuação proporcional
        const alternativasCorretas = this.extrairAlternativasCorretas(gabarito, tipo);
        const alternativasRespostas = this.extrairAlternativasCorretas(resposta, tipo);
        if (alternativasCorretas.size === 0) {
            // Se não há alternativas corretas, o aluno não pode ganhar pontos
            return 0;
        }
        // Contar quantas alternativas o aluno acertou
        let acertos = 0;
        for (const alt of alternativasRespostas) {
            if (alternativasCorretas.has(alt)) {
                acertos++;
            }
        }
        // Contar erros (alternativas que o aluno marcou mas não estão corretas)
        let erros = 0;
        for (const alt of alternativasRespostas) {
            if (!alternativasCorretas.has(alt)) {
                erros++;
            }
        }
        // Se o aluno marcou alternativas erradas, não ganha pontos
        if (erros > 0) {
            return 0;
        }
        // Caso contrário, pontuação proporcional
        return acertos / alternativasCorretas.size;
    }
    // Corrigir provas baseado em CSVs
    async corrigirProvas(gabaritosConteudo, respostasConteudo, tipoResposta, rigor) {
        // Parsear os CSVs
        const gabaritos = this.parseCSV(gabaritosConteudo);
        const respostas = this.parseCSV(respostasConteudo);
        if (Object.keys(gabaritos).length === 0) {
            throw new Error('Arquivo de gabarito está vazio');
        }
        if (Object.keys(respostas).length === 0) {
            throw new Error('Arquivo de respostas está vazio');
        }
        const resultados = [];
        // Para cada prova de respostas, procurar no gabarito
        for (const [idProva, respostasQuestoes] of Object.entries(respostas)) {
            const gabaritosQuestoes = gabaritos[idProva];
            if (!gabaritosQuestoes) {
                console.warn(`Gabarito não encontrado para prova ${idProva}`);
                continue;
            }
            if (respostasQuestoes.length !== gabaritosQuestoes.length) {
                console.warn(`Número de questões diferente para prova ${idProva}: ` +
                    `respostas=${respostasQuestoes.length}, gabarito=${gabaritosQuestoes.length}`);
                continue;
            }
            // Calcular nota da prova (total de 10 pontos)
            let totalPontos = 0;
            for (let i = 0; i < respostasQuestoes.length; i++) {
                const resposta = respostasQuestoes[i];
                const gabarito = gabaritosQuestoes[i];
                const pontos = this.calcularPontuacaoQuestao(resposta, gabarito, tipoResposta, rigor);
                totalPontos += pontos;
            }
            // Nota total: (pontos totais / número de questões) * 10
            const nota = (totalPontos / respostasQuestoes.length) * 10;
            resultados.push({
                id_prova: idProva,
                nota: Math.round(nota * 100) / 100, // Arredondar para 2 casas decimais
            });
        }
        return resultados;
    }
}
exports.CorrecaoCSVService = CorrecaoCSVService;
