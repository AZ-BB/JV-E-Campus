'use client';
import { useState } from 'react';
import StaffNavbar from '@/components/staff/staff-navbar';

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeNav, setActiveNav] = useState('TRAINING');

  const handleNavClick = (navId: string) => {
    setActiveNav(navId);
  };

  return (
    <>
      {/* Remix Icon CSS */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.min.css" 
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50" style={{ fontFamily: 'Inter, sans-serif' }}>
        <StaffNavbar activeNav={activeNav} onNavClick={handleNavClick} />
        <div className="pt-20">
          {children}
        </div>
      </div>
    </>
  );
}