import { RolesStats as RolesStatsTypes } from "@/actions/roles"
import { GeneralActionResponse } from "@/types/general-action-response"

export default function RolesStats({ rolesStats }: { rolesStats: GeneralActionResponse<RolesStatsTypes> }) {
  const { data: rolesStatsData, error: rolesStatsError } = rolesStats

  const statsItems = [
    {
      title: "Total Roles",
      value: rolesStatsData?.total_roles || 0,
      icon: "🎩",
      unit: rolesStatsData?.total_roles && rolesStatsData.total_roles > 1 ? "roles" : "role",
      bgColor: "bg-gray-800",
      textColor: "text-blue-400",
      borderColor: "border-gray-700",
      hoverColor: "hover:bg-gray-700"
    },
    {
      title: "Active Roles",
      value: rolesStatsData?.active_roles || 0,
      icon: "⭐️",
      unit: rolesStatsData?.active_roles && rolesStatsData.active_roles > 1 ? "roles" : "role",
      bgColor: "bg-gray-800",
      textColor: "text-green-400",
      borderColor: "border-gray-700",
      hoverColor: "hover:bg-gray-700"
    }
  ]

  if (rolesStatsError) {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
        <p className="text-red-400">Error loading roles statistics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Roles</h1>
        <p className="text-gray-400">Overview of system roles</p>
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