'use client';
import { UserAdmin } from '@/src/model/user-admin';
import {
  FormAddUserAdmin,
  schemaAddUserAdmin
} from '@/src/schema/schemaAdminUsers';
import { createUserAdminService } from '@/src/service/user-admin-service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import InputSimple from '../input/input';
import { IoCreate } from 'react-icons/io5';
import { Button } from '@mui/material'

type Props = {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  setUsers: Dispatch<SetStateAction<UserAdmin[]>>;
  users: UserAdmin[];
};

export default function ModalCreateUser({
  setOpenModal,
  setUsers,
  users
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormAddUserAdmin>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(schemaAddUserAdmin),
    defaultValues: {
      name: '',
      email: '',
      username: '',
      confirmpassword: '',
      password: '',
      role: ''
    }
  });
  const handleSubmitForm = async (user: FormAddUserAdmin) => {
    try {
      setLoading(true);
      setError('');
      const data = await createUserAdminService(user);
      if (!data.success) {
        setError(data.message);
        return;
      }
      const updateUser  = data.data as UserAdmin;
      setUsers([...users, updateUser]);
      setOpenModal(false);
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
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <div>
          <InputSimple
            className="rounded-lg w-72 h-7"
            type="text"
            autoFocus
            label="Seu nome completo:"
            errortext={errors.name?.message}
            {...register('name')}
          />
        </div>
        <div>
          <InputSimple
            className="rounded-lg w-72 h-7"
            type="text"
            label="Nome de usuário:"
            errortext={errors.username?.message}
            {...register('username')}
          />
        </div>
        <div>
          <InputSimple
            className="rounded-lg w-72 h-7"
            type="email"
            label="Seu e-mail:"
            errortext={errors.email?.message}
            {...register('email')}
          />
        </div>
        <div className="flex flex-col mb-5">
          <label>Role:</label>
          <select
            id="role"
            className="bg-zinc-900 p-1 rounded-md"
            {...register('role')}
          >
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
          </select>
        </div>
        <div>
          <InputSimple
            className="rounded-lg w-72 h-7"
            type="password"
            label="Nova senha:"
            errortext={errors.password?.message}
            {...register('password')}
          />
        </div>
        <div>
          <InputSimple
            className="rounded-lg w-72 h-7"
            type="password"
            label="Confirme a senha:"
            errortext={errors.confirmpassword?.message}
            {...register('confirmpassword')}
          />
        </div>
        <div>
          <span className="text-red-900">{error}</span>
        </div>
        <div className="flex w-full justify-between">
          <button type="button" onClick={() => setOpenModal(false)}>
            Cancelar
          </button>
          <Button
            data-testid="comecar"
            size="medium"
            color="success"
            type="submit"
            endIcon={<IoCreate />}
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
            <span>Criar</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
