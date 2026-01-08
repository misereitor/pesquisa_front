'use server';
import { unstable_noStore as noStore } from 'next/cache';
import { cookies } from 'next/headers';
import { ErrorBackend } from '../../src/model/error';
import {
  FormAddUserAdmin,
  FormUserAdminProfile
} from '../schema/schemaAdminUsers';

const { API_URL, X_API_KEY } = process.env;

export async function createUserAdminService(userAdmin: FormAddUserAdmin) {
  noStore();
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const response = await fetch(`${API_URL}/api/admin/auth/registre`, {
      method: 'POST',
      headers: {
        'X-API-KEY': String(X_API_KEY),
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ ...userAdmin })
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
    console.error('Error in createUserAdminService:', error);
    throw error;
  }
}

export async function getAllUsersAdminService() {
  noStore();
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const response = await fetch(`${API_URL}/api/admin/user/get-all`, {
      method: 'GET',
      headers: {
        'X-API-KEY': String(X_API_KEY),
        Authorization: `Bearer ${token}`
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
    console.error('Error in getAllUsersAdminService:', error);
    throw error;
  }
}

export async function updateProfileAdmin(
  id: number,
  user: FormUserAdminProfile
) {
  noStore();
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const response = await fetch(
      `${API_URL}/api/admin/user/update/${id}/profile`,
      {
        method: 'PUT',
        headers: {
          'X-API-KEY': String(X_API_KEY),
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(user)
      }
    );
    const data = await response.json();
    if (response.ok) {
      return data as ErrorBackend;
    }
    const error = new Error(data.message || 'Erro desconhecido');
    error.name = 'ApiError';
    error.message = data.message;
    throw error;
  } catch (error) {
    console.error('Error in updateProfileAdmin:', error);
    throw error;
  }
}

export async function updateRoleAdmin(id: number, role: string) {
  noStore();
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const response = await fetch(
      `${API_URL}/api/admin/user/update/${id}/role`,
      {
        method: 'PUT',
        headers: {
          'X-API-KEY': String(X_API_KEY),
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: role })
      }
    );
    const data = await response.json();
    if (response.ok) {
      return data as ErrorBackend;
    }
    const error = new Error(data.message || 'Erro desconhecido');
    error.name = 'ApiError';
    error.message = data.message;
    throw error;
  } catch (error) {
    console.error('Error in updateRoleAdmin:', error);
    throw error;
  }
}

export async function updatePasswordAdmin(id: number, password: string) {
  noStore();
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const response = await fetch(
      `${API_URL}/api/admin/user/update/${id}/password`,
      {
        method: 'PUT',
        headers: {
          'X-API-KEY': String(X_API_KEY),
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ password: password })
      }
    );
    const data = await response.json();
    if (response.ok) {
      return data as ErrorBackend;
    }
    const error = new Error(data.message || 'Erro desconhecido');
    error.name = 'ApiError';
    error.message = data.message;
    throw error;
  } catch (error) {
    console.error('Error in updatePasswordAdmin:', error);
    throw error;
  }
}

export async function deleteUserAdminService(id: number) {
  noStore();
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const response = await fetch(`${API_URL}/api/admin/user/delete/${id}`, {
      method: 'PUT',
      headers: {
        'X-API-KEY': String(X_API_KEY),
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message || 'Erro desconhecido');
      error.name = 'ApiError';
      error.message = data.message;
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteUserAdminService:', error);
    throw error;
  }
}
