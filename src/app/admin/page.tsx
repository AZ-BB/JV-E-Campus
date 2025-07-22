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
        <p className="text-gray-400">
          Overview of your campus management system
        </p>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Total Users</h3>
          <div className="text-2xl font-bold text-white">--</div>
          <p className="text-xs text-gray-500 mt-1">Admin & Staff combined</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Active Staff</h3>
          <div className="text-2xl font-bold text-white">--</div>
          <p className="text-xs text-gray-500 mt-1">Currently active</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-2">System Status</h3>
          <div className="text-2xl font-bold text-green-400">●</div>
          <p className="text-xs text-gray-500 mt-1">All systems operational</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Last Activity</h3>
          <div className="text-2xl font-bold text-white">--</div>
          <p className="text-xs text-gray-500 mt-1">Recent user activity</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
            <p className="text-sm text-gray-400">Latest system activities and user actions</p>
          </div>
          <div className="p-6">
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-4">📊</div>
              <p>Activity feed will appear here</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
            <p className="text-sm text-gray-400">Common administrative tasks</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="p-3 bg-gray-700 rounded-lg border-2 border-dashed border-gray-600">
                <div className="text-sm text-gray-400">Create New Staff</div>
              </div>
              <div className="p-3 bg-gray-700 rounded-lg border-2 border-dashed border-gray-600">
                <div className="text-sm text-gray-400">Manage Training Modules</div>
              </div>
              <div className="p-3 bg-gray-700 rounded-lg border-2 border-dashed border-gray-600">
                <div className="text-sm text-gray-400">Manage Prep Manuals</div>
              </div>
              <div className="p-3 bg-gray-700 rounded-lg border-2 border-dashed border-gray-600">
                <div className="text-sm text-gray-400">View Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Overview */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">System Overview</h2>
            <p className="text-sm text-gray-400">Campus management system status</p>
          </div>
          <div className="p-6">
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-4">⚙️</div>
              <p>System metrics will appear here</p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
            <p className="text-sm text-gray-400">Important system alerts and updates</p>
          </div>
          <div className="p-6">
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-4">🔔</div>
              <p>Notifications will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
