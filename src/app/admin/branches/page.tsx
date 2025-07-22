import BranchesStats from "@/components/admin/branches/branches-stats"
import BranchesTable from "@/components/admin/branches/branches-table"
import { getBranches, getBranchesStats, getDetailedBranches } from "@/actions/branches"

export default async function BranchesPage() {
  const branchesStats = await getBranchesStats()
  const branches = await getDetailedBranches()
  return <div>
    <BranchesStats branchesStats={branchesStats} />
    <BranchesTable branches={branches} />
  </div>
}
