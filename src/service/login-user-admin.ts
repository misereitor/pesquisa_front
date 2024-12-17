'use server';
import { FormUserAdmin } from '@/schema/schemaAdminUsers';
import { cookies } from 'next/headers';

const { API_URL, X_API_KEY } = process.env;

export async function loginUserAdmin(login: FormUserAdmin) {
  try {
    const response = await fetch(`${API_URL}/api/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': String(X_API_KEY)
      },
      body: JSON.stringify({ ...login })
    });
    const data = await response.json();
    if (response.ok) {
      if (data.success) {
        const cookieStore = await cookies();
        cookieStore.set('token', data.data.token);
        cookieStore.set('user', JSON.stringify(data.data.user));
        return true;
      }
    }
    const error = new Error(data.message || 'Erro desconhecido');
    error.name = 'ApiError';
    error.message = data.message;
    throw error;
  } catch (error) {
    console.error('Error in loginUserAdmin:', error);
    throw error;
  }
}
