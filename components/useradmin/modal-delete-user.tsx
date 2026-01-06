'use client';
import { Dispatch, SetStateAction, useState } from 'react';
import InputSimple from '../input/input';
import { UserAdmin } from '@/src/model/user-admin';
import { FormUserAdmin } from '@/src/schema/schemaAdminUsers';
import { getCookie } from 'cookies-next/client';
import { loginUserAdmin } from '@/src/service/login-user-admin';
import { deleteUserAdminService } from '@/src/service/user-admin-service';
import { FiDelete } from 'react-icons/fi';
import { Button } from '@mui/material'

type Props = {
  userAdmin: UserAdmin;
  setUserDelete: Dispatch<SetStateAction<UserAdmin | undefined>>;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  setUsers: Dispatch<SetStateAction<UserAdmin[]>>;
  users: UserAdmin[];
};

export default function ModalDeleteUserAdmin({
  userAdmin,
  setOpenModal,
  setUserDelete,
  setUsers,
  users
}: Props) {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRemove = async () => {
    try {
      setError('');
      setLoading(true);
      if (password.length === 0) return;
      const userCookies = getCookie('user');
      if (userCookies) {
        const user = JSON.parse(userCookies);
        const login: FormUserAdmin = {
          username: user.username,
          password: password
        };
        const data = await loginUserAdmin(login);
        if (!data.success) {
          setError(data.message);
          return;
        }

        await deleteUserAdminService(userAdmin.id);
        const userFilter = users.filter((c) => c.id != userAdmin.id);
        setUsers(userFilter);
        setOpenModal(false);
        setUserDelete(undefined);
      }
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
      <div>
        <h1 className="font-bold text-2xl">{userAdmin.name}</h1>
      </div>
      <div>Digite sua senha para remover o usuário!</div>
      <div className="flex justify-between mt-5">
        <InputSimple
          type="password"
          className="rounded-lg w-80 h-7"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="-mt-6 h-6">
        {error && <span className="text-red-700">{error}</span>}
      </div>
      <div className="flex items-center justify-between mt-3">
        <Button
          data-testid="comecar"
          size="medium"
          color="success"
          type="button"
          endIcon={<FiDelete />}
          loading={loading}
          loadingPosition="end"
          variant="contained"
          onClick={() => handleRemove()}
          sx={{
            color: '#ffffff',
            backgroundColor: '#c2410c !important',
            '&.Mui-disabled': {
              color: '#b91c1c',
              backgroundColor: '#fdba74 !important'
            }
          }}
        >
          <span>Deletar</span>
        </Button>
        <button
          type="button"
          className="bg-yellow-500  w-24 h-10 rounded-md text-yellow-950"
          onClick={() => {
            setUserDelete(undefined);
            setOpenModal(false);
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
