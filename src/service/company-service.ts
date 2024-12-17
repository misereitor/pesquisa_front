'use server';

import { Company } from '@/model/company';
import { FormCompanyEdit } from '@/schema/schemaCompany';

const { API_URL, X_API_KEY } = process.env;

export async function getAllCompany() {
  try {
    const response = await fetch(`${API_URL}/api/company/get-all`, {
      headers: {
        'X-API-KEY': String(X_API_KEY)
      }
    });
    const data = await response.json();
    if (response.ok) {
      return data.data as Company[];
    }
    const error = new Error(data.message || 'Erro desconhecido');
    error.name = 'ApiError';
    error.message = data.message;
    throw error;
  } catch (error) {
    console.error('Error in getAllCompany:', error);
    throw error;
  }
}

export async function cerateCompanyService(company: FormCompanyEdit) {
  try {
    const response = await fetch(`${API_URL}/api/company/create`, {
      method: 'POST',
      headers: {
        'X-API-KEY': String(X_API_KEY),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(company)
    });
    const data = await response.json();
    if (response.ok) {
      return data.data as Company;
    }
    const error = new Error(data.message || 'Erro desconhecido');
    error.name = 'ApiError';
    error.message = data.message;
    throw error;
  } catch (error) {
    console.error('Error in cerateCompanyService:', error);
    throw error;
  }
}

export async function updateCompanyService(company: Company) {
  try {
    const response = await fetch(`${API_URL}/api/company/update`, {
      method: 'PUT',
      headers: {
        'X-API-KEY': String(X_API_KEY),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(company)
    });
    const data = await response.json();
    if (response.ok) {
      return data.data as Company;
    }
    const error = new Error(data.message || 'Erro desconhecido');
    error.name = 'ApiError';
    error.message = data.message;
    throw error;
  } catch (error) {
    console.error('Error in updateCompanyService:', error);
    throw error;
  }
}

export async function associateCompany(id: number, associate: boolean) {
  try {
    const response = await fetch(`${API_URL}/api/company/association`, {
      method: 'PUT',
      headers: {
        'X-API-KEY': String(X_API_KEY),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, associate })
    });
    const data = await response.json();
    if (response.ok) {
      return data.data as Company[];
    }
    const error = new Error(data.message || 'Erro desconhecido');
    error.name = 'ApiError';
    error.message = data.message;
    throw error;
  } catch (error) {
    console.error('Error in associateCompany:', error);
    throw error;
  }
}

export async function deleteCompany(id: number) {
  try {
    const response = await fetch(`${API_URL}/api/company/disable/${id}`, {
      method: 'PUT',
      headers: {
        'X-API-KEY': String(X_API_KEY),
        'Content-Type': 'application/json'
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
    console.error('Error in deleteCompany:', error);
    throw error;
  }
}
