'use client';

import ListUser from '@/components/alter-number/list-user';
import InputSimple from '@/components/input/input';
import { UserVote } from '@/src/model/user-voting';
import { getUserVoteByCpf } from '@/src/service/user-voting-service';
import { regexCPF } from '@/src/util/dataProcessing';
import { Button } from '@mui/material';
import { useState } from 'react';

export default function AlterarNumero() {
  const [user, setUser] = useState<UserVote | null>(null);
  const [loading, setLoading] = useState(false);
  const [cpf, setCpf] = useState('');
  const [error, setError] = useState('');

  const getUser = async () => {
    setLoading(true);
    setUser(null);
    setError('');
    if (cpf === '') return setError('Insira o CPF');
    const filterCPF = cpf.replaceAll(/\D/g, '');
    if (filterCPF.length !== 11) {
      setError('Informe um cpf válido!');
      return;
    }
    const data = await getUserVoteByCpf(filterCPF);
    if ('success' in data && !data.data) {
      setError('CPF não encontrado');
      setLoading(false);
      return;
    }
    if (data.data) {
      const newUser = data.data as UserVote;
      setUser(newUser);
      setLoading(false);
      return;
    }
    setLoading(false);
  };
  return (
    <div className="container mx-auto max-w-4xl">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Buscar Usuário
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pesquise por CPF para gerenciar as informações de contato do usuário
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-end gap-4">
          <div className="w-full sm:w-64">
            <InputSimple
              className="w-full h-11 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              type="text"
              value={cpf}
              maxLength={14}
              errortext={error}
              label="CPF"
              placeholder="000.000.000-00"
              data-testid="cpf"
              onChange={(e) =>
                setCpf((e.target.value = regexCPF(e.target.value)))
              }
            />
          </div>
          <div className="flex-1 pb-1">
            <Button
              data-testid="comecar"
              size="medium"
              type="button"
              loading={loading}
              onClick={getUser}
              loadingPosition="end"
              variant="contained"
              sx={{
                height: '44px',
                backgroundColor: '#4f46e5', // indigo-600
                '&:hover': {
                  backgroundColor: '#4338ca' // indigo-700
                },
                textTransform: 'none',
                borderRadius: '0.5rem',
                boxShadow: 'none',
                fontWeight: 500,
                minWidth: '120px'
              }}
            >
              Buscar
            </Button>
          </div>
        </div>
      </div>

      <div className="transition-all duration-300 ease-in-out">
        {user && (
          <ListUser
            setUser={setUser}
            user={user}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </div>
    </div>
  );
}
