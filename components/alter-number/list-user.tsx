import { Button } from '@mui/material';
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
    <div className="w-full animate-fade-in">
      {user && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Detalhes do Usuário
            </h2>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {/* Nome */}
            <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Nome
              </span>
              <span className="text-sm text-gray-900 dark:text-white sm:col-span-2 font-medium">
                {user.name}
              </span>
            </div>

            {/* CPF */}
            <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                CPF
              </span>
              <span className="text-sm text-gray-900 dark:text-white sm:col-span-2 font-mono">
                {user.cpf}
              </span>
            </div>

            {/* Status Telefone */}
            <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Telefone Confirmado?
              </span>
              <div className="sm:col-span-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.confirmed_phone
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                  }`}
                >
                  {user.confirmed_phone ? 'Sim' : 'Não'}
                </span>
              </div>
            </div>

            {/* Status Voto */}
            <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Voto Confirmado?
              </span>
              <div className="sm:col-span-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.confirmed_vote
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {user.confirmed_vote ? 'Sim' : 'Não'}
                </span>
              </div>
            </div>

            {/* Telefone Editável */}
            <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-indigo-50/50 dark:bg-indigo-900/10">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Telefone
              </span>
              <div className="sm:col-span-2">
                {editPhone ? (
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <div className="w-full sm:w-auto">
                      <InputSimple
                        className="w-full sm:w-48 h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        type="text"
                        value={phone}
                        maxLength={15}
                        errortext={error}
                        data-testid="phone"
                        onChange={(e) =>
                          setPhone(
                            (e.target.value = regexPhone(e.target.value))
                          )
                        }
                      />
                    </div>
                    <button
                      className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white underline decoration-dotted underline-offset-2"
                      type="button"
                      onClick={() => setEditPhone(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-900 dark:text-white font-mono">
                      {user.phone}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditPhone(true)}
                      className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium hover:underline"
                    >
                      Alterar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <Button
              data-testid="comecar"
              size="medium"
              type="button"
              loading={loading}
              onClick={updateUser}
              loadingPosition="end"
              variant="contained"
              disabled={!editPhone && user.phone === phone}
              sx={{
                backgroundColor: '#4f46e5', // indigo-600
                '&:hover': {
                  backgroundColor: '#4338ca' // indigo-700
                },
                textTransform: 'none',
                borderRadius: '0.5rem',
                boxShadow: 'none',
                fontWeight: 500
              }}
            >
              Salvar Alterações
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
