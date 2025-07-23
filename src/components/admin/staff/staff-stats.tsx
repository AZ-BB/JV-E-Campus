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
      bgColor: "bg-gray-800",
      textColor: "text-blue-400",
      borderColor: "border-gray-700",
      hoverColor: "hover:bg-gray-700"
    },
    {
      title: "Active Staff",
      value: Math.floor((staffStatsData?.staff_count || 0) * 0.85),
      icon: "✅",
      unit: "active",
      bgColor: "bg-gray-800",
      textColor: "text-green-400",
      borderColor: "border-gray-700",
      hoverColor: "hover:bg-gray-700"
    },
    {
      title: "New Hires",
      value: Math.floor((staffStatsData?.staff_count || 0) * 0.1),
      icon: "🆕",
      unit: "this month",
      bgColor: "bg-gray-800",
      textColor: "text-purple-400",
      borderColor: "border-gray-700",
      hoverColor: "hover:bg-gray-700"
    },
    {
      title: "Avg Experience",
      value: 3.2,
      icon: "📊",
      unit: "years",
      bgColor: "bg-gray-800",
      textColor: "text-pink-400",
      borderColor: "border-gray-700",
      hoverColor: "hover:bg-gray-700"
    }
  ]

  if (staffStatsError) {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
        <p className="text-red-400">Error loading staff statistics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 px-4">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Staff Statistics</h1>
        <p className="text-gray-400">Overview of your team composition</p>
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
              <div className={`${stat.textColor} bg-gray-700 rounded-full px-2 py-1 text-xs font-medium`}>
                Active
              </div>
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