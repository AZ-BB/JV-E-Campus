import StaffNavbar from '@/components/staff/staff-navbar';

import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={poppins.className}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
        <StaffNavbar />
        <div className="">
          {children}
        </div>
      </div>
    </div>
  );
}