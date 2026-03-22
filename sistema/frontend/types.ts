export interface Alternativa {
  id: number;
  descricao: string;
  correta: boolean;
  questaoId: number;
}

export interface Questao {
  id: number;
  enunciado: string;
  dataCriacao: string;
  alternativas: Alternativa[];
}

export interface Prova {
  id: number;
  tipoDeResposta: "LETRAS" | "SOMA_EXPONENCIAL";
  questoes: Questao[];
  dataCriacao: string;
  dataModificacao: string;
}