import React from "react"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { createSupabaseServerClient } from '@/utils/supabase-server';

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return (
    <div className="h-screen bg-admin-background text-admin-text flex flex-col">
      <AdminSidebar currentUser={user?.user_metadata} />

      {/* Main content */}
      <main className="flex-1 min-h-0 transition-all duration-300 ease-in-out lg:ml-[var(--sidebar-width,16rem)] bg-admin-bg">
        <div className="h-full flex flex-col">
          <div className="lg:hidden h-16 flex-shrink-0" /> {/* Spacer for mobile menu button */}
          <div className="flex-1 min-h-0 p-4">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
