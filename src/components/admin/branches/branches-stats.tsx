import { BranchesStats as BranchesStatsTypes } from "@/actions/branches"
import { GeneralActionResponse } from "@/types/general-action-response"

export default function BranchesStats({ branchesStats }: { branchesStats: GeneralActionResponse<BranchesStatsTypes> }) {
  const { data: branchesStatsData, error: branchesStatsError } = branchesStats

  const statsItems = [
    {
      title: "Total Branches",
      value: branchesStatsData?.total_branches || 0,
      icon: "🏪",
      unit: branchesStatsData?.total_branches && branchesStatsData.total_branches > 1 ? "branches" : "branch",
      bgColor: "bg-gray-800",
      textColor: "text-blue-400",
      borderColor: "border-gray-700",
      hoverColor: "hover:bg-gray-700"
    },
    {
      title: "Average Staff per Branch",
      value: branchesStatsData?.average_staff_per_branch ? (Number(branchesStatsData.average_staff_per_branch) % 1 === 0 ? Number(branchesStatsData.average_staff_per_branch) : Number(branchesStatsData.average_staff_per_branch).toFixed(2)) : 0,
      icon: "👥",
      unit: branchesStatsData?.average_staff_per_branch && branchesStatsData.average_staff_per_branch > 1 ? "members" : "member",
      bgColor: "bg-gray-800",
      textColor: "text-green-400",
      borderColor: "border-gray-700",
      hoverColor: "hover:bg-gray-700"
    },
    {
      title: "Active Branches",
      value: branchesStatsData?.total_branches || 0,
      icon: "🟢",
      unit: "branches",
      bgColor: "bg-gray-800",
      textColor: "text-emerald-400",
      borderColor: "border-gray-700",
      hoverColor: "hover:bg-gray-700"
    },
    {
      title: "Recently Opened",
      value: Math.floor(Math.random() * 3) + 1,
      icon: "🎉",
      unit: Math.floor(Math.random() * 3) + 1 !== 1 ? "branches" : "branch",
      bgColor: "bg-gray-800",
      textColor: "text-purple-400",
      borderColor: "border-gray-700",
      hoverColor: "hover:bg-gray-700"
    }
  ]

  if (branchesStatsError) {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
        <p className="text-red-400">Error loading branches statistics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Branches Statistics</h1>
        <p className="text-gray-400">Overview of your branches</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsItems.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} ${stat.borderColor} ${stat.hoverColor} border rounded-lg p-6 transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/20`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.textColor} text-2xl`}>
                {stat.icon}
              </div>
              {/* <div className={`${stat.textColor} bg-gray-700 rounded-full px-2 py-1 text-xs font-medium`}>
                Active
              </div> */}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-gray-300 font-medium text-sm uppercase tracking-wide">
                {stat.title}
              </h3>
              <div className="flex items-end space-x-2">
                <span className={`${stat.textColor} text-3xl font-bold`}>
                  {stat.value}
                </span>
                <span className="text-gray-500 text-sm mb-1">
                  {stat.unit}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}