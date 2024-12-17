'use server';
import { userAdmin } from '@/model/user-admin';
import {
  FormAddUserAdmin,
  FormUserAdminProfile
} from '@/schema/schemaAdminUsers';

const { API_URL, X_API_KEY } = process.env;

export async function createUserAdminService(userAdmin: FormAddUserAdmin) {
  try {
    const response = await fetch(`${API_URL}/api/admin/auth/registre`, {
      method: 'POST',
      headers: {
        'X-API-KEY': String(X_API_KEY),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...userAdmin })
    });
    const data = await response.json();
    if (response.ok) {
      return data.data as userAdmin;
    }
    throw new Error(data.message);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getAllUsersAdminService() {
  try {
    const response = await fetch(`${API_URL}/api/admin/user/get-all`, {
      method: 'GET',
      headers: {
        'X-API-KEY': String(X_API_KEY)
      }
    });
    const data = await response.json();
    if (response.ok) {
      return data.data as userAdmin[];
    }
    throw new Error(data.message);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateProfileAdmin(
  id: number,
  user: FormUserAdminProfile
) {
  try {
    const response = await fetch(
      `${API_URL}/api/admin/user/update/${id}/profile`,
      {
        method: 'PUT',
        headers: {
          'X-API-KEY': String(X_API_KEY),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      }
    );
    const data = await response.json();
    if (response.ok) {
      return data.data as userAdmin;
    }
    throw new Error(data.message);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateRoleAdmin(id: number, role: string) {
  try {
    const response = await fetch(
      `${API_URL}/api/admin/user/update/${id}/role`,
      {
        method: 'PUT',
        headers: {
          'X-API-KEY': String(X_API_KEY),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: role })
      }
    );
    const data = await response.json();
    if (response.ok) {
      return data.data as userAdmin;
    }
    throw new Error(data.message);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updatePasswordAdmin(id: number, password: string) {
  try {
    const response = await fetch(
      `${API_URL}/api/admin/user/update/${id}/password`,
      {
        method: 'PUT',
        headers: {
          'X-API-KEY': String(X_API_KEY),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: password })
      }
    );
    const data = await response.json();
    if (response.ok) {
      return data.data as userAdmin;
    }
    throw new Error(data.message);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteUserAdminService(id: number) {
  try {
    const response = await fetch(`${API_URL}/api/admin/user/delete/${id}`, {
      method: 'PUT',
      headers: {
        'X-API-KEY': String(X_API_KEY),
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (response.ok) {
      return data.data as userAdmin;
    }
    throw new Error(data.message);
  } catch (error: any) {
    throw new Error(error.message);
  }
}
