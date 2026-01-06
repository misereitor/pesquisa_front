'use server';
import * as jose from 'jose';
import { cookies } from 'next/headers';

const { SECRET_KEY_ADMIN, SECRET_KEY_VOTING } = process.env;

if (!SECRET_KEY_ADMIN) {
  throw new Error('SECRET_KEY_ADMIN environment variable is not set');
}

if (!SECRET_KEY_VOTING) {
  throw new Error('SECRET_KEY_VOTING environment variable is not set');
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

export async function validateTokenUserVotingService(
  token: string | undefined
): Promise<OpenTokenUserVoting> {
  try {
    if (!token) throw new Error('Token not provided');
    const secret = new TextEncoder().encode(SECRET_KEY_VOTING);
    const { payload } = await jose.jwtVerify(token, secret!);
    return payload as unknown as OpenTokenUserVoting;
  } catch (error) {
    console.error('Error in validateTokenUserVotingService:', error);
    throw new Error('Invalid voting token');
  }
}

export async function validateTokenUserAdminService(
  token: string | undefined
): Promise<OpenToken> {
  try {
    if (!token) throw new Error('Token not provided');
    const secret = new TextEncoder().encode(SECRET_KEY_ADMIN);
    const { payload } = await jose.jwtVerify(token, secret!);
    return payload as unknown as OpenToken;
  } catch (error) {
    console.error('Error in validateTokenUserAdminService:', error);
    throw new Error('Invalid admin token');
  }
}

export async function removeCookiesService() {
  const cookieNext = await cookies();
  cookieNext.delete('token');
  cookieNext.delete('user');
}
