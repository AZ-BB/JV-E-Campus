'use client';
import { useState } from 'react';
import Logout from "@/components/logout";
import Image from 'next/image';

interface StaffNavbarProps {
  activeNav: string;
  onNavClick: (navId: string) => void;
}

export default function StaffNavbar({ activeNav, onNavClick }: StaffNavbarProps) {
  const navItems = [
    { id: 'HOME', icon: 'ri-home-line' },
    { id: 'TRAINING', icon: 'ri-book-open-line' },
    { id: 'PRODUCTS', icon: 'ri-store-2-line' },
    { id: 'RESOURCES', icon: 'ri-file-list-3-line' },
    { id: 'GUIDE', icon: 'ri-user-settings-line' },
    { id: 'HELP', icon: 'ri-error-warning-line' }
  ];

  return (
    <>
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 shadow-lg border-b border-green-600/20 px-12 py-3 backdrop-blur-sm" 
           style={{ 
             background: 'linear-gradient(135deg, #01A252 0%, #029951 100%)',
             boxShadow: '0 10px 40px rgba(1, 162, 82, 0.15)'
           }}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="h-12 w-28 rounded-xl flex items-center justify-center ">
              <Image src="/logo.jpg" alt="logo" width={180} height={180} className="rounded-lg" />
            </div>
          </div>
          
          {/* Navigation Items */}
          <div className="flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavClick(item.id)}
                className={`group flex flex-col items-center text-white/90 hover:text-white transition-all duration-300 px-4 py-2 rounded-xl relative overflow-hidden ${
                  activeNav === item.id ? 'active' : ''
                }`}
                style={{
                  ...(activeNav === item.id && {
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.1)'
                  })
                }}
              >
                <i className={`${item.icon} text-xl mb-1 transform group-hover:scale-110 transition-transform duration-300`}></i>
                <span className="text-xs font-medium uppercase tracking-wide">
                  {item.id}
                </span>
                {activeNav === item.id && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white rounded-full"></div>
                )}
              </button>
            ))}
          </div>
          
          {/* Search Button and Logout */}
          <div className="flex items-center space-x-3">
            <button className="w-11 h-11 flex items-center justify-center text-white/90 hover:text-white rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <i className="ri-search-line text-lg"></i>
            </button>
            <Logout />
          </div>
        </div>
      </nav>
    </>
  );
}