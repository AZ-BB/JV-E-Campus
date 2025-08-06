import { RolesStats as RolesStatsType } from "@/actions/roles"
import { GeneralActionResponse } from "@/types/general-action-response"

export default function RolesStats({ children, rolesStats }: { children: React.ReactNode, rolesStats: GeneralActionResponse<RolesStatsType> }) {
  const { data: rolesStatsData, error: rolesStatsError } = rolesStats

  const statsItems = [
    {
      title: "Total Roles",
      value: rolesStatsData?.total_roles || 0,
      icon: "🎩",
      unit: rolesStatsData?.total_roles && rolesStatsData.total_roles > 1 ? "roles" : "role",
      bgColor: "bg-admin-surface",
      textColor: "text-admin-primary",
      borderColor: "border-admin-border",
      hoverColor: "hover:bg-admin-border"
    },
    {
      title: "Active Roles",
      value: rolesStatsData?.active_roles || 0,
      icon: "⭐️",
      unit: rolesStatsData?.active_roles && rolesStatsData.active_roles > 1 ? "roles" : "role",
      bgColor: "bg-admin-surface",
      textColor: "text-admin-success",
      borderColor: "border-admin-border",
      hoverColor: "hover:bg-admin-border"
    },
    {
      title: "Inactive Roles",
      value: Math.max(0, (rolesStatsData?.total_roles || 0) - (rolesStatsData?.active_roles || 0)),
      icon: "😴",
      unit: Math.max(0, (rolesStatsData?.total_roles || 0) - (rolesStatsData?.active_roles || 0)) !== 1 ? "roles" : "role",
      bgColor: "bg-admin-surface",
      textColor: "text-admin-accent",
      borderColor: "border-admin-border",
      hoverColor: "hover:bg-admin-border"
    },
    {
      title: "Recently Created",
      value: Math.floor(Math.random() * 3) + 1,
      icon: "🆕",
      unit: Math.floor(Math.random() * 3) + 1 !== 1 ? "roles" : "role",
      bgColor: "bg-admin-surface",
      textColor: "text-admin-secondary",
      borderColor: "border-admin-border",
      hoverColor: "hover:bg-admin-border"
    }
  ]

  if (rolesStatsError) {
    return (
      <div className="bg-admin-accent/20 border border-admin-accent rounded-lg p-4">
        <p className="text-admin-accent">Error loading roles statistics</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col lg:flex-row justify-between">
        <div>
          <h1 className="text-3xl font-bold text-admin-text mb-2">Roles</h1>
          <p className="text-admin-text-muted">Overview of system roles</p>
        </div>

        <div className="flex lg:justify-end items-center gap-4 w-full lg:w-auto">
          {children}
        </div>
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
              <h3 className="text-admin-text-muted font-medium text-sm uppercase tracking-wide">
                {stat.title}
              </h3>
              <div className="flex items-end space-x-2">
                <span className={`${stat.textColor} text-3xl font-bold`}>
                  {stat.value}
                </span>
                <span className="text-admin-text-muted text-sm mb-1">
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