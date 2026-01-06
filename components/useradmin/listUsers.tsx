'use client';

import { UserAdmin } from '@/src/model/user-admin';
import { useState } from 'react';
import { BiEdit } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import Modal from '../modal/modal';
import Profile from '../profile/profile';
import ModalDeleteUserAdmin from './modal-delete-user';
import ModalCreateUser from './modal-create-user';

type Props = {
  usersAdmin: UserAdmin[];
};
export default function ListUsers({ usersAdmin }: Props) {
  const [users, setUsers] = useState(usersAdmin);
  const [userEdit, setUserEdit] = useState<UserAdmin | undefined>();
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [userDelete, setUserDelete] = useState<UserAdmin | undefined>();
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);

  const handleDeleteAccountAdmin = (user: UserAdmin) => {
    setUserDelete(user);
    setOpenModalDelete(true);
  };
  const handleEditClick = (user: UserAdmin) => {
    setUserEdit(user);
    setOpenModalEdit(true);
  };

  return (
    <div>
      {userEdit && (
        <Modal openModal={openModalEdit} setOpenModal={setOpenModalEdit}>
          <Profile superAdmin={true} userAdmin={userEdit} />
        </Modal>
      )}
      {userDelete && (
        <Modal openModal={openModalDelete} setOpenModal={setOpenModalDelete}>
          <ModalDeleteUserAdmin
            setUsers={setUsers}
            users={users}
            userAdmin={userDelete}
            setOpenModal={setOpenModalDelete}
            setUserDelete={setUserDelete}
          />
        </Modal>
      )}
      <Modal setOpenModal={setOpenModalAdd} openModal={openModalAdd}>
        <ModalCreateUser
          setOpenModal={setOpenModalAdd}
          setUsers={setUsers}
          users={users}
        />
      </Modal>
      <div className="h-10 bg-gray-900 w-full flex justify-end items-center pr-4">
        <button onClick={() => setOpenModalAdd(true)} type="button">
          Adicionar
        </button>
      </div>
      <table className="w-full border-collapse border border-solid border-slate-700 p-2 bg-zinc-900">
        <thead>
          <tr className="border border-solid border-slate-700 p-2">
            <th className="border border-solid border-slate-700 p-2">
              Usuário
            </th>
            <th className="border border-solid border-slate-700 p-2">
              Nome Completo
            </th>
            <th className="border border-solid border-slate-700 p-2">E-mail</th>
            <th className="border border-solid border-slate-700 p-2">Perfil</th>
            <th className="border border-solid border-slate-700 p-2">Editar</th>
            <th className="border border-solid border-slate-700 p-2">
              Excluir
            </th>
          </tr>
        </thead>
        {users.map((user) => (
          <tbody key={user.id}>
            <tr>
              <td className="border border-solid border-slate-700 p-2">
                {user.username}
              </td>
              <td className="border border-solid border-slate-700 p-2">
                {user.name}
              </td>
              <td className="border border-solid border-slate-700 p-2">
                {user.email}
              </td>
              <td className="border border-solid border-slate-700 p-2">
                {user.role}
              </td>
              <td className="border border-solid border-slate-700 p-2 text-center">
                <button type="button" onClick={() => handleEditClick(user)}>
                  <BiEdit />
                </button>
              </td>
              <td className="border border-solid border-slate-700 p-2 text-center">
                <button
                  type="button"
                  onClick={() => handleDeleteAccountAdmin(user)}
                >
                  <MdDelete />
                </button>
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
}
