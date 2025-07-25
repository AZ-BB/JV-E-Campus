import BranchesStats from "@/components/admin/branches/branches-stats"
import BranchesTable from "@/components/admin/branches/branches-table"
import { Branch, getBranchesStats, getDetailedBranches } from "@/actions/branches"

export default async function BranchesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string,
    sort?: string,
    order?: string,
    page?: string,
    limit?: string,
  }>
}) {
  const {
    search = '',
    sort = 'createdAt',
    order = 'desc',
    page = '1',
    limit = '10',
  } = await searchParams

  const branchesStats = await getBranchesStats()
  const branches = await getDetailedBranches({
    page: Number(page || 1),
    limit: Number(limit || 10),
    search,
    orderBy: sort as keyof Branch,
    orderDirection: order as "asc" | "desc",
  })
  return <div>
    <BranchesStats branchesStats={branchesStats} />
    <div className="p-4 pt-0">
      <BranchesTable branches={branches} />
    </div>
  </div>
}
