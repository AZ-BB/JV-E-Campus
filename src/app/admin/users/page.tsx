import { getAdmins, getUsersStats } from "@/actions/admins"
import UsersStats from "@/components/admin/users/admin-stats"
import AdminsTable from "@/components/admin/users/admins-table"

export default async function AdminsPage({
  searchParams
}: {
  searchParams: Promise<{
    search?: string,
    sort?: string,
    order?: string,
    page?: string,
    limit?: string,
    roles?: string,
    branchIds?: string,
    createdByIds?: string,
    nationality?: string
  }>
}) {
  const {
    search = '',
    sort = 'createdAt',
    order = 'desc',
    page = '1',
    limit = '10'
  } = await searchParams

  console.log(search, sort, order, page, limit)
  const admins = await getAdmins(
    {
      page: Number(page),
      limit: Number(limit),
      search,
      orderBy: sort as any,
      orderDirection: order as any,
    })

  const usersStats = await getUsersStats()
  return (
    <div>
      <UsersStats usersStats={usersStats} />
      <div className="p-4 pt-0">
        <AdminsTable admins={admins} />
      </div>
    </div>
  )
}
