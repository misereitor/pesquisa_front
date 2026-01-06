export interface ImportCSV {
  trade_name: string;
  company_name?: string;
  cnpj?: string;
  associate: boolean;
  category: string[] | null;
}
