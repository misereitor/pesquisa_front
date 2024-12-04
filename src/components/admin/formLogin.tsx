'use client';

import { useState } from 'react';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import InputSimple from '@/components/input/input';
import { FormUserAdmin, schemaUserAdmin } from '@/schema/schemaAdminUsers';
import { loginUserAdmin } from '@/service/login-user-admin';
import LoadingButton from '../button/loading-button';
import { useRouter } from 'next/navigation';
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
      if (data) {
        router.push('/admin/gestao/dashboard');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
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
            <LoadingButton type="submit" loading={loading}>
              Login
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}
