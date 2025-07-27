import { getStaffStats, getStaffUsers } from "@/actions/staff"
import StaffStats from "@/components/admin/staff/staff-stats"
import StaffTable from "@/components/admin/staff/staff-table"

export default async function StaffPage({
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
    limit = '10',
    roles = '',
    branchIds = '',
    createdByIds = '',
    nationality = ''
  } = await searchParams

  const staffUsers = await getStaffUsers(
    {
      page: Number(page),
      limit: Number(limit),
      search,
      orderBy: sort as any,
      orderDirection: order as any,
      filters: {
        staffRoleIds: roles ? roles.split(",").map(Number) : [],
        branchIds: branchIds ? branchIds.split(",").map(Number) : [],
        createdByIds: createdByIds ? createdByIds.split(",").map(Number) : [],
        nationality: nationality ? nationality.split(",") : []
      }
    })

  const staffStats = await getStaffStats()
  return (
    <div>
      <StaffStats staffStats={staffStats} />
      <div className="p-4 pt-0">
        <StaffTable staffUsers={staffUsers} />
      </div>
    </div>
  )
}
