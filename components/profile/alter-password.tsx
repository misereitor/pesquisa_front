'use client';

import { UserAdmin } from '@/src/model/user-admin';
import { Dispatch, SetStateAction, useState } from 'react';
import InputSimple from '../input/input';
import {
  FormAlterPassword,
  schemaAlterPassword
} from '@/src/schema/schemaAdminUsers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { updatePasswordAdmin } from '@/src/service/user-admin-service';
import { Button } from '@mui/material';
import { RxUpdate } from 'react-icons/rx';

type Props = {
  userAdmin: UserAdmin;
  setAlterPassword: Dispatch<SetStateAction<boolean>>;
};
export default function AlterPassword({ setAlterPassword, userAdmin }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [sucess, setSucess] = useState<string>('');
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormAlterPassword>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(schemaAlterPassword),
    defaultValues: {
      password: '',
      confirmpassword: ''
    }
  });

  const alterPassword = async (password: FormAlterPassword) => {
    try {
      setError('');
      setSucess('');
      setLoading(true);
      await updatePasswordAdmin(userAdmin.id, password.password);
      setSucess('Senha alterada');
    } catch (error: any) {
      console.error('Error in handleSubmitForm:', error);

      if (error.name === 'Error') {
        // Caso o backend tenha retornado uma mensagem de erro específica
        setError(error.message);
      } else {
        // Erro genérico (ex.: problemas de rede)
        setError('Ocorreu um erro inesperado. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);

      setTimeout(() => {
        setSucess('');
      }, 10000);
    }
  };
  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Alterar Senha
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Defina uma nova senha para sua conta
          </p>
        </div>

        <form
          autoComplete="off"
          className="p-8 space-y-6"
          onSubmit={handleSubmit(alterPassword)}
        >
          <div className="space-y-4">
            <div>
              <InputSimple
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                type="password"
                label="Nova senha"
                placeholder="********"
                errortext={errors.password?.message}
                data-testid="password"
                {...register('password')}
              />
            </div>
            <div>
              <InputSimple
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                type="password"
                label="Confirme a senha"
                placeholder="********"
                errortext={errors.confirmpassword?.message}
                data-testid="confirmpassword"
                {...register('confirmpassword')}
              />
            </div>
          </div>

          {(sucess || error) && (
            <div
              className={`p-4 rounded-lg text-sm ${
                sucess
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
              }`}
            >
              {sucess || error}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-6">
            <button
              type="button"
              onClick={() => setAlterPassword(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <Button
              data-testid="comecar"
              size="medium"
              type="submit"
              loading={loading}
              loadingPosition="end"
              variant="contained"
              sx={{
                backgroundColor: '#4f46e5', // indigo-600
                '&:hover': {
                  backgroundColor: '#4338ca' // indigo-700
                },
                textTransform: 'none',
                borderRadius: '0.5rem',
                boxShadow: 'none',
                fontWeight: 600,
                padding: '8px 24px'
              }}
            >
              Atualizar Senha
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
