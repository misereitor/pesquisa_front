import ListUsers from '@/components/useradmin/listUsers';
import { getAllUsersAdminService } from '@/service/user-admin-service';

export default async function SuperAdmin() {
  const users = await getAllUsersAdminService();
  return <ListUsers usersAdmin={users} />;
}
