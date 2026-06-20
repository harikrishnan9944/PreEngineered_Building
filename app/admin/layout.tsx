import React from 'react';

export const metadata = {
  title: 'Admin Portal - Shree Nivi Buildtech',
  description: 'Administrative control center for managing website content and enquiries.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-portal bg-[#0f172a] min-h-screen text-slate-100 selection:bg-orange-500 selection:text-white">
      {children}
    </div>
  );
}
