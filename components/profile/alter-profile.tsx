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
import { Button } from '@mui/material'
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
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit(handleSubmitProfile)}
        className="w-80 flex flex-col items-center justify-center p-5 rounded-lg mt-10 bg-zinc-950"
      >
        <div>
          <InputSimple
            {...register('name')}
            className="rounded-lg w-72 h-7"
            type="text"
            label="Nome:"
            errortext={errors.name?.message}
          />
        </div>
        <div>
          <InputSimple
            {...register('username')}
            className="rounded-lg w-72 h-7"
            type="text"
            label="Usuário:"
            errortext={errors.username?.message}
          />
        </div>
        <div>
          <InputSimple
            {...register('email')}
            className="rounded-lg w-72 h-7"
            type="email"
            label="E-mail:"
            errortext={errors.username?.message}
          />
        </div>
        {superAdmin && (
          <div>
            <label>Role</label>
            <select
              name="roles"
              id="roles"
              className="bg-zinc-900 p-1 rounded-md"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>
        )}
        <div>{sucess && <p>{sucess}</p>}</div>
        <div>{error && <p className="text-red-800">{error}</p>}</div>
        <div className="flex justify-between w-full mt-2">
          <button type="button" onClick={() => setAlterPassword(true)}>
            Alterar senha
          </button>
          <Button
            data-testid="comecar"
            size="medium"
            color="success"
            type="submit"
            endIcon={<RxUpdate />}
            loading={loading}
            loadingPosition="end"
            variant="contained"
            sx={{
              color: '#7f5d00',
              backgroundColor: '#ffe45f !important',
              '&.Mui-disabled': {
                color: '#7f5d00',
                backgroundColor: '#fdf6d0 !important'
              }
            }}
          >
            <span>Alterar</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
