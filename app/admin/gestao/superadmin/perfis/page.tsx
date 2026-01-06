import ListUsers from '@/components/useradmin/listUsers';
import { UserAdmin } from '@/src/model/user-admin';
import { getAllUsersAdminService } from '@/src/service/user-admin-service';

export default async function SuperAdmin() {
  const data = await getAllUsersAdminService();
  const usersAdmin = data.data as UserAdmin[]
  return <ListUsers usersAdmin={usersAdmin} />;
}
