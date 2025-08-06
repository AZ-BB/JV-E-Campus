import { createSupabaseServerClient } from "@/utils/supabase-server"
import { Suspense } from "react"
import LogsSection from "@/components/logs/logs-section"
import LogsSkeleton from "@/components/logs/logs-skeleton"
import { Activity } from "lucide-react"
import { getDashboardData } from "@/actions/dashboard"
import TimeAgo from "@/components/ui/time-ago"
import LogsTable from "@/components/logs/logs-table"

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    console.error(userError.message)
    return <div>Error: {userError.message}</div>
  }

  const { data: dashboardData, error: dashboardError } = await getDashboardData()

  if (dashboardError) {
    console.error(dashboardError)
    return <div>Error: {dashboardError}</div>
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header Section */}
      <div className="flex-shrink-0 mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">
          Welcome back, {user?.user_metadata?.full_name?.split(" ")[0] || 'Admin'}
        </h1>
        <p className="text-admin-text-muted text-sm lg:text-base">
          Overview of your campus management system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="flex-shrink-0 mb-4 sm:mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-admin-surface rounded-lg p-3 sm:p-4 lg:p-6 border border-admin-border">
            <h3 className="text-xs lg:text-sm font-medium text-admin-text-muted mb-1 sm:mb-2">Total Users</h3>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-admin-text">{dashboardData?.totalUsers}</div>
            <p className="text-xs text-admin-text-muted mt-1 hidden sm:block">Admin & Staff combined</p>
          </div>

          <div className="bg-admin-surface rounded-lg p-3 sm:p-4 lg:p-6 border border-admin-border">
            <h3 className="text-xs lg:text-sm font-medium text-admin-text-muted mb-1 sm:mb-2">Total Admins</h3>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-admin-text">{dashboardData?.totalAdmins}</div>
            <p className="text-xs text-admin-text-muted mt-1 hidden sm:block">Admin & Staff combined</p>
          </div>

          <div className="bg-admin-surface rounded-lg p-3 sm:p-4 lg:p-6 border border-admin-border">
            <h3 className="text-xs lg:text-sm font-medium text-admin-text-muted mb-1 sm:mb-2">Total Staff</h3>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-admin-text">{dashboardData?.totalStaff}</div>
            <p className="text-xs text-admin-text-muted mt-1 hidden sm:block">Admin & Staff combined</p>
          </div>

          <div className="bg-admin-surface rounded-lg p-3 sm:p-4 lg:p-6 border border-admin-border col-span-2 lg:col-span-1">
            <h3 className="text-xs lg:text-sm font-medium text-admin-text-muted mb-1 sm:mb-2">Last Activity</h3>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-admin-text">{dashboardData?.lastActivity ? <TimeAgo date={dashboardData?.lastActivity} /> : 'No activity'}</div>
            <p className="text-xs text-admin-text-muted mt-1 hidden sm:block">Recent user activity</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0">
        <div className="h-full grid grid-cols-1 xl:grid-cols-4 gap-4">

          <div className="xl:col-span-3 bg-admin-surface rounded-lg p-3 sm:p-4 lg:p-6 border border-admin-border min-h-0 overflow-auto">
            <div className="text-lg lg:text-xl font-semibold text-admin-text mb-3 sm:mb-4">
              Recent Activity
            </div>
            <div className="overflow-x-auto">
              <LogsTable
                logs={dashboardData?.recentLogs || []}
                currentPage={1}
                pageSize={10}
                totalCount={dashboardData?.recentLogs?.length || 0}
                numberOfPages={1}
                showActor={true}
                pagination={false}
                enableExpanding={false}
              />
            </div>
          </div>

          <div className="xl:col-span-1 bg-admin-surface rounded-lg border border-admin-border flex flex-col min-h-0">
            <div className="flex-shrink-0 p-4 lg:p-6 border-b border-admin-border">
              <h2 className="text-lg lg:text-xl font-semibold text-admin-text">Training Overview</h2>
              <p className="text-xs lg:text-sm text-admin-text-muted">System training metrics</p>
            </div>
            <div className="flex-1 p-4 lg:p-6 min-h-0 overflow-auto">
              <div className="space-y-4">
                {/* Staff Categories Distribution */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-admin-text">Staff Categories</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-admin-text-muted">Front of House (FOH)</span>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-admin-border rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <span className="text-xs text-admin-text">65%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-admin-text-muted">Back of House (BOH)</span>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-admin-border rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                        <span className="text-xs text-admin-text">25%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-admin-text-muted">Managers</span>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-admin-border rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: '10%' }}></div>
                        </div>
                        <span className="text-xs text-admin-text">10%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Training Progress Stats */}
                <div className="space-y-2 pt-2 border-t border-admin-border">
                  <h3 className="text-sm font-medium text-admin-text">Training Progress</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-admin-text-muted">Completed</span>
                      <span className="text-xs text-green-600 font-medium">73%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-admin-text-muted">In Progress</span>
                      <span className="text-xs text-yellow-600 font-medium">19%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-admin-text-muted">Not Started</span>
                      <span className="text-xs text-red-600 font-medium">8%</span>
                    </div>
                  </div>
                </div>

                {/* Module Levels */}
                <div className="space-y-2 pt-2 border-t border-admin-border">
                  <h3 className="text-sm font-medium text-admin-text">Module Levels</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="text-lg font-bold text-admin-text">12</div>
                      <div className="text-xs text-admin-text-muted">Beginner</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-admin-text">8</div>
                      <div className="text-xs text-admin-text-muted">Intermediate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-admin-text">5</div>
                      <div className="text-xs text-admin-text-muted">Expert</div>
                    </div>
                  </div>
                </div>

                {/* Content Types */}
                <div className="space-y-2 pt-2 border-t border-admin-border">
                  <h3 className="text-sm font-medium text-admin-text">Content Types</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-admin-text-muted">Video Lessons</span>
                      <span className="text-admin-text">156</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-admin-text-muted">Text Materials</span>
                      <span className="text-admin-text">89</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-admin-text-muted">Quizzes</span>
                      <span className="text-admin-text">43</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
