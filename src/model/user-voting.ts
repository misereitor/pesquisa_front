export interface userVoting {
  id?: number;
  name: string;
  phone: string;
  cpf: string;
  uf: string;
  city: string;
  confirmed?: boolean;
  try_code_send: number;
  date_created?: Date;
  role?: string;
  date_vote?: Date;
  percentage_vote?: number;
}
