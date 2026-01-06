import { z } from 'zod';
import { regexPhone } from '../util/dataProcessing';
import {
  validateName,
  validateNameIsNumber,
  validateCPF,
  validatePhone
} from '../util/validate';

export const schemaUserVoting = z.object({
  name: z.string().superRefine((val, ctx: any) => {
    if (validateName(val.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Coloque o seu nome completo!',
        fatal: true
      });
    }
    if (validateNameIsNumber(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Nome não pode ter símbolos ou números',
        fatal: true
      });
    }
  }),

  cpf: z.string().refine((val) => !validateCPF(val), 'CPF inválido!'),
  phone: z.string(),
  country: z.string().min(1, { message: 'País é obrigatório' }),
  state: z.string().min(1, { message: 'Estado é obrigatório' }),
  city: z.string().min(1, { message: 'Cidade é obrigatório' })
});

export const schemaUserVotingCPF = z.object({
  cpf: z.string().refine((val) => !validateCPF(val), 'CPF inválido!')
});

export type FormUserVotingCPF = z.infer<typeof schemaUserVotingCPF>;
export type FormUserVoting = z.infer<typeof schemaUserVoting>;
