'use server';
import { cookies } from 'next/headers';
import { valideTokenUserVotingService } from './auth-service';
import { Vote } from '@/model/votes';
import { UserVote } from '@/model/user-voting';

const { API_URL, X_API_KEY } = process.env;

export async function getAllVotesByUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const openToken = await valideTokenUserVotingService(token?.value);
    const response = await fetch(
      `${API_URL}/api/voting/${openToken.id}/get-all`,
      {
        headers: {
          'X-API-KEY': String(X_API_KEY)
        }
      }
    );
    const data = await response.json();
    if (response.ok) return data.data as Vote[];
    throw new Error(data.message);
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
}

export async function createVoteService(
  id_category: number,
  id_company: number
) {
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
    if (!response.ok) throw new Error(data.message);
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
}

export async function confirmVoteService(progress: number) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
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
    if (!response.ok) throw new Error(data.message);
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
}
