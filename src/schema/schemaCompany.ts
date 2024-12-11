import { z } from 'zod';

export const schemaCompanyEdit = z.object({
  trade_name: z.string(),
  company_name: z.string().optional(),
  cnpj: z.string().optional(),
  associate: z.boolean()
});

export type FormCompanyEdit = z.infer<typeof schemaCompanyEdit>;
