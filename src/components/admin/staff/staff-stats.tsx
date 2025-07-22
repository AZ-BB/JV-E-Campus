import { StaffStats as StaffStatsType } from "@/actions/users"
import { GeneralActionResponse } from "@/types/general-action-response"

export default function StaffStats({ staffStats }: { staffStats: GeneralActionResponse<StaffStatsType> }) {
  const { data: staffStatsData, error: staffStatsError } = staffStats

  const statsItems = [
    {
      title: "Total Staff",
      value: staffStatsData?.total_staff || 0,
      icon: "👥",
      bgColor: "bg-gray-800",
      textColor: "text-blue-400",
      borderColor: "border-gray-700",
      hoverColor: "hover:bg-gray-700"
    },
    {
      title: "Front of House",
      value: staffStatsData?.total_foh || 0,
      icon: "🏪",
      bgColor: "bg-gray-800",
      textColor: "text-green-400",
      borderColor: "border-gray-700",
      hoverColor: "hover:bg-gray-700"
    },
    {
      title: "Back of House",
      value: staffStatsData?.total_boh || 0,
      icon: "👨‍🍳",
      bgColor: "bg-gray-800",
      textColor: "text-orange-400",
      borderColor: "border-gray-700",
      hoverColor: "hover:bg-gray-700"
    },
    {
      title: "Managers",
      value: staffStatsData?.total_manager || 0,
      icon: "👔",
      bgColor: "bg-gray-800",
      textColor: "text-purple-400",
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
    <div className="space-y-6 p-6">
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
                  {stat.value === 1 ? 'person' : 'people'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Card */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Team Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <p className="text-gray-400">FOH Ratio</p>
            <p className="font-semibold text-white">
              {staffStatsData?.total_staff ? 
                Math.round((staffStatsData.total_foh / staffStatsData.total_staff) * 100) : 0}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400">BOH Ratio</p>
            <p className="font-semibold text-white">
              {staffStatsData?.total_staff ? 
                Math.round((staffStatsData.total_boh / staffStatsData.total_staff) * 100) : 0}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400">Management</p>
            <p className="font-semibold text-white">
              {staffStatsData?.total_staff ? 
                Math.round((staffStatsData.total_manager / staffStatsData.total_staff) * 100) : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}