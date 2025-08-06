"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/cn'
import Logout from '@/components/logout'
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
  ChefHat,
  Activity,
  BookCopy,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { UserMetadata } from '@supabase/supabase-js'
import ThemeSwitch from '../theme-switch'

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
  },
  {
    href: '/admin/logs',
    label: 'Logs',
    icon: Activity,
    description: 'View system logs'
  }
]

const trainingModulesItems = [
  {
    href: '/admin/modules',
    label: 'Modules',
    description: 'Manage training modules'
  },
  {
    href: '/admin/careers',
    label: 'Careers',
    description: 'Explore career paths'
  }
]

export default function AdminSidebar({ currentUser }: { currentUser: UserMetadata | undefined }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isTrainingModulesExpanded, setIsTrainingModulesExpanded] = useState(true)
  const pathname = usePathname()

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const toggleCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed)
  const toggleTrainingModules = () => setIsTrainingModulesExpanded(!isTrainingModulesExpanded)

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--sidebar-width', isSidebarCollapsed ? '4rem' : '16rem')
  }, [isSidebarCollapsed])

  // Check if user is currently on a training modules page
  const isOnTrainingModulesPage = pathname.startsWith('/admin/modules') || pathname.startsWith('/admin/careers')

  // Auto-expand Training Modules section when user is on one of its pages
  useEffect(() => {
    if (isOnTrainingModulesPage && !isTrainingModulesExpanded) {
      setIsTrainingModulesExpanded(true)
    }
  }, [pathname, isTrainingModulesExpanded, isOnTrainingModulesPage])

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-admin-surface hover:bg-admin-border transition-colors"
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
        "fixed left-0 top-0 h-full bg-admin-surface border-r border-admin-border z-40 transition-all duration-300 ease-in-out",
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
          <div className="p-4 border-b border-admin-border">
            <div className="flex items-center justify-between">
              {!isSidebarCollapsed ? (
                <div className="flex items-center justify-between gap-2 w-full">
                  <h1 className="text-xl font-bold text-admin-text">Admin Panel</h1>
                  <ThemeSwitch />
                </div>
              ) : (
                <div className="flex justify-center w-full">
                  <ThemeSwitch />
                </div>
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
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item, index) => {
              const Icon = item.icon
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href))

              return (
                <React.Fragment key={item.href}>
                  <Link href={item.href}>
                    <div className={cn(
                      "flex items-center my-1 px-3 py-2 rounded-md text-sm font-medium transition-colors group",
                      isActive
                        ? "bg-admin-primary text-white"
                        : "text-admin-text-muted hover:bg-admin-border hover:text-admin-text",
                      isSidebarCollapsed && "justify-center"
                    )}>
                      <Icon size={20} className="flex-shrink-0" />
                      {!isSidebarCollapsed && (
                        <div className="ml-3">
                          <div className="font-medium">{item.label}</div>
                          <div className={`text-xs ${isActive ? "text-white" : "text-admin-text-muted"} group-hover:text-admin-text`}>
                            {item.description}
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Training Modules Section - appears after Staff Management */}
                  {item.label === 'Staff Management' && (
                    <div className="mt-2 mb-2">
                      {/* Training Modules Header */}
                      <button 
                        onClick={isOnTrainingModulesPage ? undefined : toggleTrainingModules}
                        disabled={isOnTrainingModulesPage}
                        className={cn(
                          "w-full flex items-center px-3 py-2 text-sm font-medium text-admin-text transition-colors rounded-md",
                          isOnTrainingModulesPage 
                            ? "cursor-default" 
                            : "hover:bg-admin-border cursor-pointer",
                          isSidebarCollapsed && "justify-center"
                        )}
                      >
                        <BookCopy size={20} className="flex-shrink-0" />
                        {!isSidebarCollapsed && (
                          <>
                            <div className="ml-3 flex-1 text-left">
                              <div className="font-medium">Training Modules</div>
                              <div className="text-xs text-admin-text-muted">
                                Learning and development
                              </div>
                            </div>
                            <div className="ml-2">
                              {!isOnTrainingModulesPage && (
                                <>
                                  {isTrainingModulesExpanded ? (
                                    <ChevronDown size={16} className="text-admin-text-muted" />
                                  ) : (
                                    <ChevronRight size={16} className="text-admin-text-muted" />
                                  )}
                                </>
                              )}
                            </div>
                          </>
                        )}
                      </button>

                      {/* Training Modules Sub-items */}
                      {!isSidebarCollapsed && isTrainingModulesExpanded && (
                        <div className="ml-2 space-y-1">
                          {trainingModulesItems.map((subItem) => {
                            const isSubActive = pathname === subItem.href ||
                              (subItem.href !== '/admin' && pathname.startsWith(subItem.href))

                            return (
                              <Link key={subItem.href} href={subItem.href}>
                                <div className={cn(
                                  "flex items-center my-1 px-2 py-2 rounded-md text-sm font-medium transition-colors group",
                                  isSubActive
                                    ? "bg-admin-primary text-white"
                                    : "text-admin-text-muted hover:bg-admin-border hover:text-admin-text"
                                )}>
                                  <div className="w-5 h-5 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                                  </div>
                                  <div className="ml-3">
                                    <div className="font-medium">{subItem.label}</div>
                                    <div className={`text-xs ${isSubActive ? "text-white" : "text-admin-text-muted"} group-hover:text-admin-text`}>
                                      {subItem.description}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </React.Fragment>
              )
            })}
          </nav>

          {/* Footer with logout */}
          <div className="p-4 border-t border-admin-border">
            <div className={cn(
              "flex items-center",
              isSidebarCollapsed ? "justify-center" : "justify-between"
            )}>
              {!isSidebarCollapsed && (
                <div className="text-sm text-admin-text-muted">
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