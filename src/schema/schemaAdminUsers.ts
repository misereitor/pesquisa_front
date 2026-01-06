import { z } from 'zod';
import { validateName, validateNameIsNumber } from '../util/validate';

export const schemaUserAdminProfile = z.object({
  username: z
    .string()
    .refine(
      (val) => !/[^.-\w]/g.test(val),
      'Nome de login não pode ter caracteres especiais'
    ),
  name: z.string().superRefine((val, ctx) => {
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
  email: z.string().email('Insira um e-mail válido')
});

export const schemaAlterPassword = z
  .object({
    password: z
      .string()
      .min(8, 'A senha tem que ter ao menos 8 caracteres')
      .superRefine((val, ctx) => {
        const regexNumber = !/\d/.test(val);
        const regexLetter = !/\D/.test(val);
        const regexCaracter = !/\W/.test(val);
        const regexUpperCase = !/[A-Z]/g.test(val);
        const regexLowerCase = !/[a-z]/g.test(val);
        if (regexNumber) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'A senha precisa ter um número',
            fatal: true
          });
        }
        if (regexLetter) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'A senha precisa ter uma letra',
            fatal: true
          });
        }
        if (regexCaracter) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'A senha precisa ter um caracter como @ !',
            fatal: true
          });
        }
        if (regexLowerCase) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'A senha precisa ter uma letra maiúscula',
            fatal: true
          });
        }
        if (regexUpperCase) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'A senha precisa ter uma letra minúscula',
            fatal: true
          });
        }
      }),
    confirmpassword: z.string()
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: 'As senhas não confere',
    path: ['confirmpassword']
  });

export const schemaAddUserAdmin = z
  .object({
    username: z
      .string()
      .refine(
        (val) => !/[^.-\w]/g.test(val),
        'Nome de login não pode ter caracteres especiais'
      ),
    name: z.string().superRefine((val, ctx) => {
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
    email: z.string().email('Insira um e-mail válido'),
    role: z.string(),
    password: z
      .string()
      .min(8, 'A senha tem que ter ao menos 8 caracteres')
      .superRefine((val, ctx) => {
        const regexNumber = !/\d/.test(val);
        const regexLetter = !/\D/.test(val);
        const regexCaracter = !/\W/.test(val);
        const regexUpperCase = !/[A-Z]/g.test(val);
        const regexLowerCase = !/[a-z]/g.test(val);
        if (regexNumber) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'A senha precisa ter um número',
            fatal: true
          });
        }
        if (regexLetter) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'A senha precisa ter uma letra',
            fatal: true
          });
        }
        if (regexCaracter) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'A senha precisa ter um caracter como @ !',
            fatal: true
          });
        }
        if (regexLowerCase) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'A senha precisa ter uma letra maiúscula',
            fatal: true
          });
        }
        if (regexUpperCase) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'A senha precisa ter uma letra minúscula',
            fatal: true
          });
        }
      }),
    confirmpassword: z.string()
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: 'As senhas não confere',
    path: ['confirmpassword']
  });

export const schemaUserAdmin = z.object({
  username: z.string(),
  password: z.string()
});

export type FormUserAdmin = z.infer<typeof schemaUserAdmin>;
export type FormAddUserAdmin = z.infer<typeof schemaAddUserAdmin>;
export type FormUserAdminProfile = z.infer<typeof schemaUserAdminProfile>;
export type FormAlterPassword = z.infer<typeof schemaAlterPassword>;
