'use server';
import { DictionaryEntry } from '@/model/dictionary';
import { ErrorBackend } from '@/model/error';
import { unstable_noStore as noStore } from 'next/cache';
const { API_URL, X_API_KEY } = process.env;

export async function insertDictionaryService(dictionary: DictionaryEntry) {
  noStore();
  try {
    const response = await fetch(`${API_URL}/api/dictionary/create`, {
      method: 'POST',
      headers: {
        'X-API-KEY': String(X_API_KEY),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dictionary)
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
    console.error('Error in insertDictionaryService:', error);
    throw error;
  }
}

export async function getAllDictionaryService() {
  noStore();
  try {
    const response = await fetch(`${API_URL}/api/dictionary/get-all`, {
      headers: {
        'X-API-KEY': String(X_API_KEY)
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
    console.error('Error in getAllDictionaryService:', error);
    throw error;
  }
}

export async function updateDictionaryService(dictionary: DictionaryEntry) {
  noStore();
  try {
    const response = await fetch(`${API_URL}/api/dictionary/update`, {
      method: 'PUT',
      headers: {
        'X-API-KEY': String(X_API_KEY),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dictionary)
    });
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message || 'Erro desconhecido');
      error.name = 'ApiError';
      error.message = data.message;
      throw error;
    }
  } catch (error) {
    console.error('Error in updateDictionaryService:', error);
    throw error;
  }
}

export async function deleteDictionaryService(dictionary: DictionaryEntry) {
  noStore();
  try {
    const response = await fetch(
      `${API_URL}/api/dictionary/delete/${dictionary.key_word}`,
      {
        method: 'DELETE',
        headers: {
          'X-API-KEY': String(X_API_KEY),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dictionary)
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
    console.error('Error in deleteDictionaryService:', error);
    throw error;
  }
}
