'use client';

import { UserAdmin } from '@/src/model/user-admin';
import { useState } from 'react';
import AlterProfile from './alter-profile';
import AlterPassword from './alter-password';

type Props = {
  userAdmin: UserAdmin;
  superAdmin: boolean;
};

export default function Profile({ superAdmin, userAdmin }: Props) {
  const [alterPassword, setAlterPassword] = useState(false);

  return (
    <div>
      {alterPassword ? (
        <AlterPassword
          userAdmin={userAdmin}
          setAlterPassword={setAlterPassword}
        />
      ) : (
        <AlterProfile
          superAdmin={superAdmin}
          setAlterPassword={setAlterPassword}
          userAdmin={userAdmin}
        />
      )}
    </div>
  );
}
