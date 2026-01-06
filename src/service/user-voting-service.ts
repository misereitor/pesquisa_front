'use server';
import { cookies } from 'next/headers';
const { API_URL, X_API_KEY } = process.env;
import { unstable_noStore as noStore } from 'next/cache';
import { ErrorBackend } from '../../src/model/error';
import { UserVote } from '../../src/model/user-voting';

export const getUserVoteByCpf = async (cpf: string) => {
  noStore();
  try {
    const response = await fetch(`${API_URL}/api/admin/user-vote/${cpf}`, {
      headers: {
        'X-API-KEY': String(X_API_KEY)
      }
    });
    const data = await response.json();
    if (response.ok) {
      return data as ErrorBackend;
    }
    const error = new Error(data.message || 'Erro desconhecido');
    error.name = 'ApiError';
    error.message = data.message;
    throw error;
  } catch (error) {
    console.error('Error in checkCpfExist:', error);
    throw error;
  }
};

export const updatePhoneByUserIdService = async (phone: string, id: number) => {
  noStore();
  try {
    const response = await fetch(`${API_URL}/api/admin/alter-phone`, {
      method: 'post',
      headers: {
        'X-API-KEY': String(X_API_KEY),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone,
        id
      })
    });
    const data = await response.json();
    if (response.ok) {
      return data as ErrorBackend;
    }
    const error = new Error(data.message || 'Erro desconhecido');
    error.name = 'ApiError';
    error.message = data.message;
    throw error;
  } catch (error) {
    console.error('Error in checkCpfExist:', error);
    throw error;
  }
};

export const userVoteCookiesService = async () => {
  const user = (await cookies()).get('user');
  if (!user) throw new Error('Não Autorizado');
  return JSON.parse(user.value) as UserVote;
};

export const tokenCookiesService = async () => {
  const token = (await cookies()).get('token');
  if (!token) throw new Error('Não Autorizado');
  return token.value;
};
