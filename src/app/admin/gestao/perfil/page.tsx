'use client';

import Loading from '@/app/loading';
import Profile from '@/components/profile/profile';
import { userAdmin } from '@/model/user-admin';
import { getCookie } from 'cookies-next/client';

export default function Perfil() {
  const userCookies = getCookie('user');
  if (!userCookies) return <Loading />;
  const user = JSON.parse(userCookies) as userAdmin;
  return (
    <Profile
      superAdmin={user.role === 'superadmin' ? true : false}
      userAdmin={user}
    />
  );
}
