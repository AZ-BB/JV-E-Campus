'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Home as HomeIcon, BookOpen, Store, FileText, UserCog, LifeBuoy, SearchIcon, Menu, X, Loader2, LogOutIcon } from 'lucide-react';
import { createSupabaseClient } from "@/utils/supabase-browser";
import Button from "../ui/button";

export default function StaffNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: Array<{ id: string; href?: string; Icon: React.ElementType }> = [
    { id: 'HOME', href: '/', Icon: HomeIcon },
    // TRAINING hub lives on staff home and module/career paths
    { id: 'TRAINING', href: '/', Icon: BookOpen },
    { id: 'PRODUCTS', href: '/products', Icon: Store },
    { id: 'RESOURCES', href: '/resources', Icon: FileText },
    { id: 'GUIDE', href: '/guide', Icon: UserCog },
    { id: 'HELP', Icon: LifeBuoy }
  ];

  // Derive active state from current route
  const activeId: string = (() => {
    if (!pathname) return 'TRAINING';
    if (pathname === '/') return 'HOME';
    if (pathname.startsWith('/career') || pathname.startsWith('/modules')) return 'TRAINING';
    if (pathname.startsWith('/products')) return 'PRODUCTS';
    if (pathname.startsWith('/resources')) return 'RESOURCES';
    if (pathname.startsWith('/guide')) return 'GUIDE';
    return 'TRAINING';
  })();

  return (
    <>
      {/* Top Navigation - RESPONSIVE VERSION */}
      <nav
        className="fixed top-0 left-0 w-full z-50 shadow-lg border-b border-green-600/20 px-4 md:px-12 py-3 backdrop-blur-sm"
        style={{
          background: 'linear-gradient(135deg, #01A252 0%, #029951 100%)',
          boxShadow: '0 10px 40px rgba(1, 162, 82, 0.15)'
        }}
      >
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button - ALWAYS VISIBLE ON MOBILE */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center text-white/90 hover:text-white rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <div className="flex items-center md:flex-none">
            <div className="h-12 w-28 rounded-xl flex items-center justify-center">
              <Image src="/logo.jpg" alt="logo" width={180} height={180} className="rounded-lg" />
            </div>
          </div>

          {/* Desktop Navigation Items - HIDDEN ON MOBILE */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const isActive = activeId === item.id;
              const baseClasses = `group flex flex-col items-center text-white/90 hover:text-white transition-all duration-300 px-4 py-2 rounded-xl relative overflow-hidden`;
              const activeStyles: React.CSSProperties | undefined = isActive
                ? {
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.1)'
                }
                : undefined;

              if (item.href) {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={baseClasses}
                    style={activeStyles}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.Icon className="w-5 h-5 mb-1 transform group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-xs font-medium uppercase tracking-wide">{item.id}</span>
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white rounded-full"></div>
                    )}
                  </Link>
                );
              }

              return (
                <button
                  key={item.id}
                  className={baseClasses}
                  style={activeStyles}
                >
                  <item.Icon className="w-5 h-5 mb-1 transform group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-xs font-medium uppercase tracking-wide">{item.id}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Desktop Search Button and Logout */}
          <div className="hidden md:flex items-center space-x-3">
            <button className="w-11 h-11 flex items-center justify-center text-white/90 hover:text-white rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <SearchIcon className="w-5 h-5" />
            </button>
            <Logout isMobile={false} />
          </div>

          {/* Mobile Logout Button (visible on mobile) */}
          <div className="md:hidden">
            <Logout isMobile={true} />
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-t border-green-600/20 shadow-xl">
            <div className="px-4 py-4 space-y-2">
              {/* Navigation Items */}
              {navItems.map((item) => {
                const isActive = activeId === item.id;
                const baseClasses = `w-full flex items-center space-x-3 text-gray-700 hover:text-green-600 transition-all duration-300 px-4 py-3 rounded-xl`;
                const activeClasses = isActive ? 'bg-green-50 text-green-600 border-l-4 border-green-600' : 'hover:bg-gray-50';

                if (item.href) {
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`${baseClasses} ${activeClasses}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.Icon className="w-5 h-5" />
                      <span className="font-medium">{item.id}</span>
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.id}
                    className={`${baseClasses} ${activeClasses}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.Icon className="w-5 h-5" />
                    <span className="font-medium">{item.id}</span>
                  </button>
                );
              })}

              {/* Mobile Search */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <button
                  className="w-full flex items-center space-x-3 text-gray-700 hover:text-green-600 transition-all duration-300 px-4 py-3 rounded-xl hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <SearchIcon className="w-5 h-5" />
                  <span className="font-medium">SEARCH</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}


const Logout = ({ isMobile }: { isMobile: boolean }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const logout = async () => {
    setLoading(true)
    const supabase = createSupabaseClient()
    await supabase.auth.signOut()
    router.push("/auth/sign-in")
    setLoading(false)
  }
  return (
    <Button onClick={logout} disabled={loading} className={`p-2 bg-admin-primary hover:bg-admin-primary/80 text-admin-text`}>
      {
        loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <LogOutIcon className="w-4 h-4" />
        )
      }
    </Button>
  )
}