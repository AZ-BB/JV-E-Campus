import RolesStats from "@/components/admin/roles/roles-stats"
import RolesTable from "@/components/admin/roles/roles-table"
import { getRolesStats, getRolesDetailed } from "@/actions/roles"

export default async function RolesPage() {
  const rolesStats = await getRolesStats()
  const roles = await getRolesDetailed()
  return <div>
    <RolesStats rolesStats={rolesStats} />
    <RolesTable roles={roles} />
  </div>
}
