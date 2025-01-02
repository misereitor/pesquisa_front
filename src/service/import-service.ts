'use server';
import { ImportCSV } from '@/model/import-csv';
import { unstable_noStore as noStore } from 'next/cache';
const { API_URL, X_API_KEY } = process.env;

export async function importCompanyAndCategoryService(
  association: ImportCSV[]
) {
  noStore();
  try {
    const response = await fetch(`${API_URL}/api/import/create-many`, {
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
    console.error('Error in importCompanyAndCategoryService:', error);
    throw error;
  }
}
