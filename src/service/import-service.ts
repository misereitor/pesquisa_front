'use server';
import { ImportCSV } from '@/model/import-csv';

const { API_URL, X_API_KEY } = process.env;

export async function importCompanyAndCategoryService(
  association: ImportCSV[]
) {
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
      throw new Error(data.message);
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}
