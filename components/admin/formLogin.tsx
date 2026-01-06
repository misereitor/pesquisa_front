'use client';

import { useState } from 'react';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import InputSimple from '@/components/input/input';
import { useRouter } from 'next/navigation';
import { IoPlayCircleOutline } from 'react-icons/io5';
import { FormUserAdmin, schemaUserAdmin } from '@/src/schema/schemaAdminUsers';
import { loginUserAdmin } from '@/src/service/login-user-admin';
import { Button } from '@mui/material';
export default function FormLogin() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormUserAdmin>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(schemaUserAdmin),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const handleLogin = async (login: FormUserAdmin) => {
    try {
      setLoading(true);
      setError('');
      const data = await loginUserAdmin(login);
      if (!data.success) {
        setError(data.message);
        setLoading(false);
        return;
      }
      if (data.success) {
        router.push('/admin/gestao/dashboard');
      }
    } catch (error: any) {
      console.error('Error in handleSubmitForm:', error);

      if (error.message === 'Login ou senha inválidos') {
        // Caso o backend tenha retornado uma mensagem de erro específica
        setError(error.message);
        setLoading(false);
      } else {
        // Erro genérico (ex.: problemas de rede)
        setError('Ocorreu um erro inesperado. Tente novamente mais tarde.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        <div className="flex justify-center mb-7">
          <Image
            src={'/melhoresdoano.png'}
            width={250}
            height={250}
            alt="Melhores do Ano"
            priority
            style={{ width: 'auto', height: '100px' }}
          ></Image>
        </div>
        <form
          autoComplete="off"
          onSubmit={handleSubmit(handleLogin)}
          className="w-72 h-96"
        >
          <div>
            <InputSimple
              className="rounded-lg w-72 h-7"
              type="text"
              autoFocus
              label="Usuario:"
              errortext={errors.username?.message}
              {...register('username')}
            />
          </div>
          <div>
            <InputSimple
              className="rounded-lg w-72 h-7"
              type="password"
              label="Senha:"
              errortext={errors.password?.message}
              {...register('password')}
            />
          </div>
          <div className="h-6">
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>

          <div className="flex justify-end z-0 relative mt-4">
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
              <span>Login</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
