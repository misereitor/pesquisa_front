'use server';
import { Category } from '@/model/category';

const { API_URL, X_API_KEY } = process.env;

export async function getAllCategories() {
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
      return data.data as Category[];
    }
    throw new Error(data.message);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateCategoryService(category: Category) {
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
      throw new Error(data.message);
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteCategoryService(id_category: number) {
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
      throw new Error(data.message);
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function removeCompanyFromCategory(
  id_category: number,
  id_company: number
) {
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
      return data.data as Category[];
    }
    throw new Error(data.message);
  } catch (error: any) {
    throw new Error(error.message);
  }
}
