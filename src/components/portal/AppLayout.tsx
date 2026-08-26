'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'sonner';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme } = useTheme();
  const { user, loading } = useAuth();
  const router = useRouter();

  // The portal sits alongside the public site, so anonymous visitors who land
  // here are sent to the shared login rather than shown an empty shell.
  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main area — offset by sidebar width on desktop */}
      <div className="flex flex-col flex-1 min-w-0 lg:ml-[220px]">
        <Topbar onMobileMenuOpen={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          {children}
        </main>
      </div>

      {/* Portal-scoped toasts (the public site does not mount sonner). */}
      <Toaster position="top-right" theme={theme} />
    </div>
  );
}