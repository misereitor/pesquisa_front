'use server';
import { cookies } from 'next/headers';
import { valideTokenUserVotingService } from './auth-service';
import { Vote } from '@/model/votes';
import { UserVote } from '@/model/user-voting';
import { tokenCookiesService } from './user-voting-service';
import { Company } from '@/model/company';
import { Category } from '@/model/category';
import { DictionaryEntry } from '@/model/dictionary';
import { ErrorBackend } from '@/model/error';
import { unstable_noStore as noStore } from 'next/cache';

const { API_URL, X_API_KEY } = process.env;

export async function getAllDataForVoteService() {
  noStore();
  try {
    const token = await tokenCookiesService();
    const openToken = await valideTokenUserVotingService(token);
    const response = await fetch(
      `${API_URL}/api/voting/${openToken.id}/get-all-data`,
      {
        method: 'GET',
        headers: {
          'X-API-KEY': String(X_API_KEY)
        }
      }
    );
    const data = await response.json();
    if (response.ok)
      return data.data as {
        companiesData: Company[];
        categoriesData: Category[];
        userVotesData: Vote[];
        dictionaryData: DictionaryEntry[];
      };
    const error = new Error(data.message || 'Erro desconhecido');
    error.name = 'ApiError';
    error.message = data.message;
    throw error;
  } catch (error) {
    console.error('Error in getAllDataForVoteService:', error);
    throw error;
  }
}

export async function getAllVotesByUser() {
  noStore();
  try {
    const token = await tokenCookiesService();
    const openToken = await valideTokenUserVotingService(token);
    const response = await fetch(
      `${API_URL}/api/voting/${openToken.id}/get-all`,
      {
        headers: {
          'X-API-KEY': String(X_API_KEY)
        }
      }
    );
    const data = await response.json();
    if (response.ok) return data as ErrorBackend;
    const error = new Error(data.message || 'Erro desconhecido');
    error.name = 'ApiError';
    error.message = data.message;
    throw error;
  } catch (error) {
    console.error('Error in getAllVotesByUser:', error);
    throw error;
  }
}

export async function createVoteService(
  id_category: number,
  id_company: number
) {
  noStore();
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const openToken = await valideTokenUserVotingService(token?.value);
    const vote: Vote = {
      id_user_vote: openToken.id,
      id_category,
      id_company
    };
    const response = await fetch(`${API_URL}/api/voting/create-vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': String(X_API_KEY)
      },
      body: JSON.stringify(vote)
    });
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message || 'Erro desconhecido');
      error.name = 'ApiError';
      error.message = data.message;
      throw error;
    }
  } catch (error) {
    console.error('Error in createVoteService:', error);
    throw error;
  }
}

export async function confirmVoteService(progress: number) {
  noStore();
  try {
    const cookieStore = await cookies();
    const userCookies = cookieStore.get('user');
    if (!userCookies) throw new Error('Falha interna');
    const user: UserVote = JSON.parse(userCookies.value);
    user.percentage_vote = progress;
    user.confirmed_vote = true;
    cookieStore.set('user', JSON.stringify(user));
    const response = await fetch(`${API_URL}/api/voting/confirm-vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': String(X_API_KEY)
      },
      body: JSON.stringify(user)
    });
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message || 'Erro desconhecido');
      error.name = 'ApiError';
      error.message = data.message;
      throw error;
    }
  } catch (error) {
    console.error('Error in confirmVoteService:', error);
    throw error;
  }
}
