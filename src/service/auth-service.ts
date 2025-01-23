'use server';
import * as jose from 'jose';
import { cookies } from 'next/headers';

const { SECRET_KEY_ADMIN, SECRET_KEY_VOTING } = process.env;

export async function valideTokenUserVotingService(token: string | undefined) {
  try {
    if (!token) throw new Error('Token invalid');
    const secret = new TextEncoder().encode(SECRET_KEY_VOTING);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as OpenTokenUserVoting;
  } catch (error) {
    console.error('Error in valide code:', error);
    throw error;
  }
}

export async function valideTokenUserAdminService(token: string | undefined) {
  if (!token) throw new Error('Token invalid');
  const secret = new TextEncoder().encode(SECRET_KEY_ADMIN);
  const { payload } = await jose.jwtVerify(token, secret);
  return payload as OpenToken;
}

export type OpenToken = {
  id: number;
  username: string;
  roles: string;
};

export type OpenTokenUserVoting = {
  id: number;
  phone: string;
};

export async function removeCookiesService() {
  const cookieNext = await cookies();
  cookieNext.delete('token');
  cookieNext.delete('user');
}
