import { StaffStats as StaffStatsType } from "@/actions/users"
import { GeneralActionResponse } from "@/types/general-action-response"

export default function StaffStats({ staffStats }: { staffStats: GeneralActionResponse<StaffStatsType> }) {
  const { data: staffStatsData, error: staffStatsError } = staffStats

  const statsItems = [
    {
      title: "Total Staff",
      value: staffStatsData?.staff_count || 0,
      icon: "👨‍🍳",
      unit: staffStatsData?.staff_count === 1 ? "person" : "people",
      bgColor: "bg-admin_surface",
      textColor: "text-admin_primary",
      borderColor: "border-admin_border",
      hoverColor: "hover:bg-admin_border"
    },
    {
      title: "Active Staff",
      value: Math.floor((staffStatsData?.staff_count || 0) * 0.85),
      icon: "✅",
      unit: "active",
      bgColor: "bg-admin_surface",
      textColor: "text-admin_success",
      borderColor: "border-admin_border",
      hoverColor: "hover:bg-admin_border"
    },
    {
      title: "New Hires",
      value: Math.floor((staffStatsData?.staff_count || 0) * 0.1),
      icon: "🆕",
      unit: "this month",
      bgColor: "bg-admin_surface",
      textColor: "text-admin_secondary",
      borderColor: "border-admin_border",
      hoverColor: "hover:bg-admin_border"
    },
    {
      title: "Avg Experience",
      value: 3.2,
      icon: "📊",
      unit: "years",
      bgColor: "bg-admin_surface",
      textColor: "text-admin_accent",
      borderColor: "border-admin_border",
      hoverColor: "hover:bg-admin_border"
    }
  ]

  if (staffStatsError) {
    return (
      <div className="bg-admin_accent/20 border border-admin_accent rounded-lg p-4">
        <p className="text-admin_accent">Error loading staff statistics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 px-4">
      <div>
        <h1 className="text-3xl font-bold text-admin_text mb-2">Staff Statistics</h1>
        <p className="text-admin_text-muted">Overview of your team composition</p>
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
              <div className={`${stat.textColor} bg-admin_border rounded-full px-2 py-1 text-xs font-medium`}>
                Active
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-admin_text-muted font-medium text-sm uppercase tracking-wide">
                {stat.title}
              </h3>
              <div className="flex items-end space-x-2">
                <span className={`${stat.textColor} text-3xl font-bold`}>
                  {stat.value}
                </span>
                <span className="text-admin_text-muted text-sm mb-1">
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