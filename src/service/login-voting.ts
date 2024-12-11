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
    throw new Error(data.message);
  } catch (error: any) {
    throw new Error(error.message);
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
    throw new Error(data.message);
  } catch (error: any) {
    throw new Error(error.message);
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
      throw new Error(data.message);
    }
    throw new Error(data.message);
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
}
