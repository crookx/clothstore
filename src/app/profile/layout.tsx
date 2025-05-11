'use client';

import { useAuth } from '@/context/auth-context';
import { Sidebar } from '@/components/profile/Sidebar';
import { redirect } from 'next/navigation';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}