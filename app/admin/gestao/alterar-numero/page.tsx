'use client';

import ListUser from '@/components/alter-number/list-user';
import InputSimple from '@/components/input/input';
import { UserVote } from '@/src/model/user-voting';
import { getUserVoteByCpf } from '@/src/service/user-voting-service';
import { regexCPF } from '@/src/util/dataProcessing';
import { Button } from '@mui/material'
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
    <div>
      <div>
        <div className="bg-neutral-800 px-4 shadow-md mb-0.5">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-[#FFDE5E] text-xl font-bold">Buscar Por CPF</h1>
          </div>
          <div className="flex items-center">
            <div className="w-52">
              <InputSimple
                className="rounded-lg h-7 capitalize w-52"
                type="text"
                value={cpf}
                maxLength={14}
                errortext={error}
                label="CPF:"
                data-testid="cpf"
                onChange={(e) =>
                  setCpf((e.target.value = regexCPF(e.target.value)))
                }
              />
            </div>
            <div className="w-52 ml-5">
              <Button
                data-testid="comecar"
                size="medium"
                color="success"
                type="button"
                loading={loading}
                onClick={getUser}
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
                <span>Buscar</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div>
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
