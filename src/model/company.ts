export interface Company {
  id: number;
  trade_name: string | undefined;
  company_name: string;
  cnpj: string | undefined;
  associate: boolean;
  date_create: Date;
  active: boolean;
}
