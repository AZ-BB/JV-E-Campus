import RolesStats from "@/components/admin/roles/roles-stats"
import RolesTable from "@/components/admin/roles/roles-table"
import { getRolesStats, getRolesDetailed, Role } from "@/actions/roles"

export default async function RolesPage({
  searchParams,
}: {
  searchParams: {
    page: string
    limit: string
    search: string
    sort: string
    order: "asc" | "desc"
  }
}) {

  const {
    page = 1,
    limit = 10,
    search = "",
    order = "asc",
    sort = 'createdAt'
  } = await searchParams

  const roles = await getRolesDetailed({
    page: Number(page || 1),
    limit: Number(limit || 10),
    search,
    orderBy: sort as keyof Role,
    orderDirection: order as "asc" | "desc",
  })
  const rolesStats = await getRolesStats()
  return <div>
    <RolesStats rolesStats={rolesStats} />
    <div className="p-4 pt-0">
      <RolesTable roles={roles} />
    </div>
  </div>
}
