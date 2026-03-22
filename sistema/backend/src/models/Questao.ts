// DTO para Questao
export interface CreateQuestaoDTO {
  enunciado: string;
}

export interface QuestaoDTO {
  id: number;
  enunciado: string;
  dataCriacao: Date;
}

export interface QuestaoComAlternativasDTO extends QuestaoDTO {
  alternativas: Array<{
    id: number;
    correta: boolean;
    descricao: string;
  }>;
}
