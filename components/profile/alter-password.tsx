'use client';

import { UserAdmin } from '@/src/model/user-admin';
import { Dispatch, SetStateAction, useState } from 'react';
import InputSimple from '../input/input';
import {
  FormAlterPassword,
  schemaAlterPassword
} from '@/src/schema/schemaAdminUsers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { updatePasswordAdmin } from '@/src/service/user-admin-service';
import { Button } from '@mui/material'
import { RxUpdate } from 'react-icons/rx';

type Props = {
  userAdmin: UserAdmin;
  setAlterPassword: Dispatch<SetStateAction<boolean>>;
};
export default function AlterPassword({ setAlterPassword, userAdmin }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [sucess, setSucess] = useState<string>('');
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormAlterPassword>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(schemaAlterPassword),
    defaultValues: {
      password: '',
      confirmpassword: ''
    }
  });

  const alterPassword = async (password: FormAlterPassword) => {
    try {
      setError('');
      setSucess('');
      setLoading(true);
      await updatePasswordAdmin(userAdmin.id, password.password);
      setSucess('Senha alterada');
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

      setTimeout(() => {
        setSucess('');
      }, 10000);
    }
  };
  return (
    <div className="flex items-center justify-center">
      <form
        autoComplete="off"
        className="w-80 flex flex-col items-center justify-center p-5 rounded-lg mt-10 bg-zinc-950"
        onSubmit={handleSubmit(alterPassword)}
      >
        <InputSimple
          className="rounded-lg w-72 h-7"
          type="password"
          label="Nova senha:"
          errortext={errors.password?.message}
          data-testid="password"
          {...register('password')}
        />
        <InputSimple
          className="rounded-lg w-72 h-7"
          type="password"
          label="Confirme a senha:"
          errortext={errors.confirmpassword?.message}
          data-testid="confirmpassword"
          {...register('confirmpassword')}
        />
        <div>{sucess && <p>{sucess}</p>}</div>
        <div>{error && <p className="text-red-800">{error}</p>}</div>
        <div className="flex justify-between mt-7 w-full">
          <button onClick={() => setAlterPassword(false)}>Cancelar</button>
          <Button
            data-testid="comecar"
            size="medium"
            color="success"
            type="submit"
            endIcon={<RxUpdate />}
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
            <span>Alterar</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
