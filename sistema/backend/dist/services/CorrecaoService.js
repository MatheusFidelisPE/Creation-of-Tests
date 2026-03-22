"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorrecaoService = void 0;
class CorrecaoService {
    // Corrigir uma prova baseado no tipo de resposta
    async corrigir(prova, respostasDoUsuario) {
        const detalhes = [];
        let questoesCorretas = 0;
        for (const questaoProva of prova.questoes) {
            const questao = questaoProva.questao;
            const respostaUsuario = respostasDoUsuario.find((r) => r.questaoId === questao.id);
            if (!respostaUsuario) {
                detalhes.push({
                    questaoId: questao.id,
                    correta: false,
                    respostaUsuario: "Não respondida",
                    respostaCorreta: this.gerarRespostaCorreta(questao.alternativas, prova.tipoDeResposta),
                });
                continue;
            }
            const respostaCorreta = this.gerarRespostaCorreta(questao.alternativas, prova.tipoDeResposta);
            const estaCorreta = this.normalizarResposta(respostaUsuario.resposta) ===
                this.normalizarResposta(respostaCorreta);
            if (estaCorreta) {
                questoesCorretas++;
            }
            detalhes.push({
                questaoId: questao.id,
                correta: estaCorreta,
                respostaUsuario: respostaUsuario.resposta,
                respostaCorreta,
            });
        }
        const percentualAcerto = (questoesCorretas / prova.questoes.length) * 100;
        return {
            provaId: prova.id,
            totalQuestoes: prova.questoes.length,
            questoesCorretas,
            percentualAcerto: Math.round(percentualAcerto * 100) / 100,
            detalhes,
        };
    }
    // Gerar resposta correta baseada no tipo
    gerarRespostaCorreta(alternativas, tipoDeResposta) {
        const alternativasCorretas = alternativas.filter((a) => a.correta);
        if (tipoDeResposta === "LETRAS") {
            // Retornar as letras das alternativas corretas (a, b, c, etc)
            return alternativasCorretas
                .map((_, index) => String.fromCharCode(97 + index))
                .join(", ");
        }
        else if (tipoDeResposta === "SOMA_EXPONENCIAL") {
            // Calcular a soma de potências de 2
            let soma = 0;
            alternativasCorretas.forEach((_, index) => {
                soma += Math.pow(2, index);
            });
            return soma.toString();
        }
        throw new Error(`Tipo de resposta desconhecido: ${tipoDeResposta}`);
    }
    // Normalizar resposta para comparação
    normalizarResposta(resposta) {
        return resposta
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "")
            .split("")
            .sort()
            .join("");
    }
}
exports.CorrecaoService = CorrecaoService;
