export interface DebitsData {
  NOME: string;
  DOCUMENTO: string;
  ASSOCIADO: string;
  ASSOCIACAO: string;
  CNPJ: string;
  SEQDIV: string;
  INCLUSAO: string;
  STATUS: string;
  TIPODOC: string;
  CONTRATO: string;
  VALOR: string;
  VENCIMENTO: string;
  FONE1?: string;
  FONE2?: string;
  EMAIL?: string;

  CEP?: string;
  ENDERECO?: string;
  NUMERO?: string;
  COMPLEMENTO?: string;
  BAIRRO?: string;
  CIDADE?: string;
  ESTADO?: string;
}

export interface RuleData {
  IDADE_DIVIDA: string;
  DESCONTO: string;
  MAXIMO_PARCELAS: string;
  ATENUADOR: string;
  MULTA: string;
  JUROS: string;
  ASSESSORIA: string;
  REAJUSTE: string;
}
