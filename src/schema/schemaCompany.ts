import { z } from 'zod';

export const schemaCompanyEdit = z.object({
  trade_name: z.string().optional(),
  company_name: z.string(),
  cnpj: z.string().optional(),
  associate: z.boolean()
});

export type FormCompanyEdit = z.infer<typeof schemaCompanyEdit>;
