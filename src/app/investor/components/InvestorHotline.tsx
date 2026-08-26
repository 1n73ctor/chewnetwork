'use client';

import React, { useEffect, useState } from 'react';
import { investorService, type HotlineSettings } from '@/lib/services/investorService';
import { PhoneIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function InvestorHotline() {
  const [hotline, setHotline] = useState<HotlineSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    investorService.getHotlineSettings().then((data) => {
      setHotline(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <PhoneIcon className="w-4 h-4 text-primary" />
        <h3 className="text-white font-bold text-sm">Private Investor Hotline</h3>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-border rounded w-3/4" />
          <div className="h-3 bg-border rounded w-1/2" />
        </div>
      ) : (
        <>
          <div className="bg-background/50 rounded-lg p-3 mb-3">
            <p className="text-xs text-muted-foreground mb-0.5">Investor Hotline</p>
            <p className="text-white font-bold text-lg">{hotline?.phoneNumber || '+1-800-CHEW-NET'}</p>
            <p className="text-xs text-muted-foreground mt-1">Hours: {hotline?.hours || 'Mon–Fri, 9AM–6PM EST'}</p>
          </div>

          <a
            href={`tel:${hotline?.phoneNumber?.replace(/[^+\d]/g, '') || ''}`}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-2.5 rounded-xl text-sm transition-all mb-3"
          >
            <PhoneIcon className="w-4 h-4" />
            Call Investor Support
          </a>

          <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
            <ShieldCheckIcon className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-300/80 leading-relaxed">
              This private number is provided exclusively to authorized Chew Network investors and partners. Do not publish, post, sell, distribute, or share this number publicly.
            </p>
          </div>
        </>
      )}
    </div>
  );
}