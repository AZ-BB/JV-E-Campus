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
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminSidebar currentUser={user?.user_metadata} />

      {/* Main content */}
      <main className="transition-all duration-300 pl-4 pt-4 ease-in-out lg:ml-[var(--sidebar-width,16rem)]">
        <div className="lg:hidden h-16" /> {/* Spacer for mobile menu button */}
        {children}
      </main>
    </div>
  )
}
