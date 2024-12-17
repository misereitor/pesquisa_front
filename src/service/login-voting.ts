'use server';
import { FormUserVoting } from '@/schema/schemaLoginVoting';
import { cookies } from 'next/headers';
const { API_URL, X_API_KEY } = process.env;

export async function checkCpfExist(cpf: string) {
  try {
    const response = await fetch(`${API_URL}/api/voting/auth/${cpf}`, {
      headers: {
        'X-API-KEY': String(X_API_KEY)
      }
    });
    const data = await response.json();
    if (response.ok) return data;
    const error = new Error(data.message || 'Erro desconhecido');
    error.name = 'ApiError';
    error.message = data.message;
    throw error;
  } catch (error) {
    console.error('Error in checkCpfExist:', error);
    throw error;
  }
}

export async function registerUserVoting(user: FormUserVoting) {
  try {
    const response = await fetch(`${API_URL}/api/voting/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': String(X_API_KEY)
      },
      body: JSON.stringify({ ...user })
    });
    const data = await response.json();
    if (response.ok) {
      return data.data;
    }
    const error = new Error(data.message || 'Erro desconhecido');
    error.name = 'ApiError';
    error.message = data.message;
    throw error;
  } catch (error) {
    console.error('Error in registerUserVoting:', error);
    throw error;
  }
}

export async function confirmCode(code: string, phone: string) {
  try {
    const response = await fetch(`${API_URL}/api/voting/auth/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': String(X_API_KEY)
      },
      body: JSON.stringify({ code, phone })
    });
    const data = await response.json();
    if (response.ok) {
      if (data.success) {
        const cookieStore = await cookies();
        cookieStore.set('token', data.data.token);
        cookieStore.set('user', JSON.stringify(data.data.user));
        return true;
      }
      const error = new Error(data.message || 'Erro desconhecido');
      error.name = 'ApiError';
      error.message = data.message;
      throw error;
    }
    const error = new Error(data.message || 'Erro desconhecido');
    error.name = 'ApiError';
    error.message = data.message;
    throw error;
  } catch (error) {
    console.error('Error in confirmCode:', error);
    throw error;
  }
}
