// DTO para Alternativa
export interface CreateAlternativaDTO {
  questaoId: number;
  correta: boolean;
  descricao: string;
}

export interface AlternativaDTO {
  id: number;
  questaoId: number;
  correta: boolean;
  descricao: string;
}
