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

export interface ProvaQuestao {
  provaId: number;
  questaoId: number;
  questao: Questao;
}

export interface Prova {
  id: number;
  tipoDeResposta: 'LETRAS' | 'NUMEROS';
  questoes: ProvaQuestao[];
  dataCriacao: string;
  dataModificacao: string;
}