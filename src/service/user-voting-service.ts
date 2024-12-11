'use server';
import { UserVote } from '@/model/user-voting';
import { cookies } from 'next/headers';

export const userVoteCookiesService = async () => {
  const user = (await cookies()).get('user');
  if (!user) throw new Error('Não Autorizado');
  return JSON.parse(user.value) as UserVote;
};

export const tokenCookiesService = async () => {
  const token = (await cookies()).get('token');
  if (!token) throw new Error('Não Autorizado');
  return token.value;
};
