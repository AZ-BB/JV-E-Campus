"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/cn'
import Logout from './logout'
import { 
  Users, 
  UserCheck, 
  Home, 
  Settings, 
  Menu, 
  X,
  ChevronLeft, 
  Building,
  Truck,
  Package,
  Book,
  ChefHat
} from 'lucide-react'
import { UserMetadata } from '@supabase/supabase-js'

const navigationItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: Home,
    description: 'Overview and analytics'
  },
  {
    href: '/admin/staff',
    label: 'Staff Management', 
    icon: UserCheck,
    description: 'Manage staff accounts'
  },
  {
    href: '/admin/training-modules',
    label: 'Training Modules',
    icon: Truck,
    description: 'Manage different training modules'
  },
  {
    href: '/admin/products',
    label: 'Products',
    icon: ChefHat,
    description: 'Manage different products'
  },
  {
    href: '/admin/prep-manual',
    label: 'Prep Manual',
    icon: Book,
    description: 'Manage different prep manuals'
  },
  {
    href: '/admin/branches',
    label: 'Branches',
    icon: Building,
    description: 'Manage branches'
  },
  {
    href: '/admin/roles',
    label: 'Roles Management',
    icon: Settings,
    description: 'Manage staff roles'
  },
  {
    href: '/admin/users',
    label: 'Admin Management',
    icon: Users,
    description: 'Manage admin users'
  }
]

export default function AdminSidebar({ currentUser }: { currentUser: UserMetadata | undefined }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const pathname = usePathname()

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const toggleCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed)

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--sidebar-width', isSidebarCollapsed ? '4rem' : '16rem')
  }, [isSidebarCollapsed])

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-admin_surface hover:bg-admin_border transition-colors"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full bg-admin_surface border-r border-admin_border z-40 transition-all duration-300 ease-in-out",
        // Mobile styles
        "lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        // Desktop responsive width
        isSidebarCollapsed ? "lg:w-16" : "lg:w-64",
        // Mobile width
        "w-64"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-admin_border">
            <div className="flex items-center justify-between">
              {!isSidebarCollapsed && (
                <h1 className="text-xl font-bold text-admin_text">Admin Panel</h1>
              )}
              {/* <button
                onClick={toggleCollapse}
                className="hidden lg:block p-1 rounded hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft 
                  size={16} 
                  className={cn(
                    "transition-transform duration-200",
                    isSidebarCollapsed && "rotate-180"
                  )}
                />
              </button> */}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || 
                             (item.href !== '/admin' && pathname.startsWith(item.href))
              
              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    "flex items-center my-1 px-3 py-2 rounded-md text-sm font-medium transition-colors group",
                    isActive 
                      ? "bg-admin_primary text-admin_text" 
                      : "text-admin_text-muted hover:bg-admin_border hover:text-admin_text",
                    isSidebarCollapsed && "justify-center"
                  )}>
                    <Icon size={20} className="flex-shrink-0" />
                    {!isSidebarCollapsed && (
                      <div className="ml-3">
                        <div className="font-medium">{item.label}</div>
                        <div className={`text-xs ${isActive ? "text-admin_text/80" : "text-admin_text-muted"} group-hover:text-admin_text/90`}>
                          {item.description}
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Footer with logout */}
          <div className="p-4 border-t border-admin_border">
            <div className={cn(
              "flex items-center",
              isSidebarCollapsed ? "justify-center" : "justify-between"
            )}>
              {!isSidebarCollapsed && (
                <div className="text-sm text-admin_text-muted">
                  {currentUser?.full_name}
                </div>
              )}
              <div className={cn(isSidebarCollapsed && "w-full flex justify-center")}>
                <Logout />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
} 