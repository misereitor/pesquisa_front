import { Button } from '@mui/material'
import { Dispatch, SetStateAction, useState } from 'react';
import InputSimple from '../input/input';
import { UserVote } from '@/src/model/user-voting';
import { updatePhoneByUserIdService } from '@/src/service/user-voting-service';
import { regexPhone } from '@/src/util/dataProcessing';
import { validatePhone } from '@/src/util/validate';

type Props = {
  user: UserVote;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setUser: Dispatch<SetStateAction<UserVote | null>>;
  loading: boolean;
};
export default function ListUser({
  user,
  loading,
  setLoading,
  setUser
}: Props) {
  const [editPhone, setEditPhone] = useState(false);
  const [phone, setPhone] = useState(user.phone);
  const [error, setError] = useState('');
  const updateUser = async () => {
    setLoading(true);
    if (phone === '' || validatePhone(regexPhone(phone))) {
      setError('Telefone inválido!');
      setLoading(false);
      return;
    }
    if (user.confirmed_phone) {
      const next = confirm(
        'Usuário já confirmou o seu telefone, deseja continuar asism mesmo?'
      );
      if (!next) return;
    }
    if (user.confirmed_vote) {
      const next = confirm(
        'Usuário já confirmou o seu voto, deseja continuar asism mesmo?'
      );
      if (!next) return;
    }
    const data = await updatePhoneByUserIdService(phone, user.id);
    if (data.success) {
      setUser({ ...user, phone });
      setEditPhone(false);
      setLoading(false);
      alert('Telefone atualizad!');
      return;
    }
    setError('Erro ao tentar atualizar o telefoen');
    setLoading(false);
  };
  return (
    <div className="flex w-full items-center justify-center">
      {user && (
        <div className="w-80 flex flex-col items-start justify-center p-5 rounded-lg mt-5 bg-zinc-950">
          <div className="border-b w-full">
            <h2 className="font-bold">Nome:</h2>
            <p>{user.name}</p>
          </div>
          <div className="border-b w-full">
            <h2 className="font-bold">CPF:</h2>
            <p>{user.cpf}</p>
          </div>
          <div className="border-b w-full">
            <h2 className="font-bold">Confirmou telefone</h2>
            <p>{user.confirmed_phone ? 'sim' : 'não'}</p>
          </div>
          <div className="border-b w-full">
            <h2 className="font-bold">Confirmou Voto</h2>
            <p>{user.confirmed_vote ? 'sim' : 'não'}</p>
          </div>
          <div className="border-b w-full">
            <h2 className="font-bold">Telefone</h2>
            {editPhone ? (
              <div className="flex justify-between items-center">
                <InputSimple
                  className="rounded-lg h-7 capitalize w-48"
                  type="text"
                  value={phone}
                  maxLength={15}
                  errortext={error}
                  data-testid="phone"
                  onChange={(e) =>
                    setPhone((e.target.value = regexPhone(e.target.value)))
                  }
                />
                <button
                  className="-mt-2"
                  type="button"
                  onClick={() => setEditPhone(false)}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="flex justify-between">
                <p>{user.phone}</p>
                <button type="button" onClick={() => setEditPhone(true)}>
                  Alterar
                </button>
              </div>
            )}
          </div>
          <div className="ml-auto mt-5">
            <Button
              data-testid="comecar"
              size="medium"
              color="success"
              type="button"
              loading={loading}
              onClick={updateUser}
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
              <span>Atualizar</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
