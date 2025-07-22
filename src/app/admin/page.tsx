import UserTable from '@/components/user-table';
import { getAdminUsers, getStaffUsers } from '@/actions/users';
import Logout from '@/components/admin/logout';

export default async function Admin() {
  const adminUsers = await getAdminUsers();
  const staffUsers = await getStaffUsers();
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Logout />
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage users and system settings</p>
        </div>
        <UserTable adminUsers={adminUsers} staffUsers={staffUsers} />
      </div>
    </div>
  )
}
