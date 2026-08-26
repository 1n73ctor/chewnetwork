'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/portal/AppLayout';
import { investorService, type HotlineSettings } from '@/lib/services/investorService';
import { PhoneIcon, ShieldCheckIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function InvestorHotlinePage() {
  const [hotline, setHotline] = useState<HotlineSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    investorService.getHotlineSettings().then((data) => {
      setHotline(data);
      setLoading(false);
    });
  }, []);

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-4">
        <div>
          <h1 className="text-white text-2xl font-bold">Investor Hotline</h1>
          <p className="text-muted-foreground text-sm mt-1">Private investor support line</p>
        </div>

        {/* Main card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-primary via-amber-400 to-primary" />
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <PhoneIcon className="w-8 h-8 text-primary" />
            </div>
            <p className="text-xs font-bold tracking-[0.3em] text-primary mb-2">PRIVATE INVESTOR HOTLINE</p>
            <h2 className="text-white text-3xl font-extrabold mb-1">
              {loading ? '...' : (hotline?.phoneNumber || '+1-800-CHEW-NET')}
            </h2>
            <div className="flex items-center justify-center gap-2 mb-6">
              <ClockIcon className="w-4 h-4 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">
                Hours: {loading ? '...' : (hotline?.hours || 'Mon–Fri, 9AM–6PM EST')}
              </p>
            </div>

            <a
              href={`tel:${hotline?.phoneNumber?.replace(/[^+\d]/g, '') || ''}`}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 rounded-xl text-base transition-all"
            >
              <PhoneIcon className="w-5 h-5" />
              Call Investor Support
            </a>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 flex items-start gap-3">
          <ShieldCheckIcon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-300 font-semibold text-sm mb-1">Confidentiality Notice</p>
            <p className="text-amber-300/80 text-sm leading-relaxed">
              This private number is provided exclusively to authorized Chew Network investors and partners. Do not publish, post, sell, distribute, or share this number publicly. Unauthorized distribution may result in account suspension.
            </p>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground font-semibold tracking-widest mb-2">WHAT TO EXPECT</p>
            <ul className="space-y-1.5">
              {['Dedicated investor support team', 'Account and ownership questions', 'Document requests', 'Certificate inquiries', 'General investor relations'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground font-semibold tracking-widest mb-2">BEFORE YOU CALL</p>
            <ul className="space-y-1.5">
              {['Have your Investor ID ready', 'Know your registered email', 'Prepare any relevant documents', 'Note your certificate number', 'Be in a private location'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
