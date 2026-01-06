import {
  FormUserVotingCPF,
  schemaUserVotingCPF
} from '@/src/schema/schemaLoginVoting';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import InputSimple from '../input/input';
import { regexCPF } from '@/src/util/dataProcessing';
import { checkCpfExist } from '@/src/service/login-voting';
import { UserVote } from '@/src/model/user-voting';
import { IoPlayCircleOutline } from 'react-icons/io5';
import { Button } from '@mui/material';
import Link from 'next/link';

type Props = {
  setStage: Dispatch<SetStateAction<number>>;
  setUser: Dispatch<SetStateAction<UserVote | undefined>>;
  setLastPage: Dispatch<SetStateAction<number>>;
};

export default function ChackCPF({ setStage, setUser, setLastPage }: Props) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    getValues,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormUserVotingCPF>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(schemaUserVotingCPF),
    defaultValues: {
      cpf: ''
    }
  });
  useEffect(() => {
    setLastPage(1);
  }, [setLastPage]);

  const handleSubmitForm = async () => {
    try {
      setLoading(true);
      const cpf = getValues('cpf').replaceAll(/\D/g, '');
      const data = await checkCpfExist(cpf);
      if ('success' in data && !data.success) {
        setError('cpf', {
          type: 'validate',
          message: 'CPF já votou'
        });
        setLoading(false);
        return;
      }
      if (data.data) {
        const newUser = data.data as UserVote;
        setUser(newUser);
        setStage(3);
        setLoading(false);
        return;
      }
      const user: UserVote = {
        name: '',
        phone: '',
        cpf: cpf,
        country: '',
        state: '',
        city: '',
        try_code_send: 0,
        id: 0,
        confirmed_vote: false,
        confirmed_phone: false,
        date_create: new Date(),
        date_vote: new Date(),
        last_ip: '',
        votes: []
      };
      setUser(user);
      setStage(2);
      setLoading(false);
      return;
    } catch (error: any) {
      console.error('Error in handleSubmitForm:', error);

      if (error.name === 'Error') {
        // Caso o backend tenha retornado uma mensagem de erro específica
        setError('cpf', {
          type: 'validate',
          message: 'CPF já votou'
        });
        setLoading(false);
      } else {
        // Erro genérico (ex.: problemas de rede)
        setError('cpf', {
          type: 'validate',
          message: 'Erro interno'
        });
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-[95%] w-[500px] mx-auto">
      <div className="mt-10 mx-auto">
        <h2>
          Bem-vindo a votação do prêmio{' '}
          <span className="font-bold">MELHORES DO ANO 2025</span> de Santo
          Antônio de Jesus
        </h2>
      </div>
      <div className="my-5">
        <span>Para começar, digite o seu CPF</span>
      </div>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <div>
          <InputSimple
            className="rounded-lg w-[96%] h-7 capitalize"
            type="text"
            maxLength={14}
            label="CPF:"
            data-testid="cpf"
            errortext={errors.cpf?.message}
            {...register('cpf', {
              onChange: (e) => (e.target.value = regexCPF(e.target.value))
            })}
          />
        </div>
        <div className="w-full mb-4 flex justify-end pr-2">
          <Link
            href={
              'https://wa.me/5575981976540?text=Ol%C3%A1%2C%20estou%20com%20problemas%20no%20sistema%20Melhores%20do%20Ano%202025'
            }
            target="_blank"
          >
            Precisa de ajuda? Clique aqui!
          </Link>
        </div>
        <div className="flex justify-end mr-2">
          <Button
            data-testid="comecar"
            size="medium"
            color="success"
            type="submit"
            endIcon={<IoPlayCircleOutline />}
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
            <span>Próximo</span>
          </Button>
        </div>
      </form>
      <div className="mt-16">
        Vote acima de 70% das categorias e concorra a uma TV de 50&quot;
        <h2></h2>
      </div>
    </div>
  );
}
