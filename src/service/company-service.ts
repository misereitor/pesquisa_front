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
    throw new Error(data.message);
  } catch (error: any) {
    throw new Error(error.message);
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
    throw new Error(data.message);
  } catch (error: any) {
    throw new Error(error.message);
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
    throw new Error(data.message);
  } catch (error: any) {
    throw new Error(error.message);
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
    throw new Error(data.message);
  } catch (error: any) {
    throw new Error(error.message);
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
      throw new Error(data.message);
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}
