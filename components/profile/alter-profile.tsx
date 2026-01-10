'use client';

import { UserAdmin } from '@/src/model/user-admin';
import {
  FormUserAdminProfile,
  schemaUserAdminProfile
} from '@/src/schema/schemaAdminUsers';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import InputSimple from '../input/input';
import {
  updateProfileAdmin,
  updateRoleAdmin
} from '@/src/service/user-admin-service';
import { setCookie } from 'cookies-next/client';
import { Button } from '@mui/material';
import { RxUpdate } from 'react-icons/rx';

type Props = {
  superAdmin: boolean;
  userAdmin: UserAdmin;
  setAlterPassword: Dispatch<SetStateAction<boolean>>;
};

export default function AlterProfile({
  superAdmin,
  setAlterPassword,
  userAdmin
}: Props) {
  const [loading, setLoading] = useState(false);
  const [sucess, setSucess] = useState<string>('');
  const [role, setRole] = useState(userAdmin.role);
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormUserAdminProfile>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(schemaUserAdminProfile),
    defaultValues: {
      username: userAdmin.username,
      name: userAdmin.name,
      email: userAdmin.email
    }
  });

  const handleSubmitProfile = async (user: FormUserAdminProfile) => {
    try {
      setError('');
      setSucess('');
      setLoading(true);
      const userUpdate = await updateProfileAdmin(userAdmin.id, user);
      if ('success' in userUpdate && !userUpdate.success) {
        // Trata o erro
        console.error('Erro no backend:', userUpdate.message);
        setError(userUpdate.message);
        return;
      }
      if ('role' in userUpdate && userUpdate.role !== role) {
        await updateRoleAdmin(userAdmin.id, role);
        userUpdate.role = role;
      }
      setCookie('user', userUpdate);
      setSucess('Dados alterados com sucesso!');
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
            Editar Perfil
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Atualize suas informações pessoais
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleSubmitProfile)}
          className="p-8 space-y-6"
        >
          <div className="space-y-4">
            <div>
              <InputSimple
                {...register('name')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                type="text"
                label="Nome"
                placeholder="Seu nome completo"
                errortext={errors.name?.message}
              />
            </div>

            <div>
              <InputSimple
                {...register('username')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                type="text"
                label="Usuário"
                placeholder="Nome de usuário"
                errortext={errors.username?.message}
              />
            </div>

            <div>
              <InputSimple
                {...register('email')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                type="email"
                label="E-mail"
                placeholder="seu@email.com"
                errortext={errors.email?.message}
              />
            </div>

            {superAdmin && (
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="roles"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Função (Role)
                </label>
                <select
                  name="roles"
                  id="roles"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>
            )}
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
              onClick={() => setAlterPassword(true)}
              className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium hover:underline"
            >
              Alterar senha
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
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
