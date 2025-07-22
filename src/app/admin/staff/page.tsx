import { getStaffStats, getStaffUsers } from "@/actions/users"
import StaffStats from "@/components/admin/staff/staff-stats"
import StaffTable from "@/components/admin/staff/staff-table"

export default async function StaffPage() {
  const staffUsers = await getStaffUsers()
  const staffStats = await getStaffStats()
  return (
    <div>
      <StaffStats staffStats={staffStats} />
      <StaffTable staffUsers={staffUsers} />
    </div>
  )
}
