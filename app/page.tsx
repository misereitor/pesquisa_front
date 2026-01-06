'use client';
import Final from '@/components/final/final';
import LoginVoting from '../components/login-voting/page';
import { deleteCookie } from 'cookies-next/client';

export default function Home() {
  deleteCookie('user');
  deleteCookie('token');
  //return <Final />;
  return <LoginVoting />;
}
