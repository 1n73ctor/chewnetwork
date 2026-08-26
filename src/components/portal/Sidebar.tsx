'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import AppImage from '@/components/ui/AppImage';
import { useAuth } from '@/contexts/AuthContext';
import {
  HomeIcon,
  ChartPieIcon,
  DocumentTextIcon,
  GiftIcon,
  DocumentChartBarIcon,
  EnvelopeIcon,
  PhoneIcon,
  FolderIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  QuestionMarkCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { id: 'nav-dashboard', label: 'Dashboard', href: '/investor', icon: <HomeIcon className="w-5 h-5 flex-shrink-0" /> },
  { id: 'nav-stakes', label: 'My Ecosystem Stakes', href: '/investor/ecosystem-stakes', icon: <ChartPieIcon className="w-5 h-5 flex-shrink-0" /> },
  { id: 'nav-certificate', label: 'My Certificate', href: '/investor/certificate', icon: <DocumentTextIcon className="w-5 h-5 flex-shrink-0" /> },
  { id: 'nav-welcome', label: 'Welcome Kit', href: '/investor/welcome-kit', icon: <GiftIcon className="w-5 h-5 flex-shrink-0" /> },
  { id: 'nav-reports', label: 'Investor Reports', href: '/investor/reports', icon: <DocumentChartBarIcon className="w-5 h-5 flex-shrink-0" /> },
  { id: 'nav-messages', label: 'Messages & Updates', href: '/investor/updates', icon: <EnvelopeIcon className="w-5 h-5 flex-shrink-0" /> },
  { id: 'nav-hotline', label: 'Investor Hotline', href: '/investor/hotline', icon: <PhoneIcon className="w-5 h-5 flex-shrink-0" /> },
  { id: 'nav-documents', label: 'My Documents', href: '/investor/documents', icon: <FolderIcon className="w-5 h-5 flex-shrink-0" /> },
  { id: 'nav-beneficiary', label: 'Beneficiary Info', href: '/investor/beneficiary-info', icon: <UserGroupIcon className="w-5 h-5 flex-shrink-0" /> },
  { id: 'nav-build', label: 'Build With Chew', href: '/investor/build-with-chew', icon: <BuildingStorefrontIcon className="w-5 h-5 flex-shrink-0" /> },
  { id: 'nav-faqs', label: 'FAQs', href: '/investor/faqs', icon: <QuestionMarkCircleIcon className="w-5 h-5 flex-shrink-0" /> },
  { id: 'nav-settings', label: 'Settings', href: '/investor/settings', icon: <Cog6ToothIcon className="w-5 h-5 flex-shrink-0" /> },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, isAdmin } = useAuth();

  const isActive = (href: string) => {
    if (href === '/investor') return pathname === '/investor';
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
    router.refresh();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="px-4 pt-5 pb-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <AppLogo size={36} />
          <div>
            <div className="text-white font-extrabold text-sm tracking-widest leading-tight">CHEW</div>
            <div className="text-white font-extrabold text-sm tracking-widest leading-tight">NETWORK</div>
          </div>
        </div>
        <p className="text-primary text-xs font-medium pl-1 mt-1">See It. Cook It.</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide px-3 py-3 space-y-0.5">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={onMobileClose}
            className={`nav-item ${isActive(item.href) ? 'nav-item-active' : ''}`}
          >
            {item.icon}
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge && <span className="badge-orange">{item.badge}</span>}
          </Link>
        ))}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="nav-item w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-1"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
          <span className="flex-1 truncate">Log Out</span>
        </button>
      </nav>

      {/* Food image at bottom */}
      <div className="flex-shrink-0 mx-3 mb-3 rounded-xl overflow-hidden h-32 relative">
        <AppImage
          src="https://images.unsplash.com/photo-1632808664408-f8ab196b0523"
          alt="Spaghetti with tomato sauce and fresh basil garnish in a dark bowl"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col sidebar-width bg-card border-r border-border flex-shrink-0 fixed left-0 top-0 h-full z-30">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/70" onClick={onMobileClose} />
          <aside className="relative flex flex-col sidebar-width bg-card border-r border-border h-full z-50">
            <button onClick={onMobileClose} className="absolute top-4 right-3 text-muted-foreground hover:text-white">
              <XMarkIcon className="w-5 h-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}