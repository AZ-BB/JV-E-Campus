import BranchesStats from "@/components/admin/branches/branches-stats"
import BranchesTable from "@/components/admin/branches/branches-table"
import { getBranchesStats, getDetailedBranches } from "@/actions/branches"

export default async function BranchesPage() {
  const branchesStats = await getBranchesStats()
  const branches = await getDetailedBranches()
  return <div>
    <BranchesStats branchesStats={branchesStats} />
    <div className="p-4 pt-0">
      <BranchesTable branches={branches} />
    </div>
  </div>
}
