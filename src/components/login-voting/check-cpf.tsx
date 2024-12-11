import {
  FormUserVotingCPF,
  schemaUserVotingCPF
} from '@/schema/schemaLoginVoting';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import InputSimple from '../input/input';
import { regexCPF } from '@/util/dataProcessing';
import LoadingButton from '../button/loading-button';
import { checkCpfExist } from '@/service/login-voting';
import { UserVote } from '@/model/user-voting';

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
      const { data } = await checkCpfExist(cpf);
      if (data) {
        setUser(data);
        setStage(3);
        return;
      }
      const user: UserVote = {
        name: '',
        phone: '',
        cpf: cpf,
        uf: '',
        city: '',
        try_code_send: 0,
        id: 0,
        confirmed_vote: false,
        confirmed_phone: false,
        date_create: new Date(),
        date_vote: new Date(),
        last_ip: ''
      };
      setUser(user);
      setStage(2);
      return;
    } catch (error: any) {
      setError('cpf', {
        type: 'validate',
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-4/5 mx-auto">
      <div className="my-5">
        <span>Para começar, primeiro digite o seu CPF:</span>
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
        <div className="flex justify-end mr-2">
          <LoadingButton type="submit" loading={loading}>
            Próximo
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}
