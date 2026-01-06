'use server';
import { unstable_noStore as noStore } from 'next/cache';
import { Category, AssociationCategoryCompany } from '../../src/model/category';
import { ErrorBackend } from '../../src/model/error';
const { API_URL, X_API_KEY } = process.env;

export async function getAllCategories() {
  noStore();
  try {
    const response = await fetch(`${API_URL}/api/category/get-all`, {
      method: 'GET',
      headers: {
        'X-API-KEY': String(X_API_KEY),
        'Content-Type': 'application/json'
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
    console.error('Error in getAllCategories:', error);
    throw error;
  }
}

export async function createCategoryService(name: string) {
  noStore();
  try {
    const response = await fetch(`${API_URL}/api/category/create`, {
      method: 'POST',
      headers: {
        'X-API-KEY': String(X_API_KEY),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, active: true })
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
    console.error('Error in createCategoryService:', error);
    throw error;
  }
}

export async function updateCategoryService(category: Category) {
  noStore();
  try {
    const response = await fetch(`${API_URL}/api/category/update`, {
      method: 'PUT',
      headers: {
        'X-API-KEY': String(X_API_KEY),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(category)
    });
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message || 'Erro desconhecido');
      error.name = 'ApiError';
      error.message = data.message;
      throw error;
    }
  } catch (error) {
    console.error('Error in updateCategoryService:', error);
    throw error;
  }
}

export async function deleteCategoryService(id_category: number) {
  noStore();
  try {
    const response = await fetch(
      `${API_URL}/api/category/disable/${id_category}`,
      {
        method: 'PUT',
        headers: {
          'X-API-KEY': String(X_API_KEY),
          'Content-Type': 'application/json'
        }
      }
    );
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message || 'Erro desconhecido');
      error.name = 'ApiError';
      error.message = data.message;
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteCategoryService:', error);
    throw error;
  }
}

export async function createAssociationCategoryService(
  association: AssociationCategoryCompany[]
) {
  noStore();
  try {
    const response = await fetch(`${API_URL}/api/association/create-many`, {
      method: 'POST',
      headers: {
        'X-API-KEY': String(X_API_KEY),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(association)
    });
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message || 'Erro desconhecido');
      error.name = 'ApiError';
      error.message = data.message;
      throw error;
    }
  } catch (error) {
    console.error('Error in createAssociationCategoryService:', error);
    throw error;
  }
}

export async function removeCompanyFromCategory(
  id_category: number,
  id_company: number
) {
  noStore();
  try {
    const response = await fetch(`${API_URL}/api/association/delete`, {
      method: 'DELETE',
      headers: {
        'X-API-KEY': String(X_API_KEY),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id_category, id_company })
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
    console.error('Error in removeCompanyFromCategory:', error);
    throw error;
  }
}
