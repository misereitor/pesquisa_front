export interface Company {
  id: number;
  trade_name: string;
  company_name: string | undefined;
  cnpj: string | undefined;
  associate: boolean;
  date_create: Date;
  active: boolean;
}
