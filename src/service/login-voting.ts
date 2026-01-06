'use server';
import { unstable_noStore as noStore } from 'next/cache';
import { ErrorBackend } from '../../src/model/error';
import { FormUserVoting } from '../schema/schemaLoginVoting';
const { API_URL, X_API_KEY } = process.env;

export async function checkCpfExist(cpf: string) {
  noStore();
  try {
    const response = await fetch(`${API_URL}/api/voting/auth/${cpf}`, {
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
}

export async function registerUserVoting(user: FormUserVoting) {
  noStore();
  try {
    const response = await fetch(`${API_URL}/api/voting/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': String(X_API_KEY)
      },
      body: JSON.stringify({ ...user })
    });
    console.log(response);
    const data = await response.json();
    if (response.ok) {
      return data as ErrorBackend;
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
  noStore();
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
      return data as ErrorBackend;
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
