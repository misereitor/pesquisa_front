'use client';
import FormLogin from '@/components/admin/formLogin';
import { deleteCookie } from 'cookies-next/client';

export default function Admin() {
  deleteCookie('user');
  deleteCookie('token');
  return (
    <main>
      <FormLogin />
    </main>
  );
}
