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
    <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-zinc-900 via-black to-black animate-fade-in">
      <div className="w-full max-w-md p-8 rounded-2xl bg-zinc-900/50 backdrop-blur-md border border-yellow-500/20 shadow-2xl mx-4 relative overflow-hidden">
        {/* Decorative Gold Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-yellow-500/50 blur-xs"></div>

        <div className="flex flex-col items-center mb-8">
          <div className="relative w-48 h-24 mb-4 drop-shadow-2xl">
            <Image
              src={'/melhoresdoano.png'}
              fill
              className="object-contain"
              alt="Melhores do Ano"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <h1 className="text-xl font-medium text-white/90 tracking-wide">
            Área Administrativa
          </h1>
          <p className="text-sm text-gray-400 mt-2 text-center">
            Entre com suas credenciais para continuar
          </p>
        </div>

        <form
          autoComplete="off"
          onSubmit={handleSubmit(handleLogin)}
          className="space-y-5"
        >
          <div className="space-y-4 text-gray-200">
            <div>
              <InputSimple
                className="w-full px-4 py-3 rounded-lg border border-white/10 bg-black/40 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#ffe45f]/50 focus:border-[#ffe45f] outline-none transition-all"
                type="text"
                autoFocus
                placeholder="Ex: admin"
                label="Usuário"
                errortext={errors.username?.message}
                {...register('username')}
              />
            </div>
            <div>
              <InputSimple
                className="w-full px-4 py-3 rounded-lg border border-white/10 bg-black/40 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#ffe45f]/50 focus:border-[#ffe45f] outline-none transition-all"
                type="password"
                placeholder="********"
                label="Senha"
                errortext={errors.password?.message}
                {...register('password')}
              />
            </div>
          </div>

          <div className="h-6">
            {error && (
              <div className="flex items-center gap-2 text-red-300 text-sm bg-red-900/20 p-2 rounded border border-red-500/20">
                <span>⚠️</span>
                {error}
              </div>
            )}
          </div>

          <Button
            data-testid="comecar"
            size="large"
            type="submit"
            loading={loading}
            loadingPosition="end"
            endIcon={<IoPlayCircleOutline />}
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#ffe45f', // Gold/Yellow from original
              '&:hover': {
                backgroundColor: '#e6cd55' // Slightly darker gold
              },
              color: '#3f2e00', // Dark text for contrast on gold
              textTransform: 'none',
              borderRadius: '0.5rem',
              padding: '10px',
              fontSize: '1rem',
              fontWeight: 700,
              boxShadow: '0 4px 15px -3px rgba(255, 228, 95, 0.3)'
            }}
          >
            Acessar Sistema
          </Button>
        </form>
      </div>
    </div>
  );
}
