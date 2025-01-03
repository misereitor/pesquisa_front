'use client';
import Image from 'next/image';
import ChackCPF from './check-cpf';
import { useState } from 'react';
import ConfirmCode from './confirm-code';
import { UserVote } from '@/model/user-voting';
import Register from './register';

export default function LoginVoting() {
  const [stage, setStage] = useState(1);
  const [user, setUser] = useState<UserVote>();
  const [lastPage, setLastPage] = useState(1);
  return (
    <div className="mx-auto">
      <div>
        <div className="flex justify-center mb-7 w-4/5 mx-auto">
          <Image
            src={'/melhoresdoano.png'}
            width={250}
            height={250}
            alt="Melhores do Ano"
            style={{ width: 'auto', height: '100px' }}
          />
        </div>
        <div className=" mt-10 max-w-[95%] w-[500px] mx-auto">
          <span>
            Bem vindo a votação do premio{' '}
            <span className="font-bold">MELHORES DO ANO 2024</span> de Santo
            Antonio de Jesus
          </span>
        </div>
        <div className="mt-3">
          {stage == 1 && (
            <ChackCPF
              setLastPage={setLastPage}
              setStage={setStage}
              setUser={setUser}
            />
          )}
          {stage == 2 && user && (
            <Register
              user={user}
              setLastPage={setLastPage}
              setStage={setStage}
              setUser={setUser}
            />
          )}
          {stage == 3 && user && (
            <ConfirmCode lastPage={lastPage} user={user} setStage={setStage} />
          )}
        </div>
      </div>
    </div>
  );
}
