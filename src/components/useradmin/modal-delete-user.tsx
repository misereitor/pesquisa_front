'use client';
import { Dispatch, SetStateAction, useState } from 'react';
import LoadingButton from '../button/loading-button';
import InputSimple from '../input/input';
import { userAdmin } from '@/model/user-admin';
import { FormUserAdmin } from '@/schema/schemaAdminUsers';
import { getCookie } from 'cookies-next/client';
import { loginUserAdmin } from '@/service/login-user-admin';
import { deleteUserAdminService } from '@/service/user-admin-service';

type Props = {
  userAdmin: userAdmin;
  setUserDelete: Dispatch<SetStateAction<userAdmin | undefined>>;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  setUsers: Dispatch<SetStateAction<userAdmin[]>>;
  users: userAdmin[];
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
        await loginUserAdmin(login);

        await deleteUserAdminService(userAdmin.id);
        const userFilter = users.filter((c) => c.id != userAdmin.id);
        setUsers(userFilter);
        setOpenModal(false);
        setUserDelete(undefined);
      }
    } catch (error: any) {
      setError(error.message);
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
        <LoadingButton
          loading={loading}
          onClick={() => handleRemove()}
          className="bg-orange-700 rounded-md text-white disabled:bg-orange-300 disabled:text-red-700"
        >
          Deletar
        </LoadingButton>
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
