import { createSupabaseServerClient } from "@/utils/supabase-server"
import { Suspense } from "react"
import LogsSection from "@/components/logs/logs-section"
import LogsSkeleton from "@/components/logs/logs-skeleton"
import { Activity } from "lucide-react"

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Await searchParams for Next.js compatibility
  const resolvedSearchParams = await searchParams;
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.user_metadata?.full_name?.split(" ")[0] || 'Admin'}
        </h1>
        <p className="text-admin-text-muted">
          Overview of your campus management system
        </p>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-admin-surface rounded-lg p-6 border border-admin-border">
          <h3 className="text-sm font-medium text-admin-text-muted mb-2">Total Users</h3>
          <div className="text-2xl font-bold text-admin-text">247</div>
          <p className="text-xs text-admin-text-muted mt-1">Admin & Staff combined</p>
        </div>

        <div className="bg-admin-surface rounded-lg p-6 border border-admin-border">
          <h3 className="text-sm font-medium text-admin-text-muted mb-2">Active Staff</h3>
          <div className="text-2xl font-bold text-admin-text">189</div>
          <p className="text-xs text-admin-text-muted mt-1">Currently active</p>
        </div>

        <div className="bg-admin-surface rounded-lg p-6 border border-admin-border">
          <h3 className="text-sm font-medium text-admin-text-muted mb-2">System Status</h3>
          <div className="text-2xl font-bold text-admin-success">●</div>
          <p className="text-xs text-admin-text-muted mt-1">All systems operational</p>
        </div>

        <div className="bg-admin-surface rounded-lg p-6 border border-admin-border">
          <h3 className="text-sm font-medium text-admin-text-muted mb-2">Last Activity</h3>
          <div className="text-2xl font-bold text-admin-text">2 min</div>
          <p className="text-xs text-admin-text-muted mt-1">Recent user activity</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex lg:grid-cols-3 gap-6 mb-8">

        <div className="w-3/4">
                     {/* Recent Activity Section */}
           <div className="">
             <Suspense fallback={<LogsSkeleton showActor={true} title="Recent Activity" rowCount={10} />}>
               <LogsSection 
                 title="Recent Activity"
                 icon={<Activity className="w-5 h-5" />}
                 searchParams={resolvedSearchParams}
                 searchPlaceholder="Search activity..."
               />
             </Suspense>
           </div>
        </div>

        {/* Quick Actions */}
        <div className="w-1/4 bg-admin-surface rounded-lg border border-admin-border">
          <div className="p-6 border-b border-admin-border">
            <h2 className="text-xl font-semibold text-admin-text">Quick Actions</h2>
            <p className="text-sm text-admin-text-muted">Common administrative tasks</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="p-3 bg-admin-border rounded-lg border-2 border-dashed border-admin-border hover:border-admin-primary cursor-pointer transition-colors">
                <div className="text-sm text-admin-text-muted">Create New Staff</div>
              </div>
              <div className="p-3 bg-admin-border rounded-lg border-2 border-dashed border-admin-border hover:border-admin-primary cursor-pointer transition-colors">
                <div className="text-sm text-admin-text-muted">Manage Training Modules</div>
              </div>
              <div className="p-3 bg-admin-border rounded-lg border-2 border-dashed border-admin-border hover:border-admin-primary cursor-pointer transition-colors">
                <div className="text-sm text-admin-text-muted">Manage Prep Manuals</div>
              </div>
              <div className="p-3 bg-admin-border rounded-lg border-2 border-dashed border-admin-border hover:border-admin-primary cursor-pointer transition-colors">
                <div className="text-sm text-admin-text-muted">View Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Overview */}
        <div className="bg-admin-surface rounded-lg border border-admin-border">
          <div className="p-6 border-b border-admin-border">
            <h2 className="text-xl font-semibold text-admin-text">System Overview</h2>
            <p className="text-sm text-admin-text-muted">Campus management system status</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-admin-border/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-admin-success rounded-full"></div>
                  <span className="text-sm text-admin-text">Database Status</span>
                </div>
                <span className="text-xs text-admin-success font-medium">Healthy</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-admin-border/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-admin-success rounded-full"></div>
                  <span className="text-sm text-admin-text">API Response Time</span>
                </div>
                <span className="text-xs text-admin-success font-medium">145ms</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-admin-border/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-admin-accent rounded-full"></div>
                  <span className="text-sm text-admin-text">Storage Usage</span>
                </div>
                <span className="text-xs text-admin-accent font-medium">68% Full</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-admin-border/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-admin-success rounded-full"></div>
                  <span className="text-sm text-admin-text">Active Sessions</span>
                </div>
                <span className="text-xs text-admin-success font-medium">23 Users</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-admin-surface rounded-lg border border-admin-border">
          <div className="p-6 border-b border-admin-border">
            <h2 className="text-xl font-semibold text-admin-text">Notifications</h2>
            <p className="text-sm text-admin-text-muted">Important system alerts and updates</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="p-3 bg-admin-primary/20 border border-admin-primary/50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="text-admin-primary text-lg">ℹ️</div>
                  <div className="flex-1">
                    <div className="text-sm text-admin-text font-medium">System Update Available</div>
                    <div className="text-xs text-admin-text-muted mt-1">New features and security improvements ready for installation</div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-admin-success/20 border border-admin-success/50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="text-admin-success text-lg">✅</div>
                  <div className="flex-1">
                    <div className="text-sm text-admin-text font-medium">Backup Completed</div>
                    <div className="text-xs text-admin-text-muted mt-1">Daily system backup completed successfully</div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-admin-accent/20 border border-admin-accent/50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="text-admin-accent text-lg">⚠️</div>
                  <div className="flex-1">
                    <div className="text-sm text-admin-text font-medium">Storage Warning</div>
                    <div className="text-xs text-admin-text-muted mt-1">System storage is approaching 70% capacity</div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-admin-secondary/20 border border-admin-secondary/50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="text-admin-secondary text-lg">🎉</div>
                  <div className="flex-1">
                    <div className="text-sm text-admin-text font-medium">Milestone Reached</div>
                    <div className="text-xs text-admin-text-muted mt-1">200+ staff members have completed safety training</div>
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
