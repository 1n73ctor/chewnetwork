'use client';

import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { Analytics } from '@/lib/analytics';

const footerLinks = {
  explore: [
    { label: 'Recipes', href: '/recipes' },
    { label: 'Community', href: '/community' },
    { label: 'Restaurants', href: '/restaurants' },
    { label: 'Creators', href: '/creators' },
    { label: 'Challenges', href: '/community#challenges' },
  ],
  products: [
    { label: 'See It. Cook It.', href: '/see-it-cook-it' },
    { label: 'Chef Pepe', href: '/chef-pepe' },
    { label: 'Creator Academy', href: '/creator-academy' },
  ],
  forBusiness: [
    { label: 'Creator Tools', href: '/creators' },
    { label: 'Restaurant Partners', href: '/restaurants#partners' },
    { label: 'Partnerships', href: '/contact?topic=partnership' },
    { label: 'Advertise', href: '/contact?topic=partnership' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Accessibility', href: '/accessibility' },
    { label: 'Community Guidelines', href: '/community-guidelines' },
    { label: 'Report a Problem', href: '/contact?topic=report' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Use', href: '/terms' },
    { label: 'Cookie Settings', href: '/cookies' },
    { label: 'AI Disclosure', href: '/ai-disclosure' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-foreground text-white pt-16 pb-8 rounded-t-[3rem] lg:rounded-t-[4rem]" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Brand row */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-12 pb-12 border-b border-white/10">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-4">
              <AppLogo size={32} />
              <span className="font-extrabold text-lg text-white">ChewNetwork</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Chew Network is a food-technology company building tools and communities that help people discover food, learn to cook, share what they create, and build food brands.
            </p>
          </div>

          {/* Link groups */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-semibold">Explore</p>
              <ul className="space-y-2">
                {footerLinks?.explore?.map((l) => (
                  <li key={l?.href}>
                    <Link href={l?.href} onClick={() => Analytics?.footerLinkClick(l?.label)} className="text-white/70 hover:text-white text-sm transition-colors font-medium">
                      {l?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-semibold">Products</p>
              <ul className="space-y-2">
                {footerLinks?.products?.map((l) => (
                  <li key={l?.href}>
                    <Link href={l?.href} onClick={() => Analytics?.footerLinkClick(l?.label)} className="text-white/70 hover:text-white text-sm transition-colors font-medium">
                      {l?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-semibold">Business</p>
              <ul className="space-y-2">
                {footerLinks?.forBusiness?.map((l) => (
                  <li key={l?.href}>
                    <Link href={l?.href} onClick={() => Analytics?.footerLinkClick(l?.label)} className="text-white/70 hover:text-white text-sm transition-colors font-medium">
                      {l?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-semibold">Company</p>
              <ul className="space-y-2">
                {footerLinks?.company?.map((l) => (
                  <li key={l?.href}>
                    <Link href={l?.href} onClick={() => Analytics?.footerLinkClick(l?.label)} className="text-white/70 hover:text-white text-sm transition-colors font-medium">
                      {l?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-semibold">Support</p>
              <ul className="space-y-2">
                {footerLinks?.support?.map((l) => (
                  <li key={l?.href}>
                    <Link href={l?.href} onClick={() => Analytics?.footerLinkClick(l?.label)} className="text-white/70 hover:text-white text-sm transition-colors font-medium">
                      {l?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-semibold">Legal</p>
              <ul className="space-y-2">
                {footerLinks?.legal?.map((l) => (
                  <li key={l?.href}>
                    <Link href={l?.href} onClick={() => Analytics?.footerLinkClick(l?.label)} className="text-white/70 hover:text-white text-sm transition-colors font-medium">
                      {l?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">© 2026 Chew Network. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {[
              { label: 'Instagram', href: 'https://www.instagram.com/chewnetwork' },
              { label: 'TikTok', href: 'https://www.tiktok.com/@chewnetwork' },
              { label: 'YouTube', href: 'https://www.youtube.com/@chewnetwork' },
              { label: 'Pinterest', href: 'https://www.pinterest.com/chewnetwork' },
            ]?.map((social) => (
              <Link
                key={social?.label}
                href={social?.href}
                onClick={() => Analytics?.footerLinkClick(social?.label)}
                className="text-white/40 hover:text-white text-sm font-medium transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`ChewNetwork on ${social?.label}`}
              >
                {social?.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}