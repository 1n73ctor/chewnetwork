'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';
import { Analytics } from '@/lib/analytics';
import NotificationBell from '@/components/NotificationBell';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { label: 'See It. Cook It.', href: '/see-it-cook-it' },
  { label: 'Chef Pepe', href: '/chef-pepe' },
  { label: 'Recipes', href: '/recipes' },
  { label: 'Community', href: '/community' },
  { label: 'Creators', href: '/creators' },
  { label: 'Restaurants', href: '/restaurants' },
  { label: 'About', href: '/about' },
];

// Pages where the mobile sticky "Ask Chef Pepe" bar should appear
const MARKETING_PATHS = ['/', '/chef-pepe', '/see-it-cook-it', '/recipes', '/community', '/creators', '/restaurants', '/about', '/creator-academy'];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();

  const showStickyBar = MARKETING_PATHS?.some(p => pathname === p || (p !== '/' && pathname?.startsWith(p + '?')));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'nav-solid' : 'nav-transparent'
        }`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="ChewNetwork home">
              <AppLogo size={36} />
              <span
                className={`font-extrabold text-lg tracking-tight transition-colors duration-300 ${
                  scrolled ? 'text-foreground' : 'text-white'
                }`}
              >
                ChewNetwork
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Primary navigation">
              {navLinks?.map((link) => (
                <Link
                  key={link?.href}
                  href={link?.href}
                  onClick={() => Analytics?.navLinkClick(link?.label)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10 ${
                    scrolled ? 'text-foreground hover:bg-muted' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {link?.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {user && <NotificationBell scrolled={scrolled} />}
              <Link
                href="/login"
                onClick={() => Analytics?.signInClick('header')}
                className={`text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 ${
                  scrolled ? 'text-foreground hover:bg-muted' : 'text-white/90 hover:bg-white/10'
                }`}
              >
                Sign In
              </Link>
              <Link
                href="/join"
                onClick={() => Analytics?.joinChewClick('header')}
                className="btn-primary text-sm px-5 py-2.5"
              >
                Join Chew
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                scrolled ? 'text-foreground' : 'text-white'
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <Icon name={mobileOpen ? 'XMarkIcon' : 'Bars3Icon'} size={24} />
            </button>
          </div>
        </div>
      </header>
      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/95 backdrop-blur-xl lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col h-full pt-20 px-6 pb-8">
            <nav className="flex flex-col gap-1 flex-1" aria-label="Mobile navigation">
              {navLinks?.map((link) => (
                <Link
                  key={link?.href}
                  href={link?.href}
                  onClick={() => { setMobileOpen(false); Analytics?.navLinkClick(link?.label); }}
                  className="text-white/90 hover:text-white text-xl font-semibold py-3 border-b border-white/10 transition-colors"
                >
                  {link?.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-3 mt-6">
              <Link
                href="/login"
                onClick={() => { setMobileOpen(false); Analytics?.signInClick('mobile_menu'); }}
                className="btn-secondary w-full justify-center border-white/30 text-white hover:bg-white hover:text-foreground"
              >
                Sign In
              </Link>
              <Link
                href="/join"
                onClick={() => { setMobileOpen(false); Analytics?.joinChewClick('mobile_menu'); }}
                className="btn-primary w-full justify-center"
              >
                Join Chew
              </Link>
            </div>
          </div>
        </div>
      )}
      {/* Mobile sticky bottom bar — only shown on marketing pages */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-border px-4 py-3 safe-area-bottom">
          <Link
            href="/chef-pepe"
            onClick={() => Analytics?.talkToChefPepe('mobile_sticky_bar')}
            className="btn-primary w-full justify-center text-sm"
          >
            <span>🍳</span>
            Ask Chef Pepe
          </Link>
        </div>
      )}
    </>
  );
}