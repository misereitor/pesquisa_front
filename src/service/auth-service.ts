'use server';
import * as jose from 'jose';

const { SECRET_KEY_ADMIN, SECRET_KEY_VOTING } = process.env;

export async function valideTokenUserVotingService(token: string | undefined) {
  try {
    if (!token) throw new Error('Token invalid');
    const secret = new TextEncoder().encode(SECRET_KEY_VOTING);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as OpenToken;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function valideTokenUserAdminService(token: string | undefined) {
  try {
    if (!token) throw new Error('Token invalid');
    const secret = new TextEncoder().encode(SECRET_KEY_ADMIN);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as OpenToken;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
export type OpenToken = {
  id: number;
  username: string;
  roles: string;
};
