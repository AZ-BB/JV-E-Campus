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
      <div className="flex-shrink-0 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-admin-surface rounded-lg p-4 lg:p-6 border border-admin-border">
            <h3 className="text-xs lg:text-sm font-medium text-admin-text-muted mb-2">Total Users</h3>
            <div className="text-xl lg:text-2xl font-bold text-admin-text">{dashboardData?.totalUsers}</div>
            <p className="text-xs text-admin-text-muted mt-1">Admin & Staff combined</p>
          </div>

          <div className="bg-admin-surface rounded-lg p-4 lg:p-6 border border-admin-border">
            <h3 className="text-xs lg:text-sm font-medium text-admin-text-muted mb-2">Total Admins</h3>
            <div className="text-xl lg:text-2xl font-bold text-admin-text">{dashboardData?.totalAdmins}</div>
            <p className="text-xs text-admin-text-muted mt-1">Admin & Staff combined</p>
          </div>

          <div className="bg-admin-surface rounded-lg p-4 lg:p-6 border border-admin-border">
            <h3 className="text-xs lg:text-sm font-medium text-admin-text-muted mb-2">Total Staff</h3>
            <div className="text-xl lg:text-2xl font-bold text-admin-text">{dashboardData?.totalStaff}</div>
            <p className="text-xs text-admin-text-muted mt-1">Admin & Staff combined</p>
          </div>

          <div className="bg-admin-surface rounded-lg p-4 lg:p-6 border border-admin-border">
            <h3 className="text-xs lg:text-sm font-medium text-admin-text-muted mb-2">Last Activity</h3>
            <div className="text-xl lg:text-2xl font-bold text-admin-text">{dashboardData?.lastActivity ? <TimeAgo date={dashboardData?.lastActivity} /> : 'No activity'}</div>
            <p className="text-xs text-admin-text-muted mt-1">Recent user activity</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0">
        <div className="h-full grid grid-cols-1 lg:grid-cols-4 gap-4">

          <div className="lg:col-span-3 bg-admin-surface rounded-lg p-4 lg:p-6 border border-admin-border min-h-0 overflow-auto">
            <div className="text-lg lg:text-xl font-semibold text-admin-text mb-2">
              Recent Activity
            </div>
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

          <div className="lg:col-span-1 bg-admin-surface rounded-lg border border-admin-border flex flex-col min-h-0">
            <div className="flex-shrink-0 p-4 lg:p-6 border-b border-admin-border">
              <h2 className="text-lg lg:text-xl font-semibold text-admin-text">Quick Actions</h2>
              <p className="text-xs lg:text-sm text-admin-text-muted">Common administrative tasks</p>
            </div>
            <div className="flex-1 p-4 lg:p-6 min-h-0">
              <div className="space-y-3">
                <div className="p-3 bg-admin-border rounded-lg border-2 border-dashed border-admin-border hover:border-admin-primary cursor-pointer transition-colors">
                  <div className="text-xs lg:text-sm text-admin-text-muted">Create New Staff</div>
                </div>
                <div className="p-3 bg-admin-border rounded-lg border-2 border-dashed border-admin-border hover:border-admin-primary cursor-pointer transition-colors">
                  <div className="text-xs lg:text-sm text-admin-text-muted">Manage Training Modules</div>
                </div>
                <div className="p-3 bg-admin-border rounded-lg border-2 border-dashed border-admin-border hover:border-admin-primary cursor-pointer transition-colors">
                  <div className="text-xs lg:text-sm text-admin-text-muted">Manage Prep Manuals</div>
                </div>
                <div className="p-3 bg-admin-border rounded-lg border-2 border-dashed border-admin-border hover:border-admin-primary cursor-pointer transition-colors">
                  <div className="text-xs lg:text-sm text-admin-text-muted">View Progress</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
