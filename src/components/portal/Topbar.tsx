'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { BellIcon, ChevronDownIcon, Bars3Icon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

interface TopbarProps {
  onMobileMenuOpen: () => void;
}

const PAGE_TITLES: Record<string, string> = {
  '/investor': 'Dashboard',
  '/investor/ecosystem-stakes': 'My Ecosystem Stakes',
  '/investor/certificate': 'My Certificate',
  '/investor/welcome-kit': 'Welcome Kit',
  '/investor/reports': 'Investor Reports',
  '/investor/updates': 'Messages & Updates',
  '/investor/hotline': 'Investor Hotline',
  '/investor/documents': 'My Documents',
  '/investor/beneficiary-info': 'Beneficiary Info',
  '/investor/build-with-chew': 'Build With Chew',
  '/investor/faqs': 'FAQs',
  '/investor/settings': 'Settings',
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  for (const key of Object.keys(PAGE_TITLES)) {
    if (key !== '/investor' && pathname.startsWith(key)) return PAGE_TITLES[key];
  }
  return 'Chew Network';
}

function getUserInitials(name: string | null | undefined, email: string | null | undefined): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return 'IN';
}

/**
 * The first name on its own, from the best source available.
 *
 * Admins have no `investors` row and often no full_name in their metadata, so
 * without the email fallback below they used to show the whole address here.
 * Rather than print an address, the local part is tidied into something
 * name-shaped: "john.doe42@x.com" -> "John".
 */
function getFirstName(name: string | null | undefined, email: string | null | undefined): string {
  if (name && name.trim()) return name.trim().split(/\s+/)[0];
  if (email) {
    const local = email.split('@')[0].replace(/[._+-]+/g, ' ').replace(/\d+/g, '').trim();
    const first = local.split(/\s+/)[0];
    if (first) return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
  }
  return 'Account';
}

export default function Topbar({ onMobileMenuOpen }: TopbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, investorProfile, signOut } = useAuth();

  const meta = user?.user_metadata ?? {};
  const metaName = meta.full_name ?? meta.name ?? [meta.first_name, meta.last_name].filter(Boolean).join(' ') ?? null;
  const fullName = investorProfile
    ? `${investorProfile.firstName ?? ''} ${investorProfile.lastName ?? ''}`.trim()
    : (metaName || null);
  const email = user?.email ?? null;
  const initials = getUserInitials(fullName, email);
  // The chip shows the first name only — never the email address.
  const displayName = getFirstName(investorProfile?.firstName || fullName, email);
  const pageTitle = getPageTitle(pathname);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-border bg-card flex-shrink-0">
      {/* Left: hamburger (mobile) + page title (desktop) */}
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden text-muted-foreground hover:text-white transition-colors p-1"
          onClick={onMobileMenuOpen}
          aria-label="Open menu"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
        <h1 className="text-white font-semibold text-base leading-tight hidden lg:block">
          {pageTitle}
        </h1>
        {/* Mobile: show page title centered */}
        <h1 className="text-white font-semibold text-sm leading-tight lg:hidden">
          {pageTitle}
        </h1>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Notifications">
          <BellIcon className="w-5 h-5 text-muted-foreground" />
          <span className="badge-orange absolute -top-0.5 -right-0.5">3</span>
        </button>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {initials}
            </div>
            <span className="text-sm font-medium text-white hidden sm:block max-w-[120px] truncate">
              {displayName}
            </span>
            <ChevronDownIcon className={`w-4 h-4 text-muted-foreground transition-transform duration-150 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-52 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden py-1">
              {/* User info header */}
              <div className="px-4 py-3 border-b border-border">
                <p className="text-white text-sm font-semibold truncate">{displayName}</p>
                {email && <p className="text-muted-foreground text-xs truncate mt-0.5">{email}</p>}
              </div>

              {/* Menu items */}
              <button
                onClick={() => { setDropdownOpen(false); router.push('/investor/settings'); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-white hover:bg-muted transition-colors text-left"
              >
                <Cog6ToothIcon className="w-4 h-4 flex-shrink-0" />
                Settings
              </button>

              <div className="border-t border-border mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 flex-shrink-0" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}