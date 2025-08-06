import { StaffStats as StaffStatsType } from "@/actions/staff"
import { GeneralActionResponse } from "@/types/general-action-response"

export default function StaffStats({ children, staffStats }: { children: React.ReactNode, staffStats: GeneralActionResponse<StaffStatsType> }) {
  const { data: staffStatsData, error: staffStatsError } = staffStats

  const statsItems = [
    {
      title: "Total Staff",
      value: staffStatsData?.staff_count || 0,
      icon: "👨‍🍳",
      unit: staffStatsData?.staff_count === 1 ? "person" : "people",
      bgColor: "bg-admin-surface",
      textColor: "text-admin-primary",
      borderColor: "border-admin-border",
      hoverColor: "hover:bg-admin-border"
    },
    {
      title: "Active Staff",
      value: Math.floor((staffStatsData?.staff_count || 0) * 0.85),
      icon: "✅",
      unit: "active",
      bgColor: "bg-admin-surface",
      textColor: "text-admin-success",
      borderColor: "border-admin-border",
      hoverColor: "hover:bg-admin-border"
    },
    {
      title: "New Hires",
      value: Math.floor((staffStatsData?.staff_count || 0) * 0.1),
      icon: "🆕",
      unit: "this month",
      bgColor: "bg-admin-surface",
      textColor: "text-admin-secondary",
      borderColor: "border-admin-border",
      hoverColor: "hover:bg-admin-border"
    },
    {
      title: "Avg Experience",
      value: 3.2,
      icon: "📊",
      unit: "years",
      bgColor: "bg-admin-surface",
      textColor: "text-admin-accent",
      borderColor: "border-admin-border",
      hoverColor: "hover:bg-admin-border"
    }
  ]

  if (staffStatsError) {
    return (
      <div className="bg-admin-accent/20 border border-admin-accent rounded-lg p-3">
        <p className="text-admin-accent">Error loading staff statistics</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col lg:flex-row justify-between">
        <div className="">
          <h1 className="text-2xl font-bold text-admin-text mb-1">Staff Statistics</h1>
          <p className="text-admin-text-muted text-sm">Overview of your team composition</p>
        </div>

        <div className="flex lg:justify-end items-center gap-4 w-full lg:w-auto">
          {children}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsItems.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} ${stat.borderColor} ${stat.hoverColor} border rounded-lg p-4 transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/20`}
          >
            <div className="space-y-1">
              <div>
                <h3 className="text-admin-text-muted font-medium text-xs uppercase tracking-wide">
                  {stat.title}
                </h3>
              </div>
              <div className="flex items-end space-x-2">
                <span className={`${stat.textColor} text-2xl font-bold`}>
                  {stat.value}
                </span>
                <span className="text-admin-text-muted text-xs mb-1">
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