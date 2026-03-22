import { QuestaoComAlternativasDTO } from "./Questao";

// DTO para criar uma Prova
export interface CreateProvaDTO {
  quantidadeQuestoes: number;
  tipoDeResposta: "LETRAS" | "SOMA_EXPONENCIAL";
}

// DTO para criar uma Prova com questões selecionadas
export interface CreateProvaComQuestoesSelecionadasDTO {
  questoes: number[];
  tipoDeResposta: "LETRAS" | "NUMEROS";
}

// DTO para atualizar uma Prova
export interface UpdateProvaDTO {
  questoes: number[];
  tipoDeResposta: "LETRAS" | "NUMEROS";
}

// DTO para Prova com questões
export interface ProvaDTO {
  id: number;
  questoes: QuestaoComAlternativasDTO[];
  tipoDeResposta: "LETRAS" | "SOMA_EXPONENCIAL";
  dataCriacao: Date;
  dataModificacao: Date;
}

// DTO para resposta da Prova
export interface RespostaProvaDTO {
  provaId: number;
  respostas: {
    questaoId: number;
    resposta: string; // Letras ou soma
  }[];
}

// DTO para resultado da correção
export interface ResultadoCorrecaoDTO {
  provaId: number;
  totalQuestoes: number;
  questoesCorretas: number;
  percentualAcerto: number;
  detalhes: {
    questaoId: number;
    correta: boolean;
    respostaUsuario: string;
    respostaCorreta: string;
  }[];
}
