import { createSupabaseServerClient } from "@/utils/supabase-server"

export default async function AdminDashboard() {
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-admin-surface rounded-lg border border-admin-border">
          <div className="p-6 border-b border-admin-border">
            <h2 className="text-xl font-semibold text-admin-text">Recent Activity</h2>
            <p className="text-sm text-admin-text-muted">Latest system activities and user actions</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-admin-border/50">
                <div className="w-2 h-2 bg-admin-primary rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-admin-text">New staff member added</div>
                  <div className="text-xs text-admin-text-muted mt-1">Sarah Johnson joined as Training Coordinator • 5 minutes ago</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg bg-admin-border/50">
                <div className="w-2 h-2 bg-admin-success rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-admin-text">Training module completed</div>
                  <div className="text-xs text-admin-text-muted mt-1">12 staff members completed Safety Protocols • 15 minutes ago</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg bg-admin-border/50">
                <div className="w-2 h-2 bg-admin-accent rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-admin-text">System maintenance scheduled</div>
                  <div className="text-xs text-admin-text-muted mt-1">Database backup scheduled for tonight • 1 hour ago</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-700/50">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white">New branch created</div>
                  <div className="text-xs text-gray-400 mt-1">Downtown Campus branch added to system • 2 hours ago</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-700/50">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white">Role permissions updated</div>
                  <div className="text-xs text-gray-400 mt-1">Manager role permissions modified by Admin • 3 hours ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-admin-surface rounded-lg border border-admin-border">
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
