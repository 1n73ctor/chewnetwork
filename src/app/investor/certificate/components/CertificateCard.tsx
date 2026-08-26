'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { ArrowDownTrayIcon, ShareIcon, PrinterIcon } from '@heroicons/react/24/outline';

export default function CertificateCard() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    // Backend integration point: generate and stream PDF certificate
    setTimeout(() => {
      setDownloading(false);
      toast?.success('Certificate downloaded successfully.');
    }, 1800);
  };

  const handleShare = () => {
    toast?.success('Share link copied to clipboard.');
  };

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-all duration-150 active:scale-95"
        >
          {downloading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Preparing PDF...
            </>
          ) : (
            <>
              <ArrowDownTrayIcon className="w-4 h-4" />
              Download PDF
            </>
          )}
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 border border-border text-muted-foreground hover:text-white hover:border-primary text-sm font-semibold rounded-lg transition-all duration-150"
        >
          <ShareIcon className="w-4 h-4" />
          Share
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-border text-muted-foreground hover:text-white hover:border-primary text-sm font-semibold rounded-lg transition-all duration-150">
          <PrinterIcon className="w-4 h-4" />
          Print
        </button>
      </div>
      {/* Certificate document */}
      <div className="card-surface-alt rounded-2xl overflow-hidden border-2 border-primary/30 shadow-2xl shadow-primary/10">
        {/* Certificate header band */}
        <div className="bg-primary px-8 py-5 flex items-center justify-between">
          <div>
            <p className="text-white text-xs font-bold tracking-widest uppercase opacity-80">Official Certificate of</p>
            <p className="text-white text-xl font-extrabold tracking-wide">Ecosystem Stake Ownership</p>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-xs font-semibold tracking-widest">CHEW NETWORK</p>
            <p className="text-white/70 text-[10px] tracking-wider">See It. Cook It.</p>
          </div>
        </div>

        {/* Certificate body */}
        <div className="px-8 py-8 bg-gradient-to-br from-[#1A1A2A] to-[#13131F]">
          {/* Decorative border */}
          <div className="border border-primary/20 rounded-xl p-6 relative">
            {/* Corner ornaments */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary/60 rounded-tl" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary/60 rounded-tr" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary/60 rounded-bl" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary/60 rounded-br" />

            <div className="text-center mb-6">
              <p className="text-muted-foreground text-xs tracking-widest uppercase mb-2">This certifies that</p>
              <p className="text-white text-3xl font-extrabold tracking-tight">John D.</p>
              <p className="text-primary text-sm font-semibold mt-1">Founding Owner &amp; Investor</p>
            </div>

            <div className="text-center mb-6">
              <p className="text-muted-foreground text-xs mb-1">is the registered owner of</p>
              <p className="text-white text-5xl font-extrabold font-tabular tracking-tight">50,000</p>
              <p className="text-primary text-base font-semibold mt-1">Ecosystem Stakes</p>
              <p className="text-muted-foreground text-xs mt-1">representing <span className="text-white font-semibold">0.0003125%</span> of Chew Network</p>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-center">
              <div className="bg-card/60 rounded-lg p-3">
                <p className="text-muted-foreground text-[10px] uppercase tracking-widest mb-1">Certificate Number</p>
                <p className="text-white text-sm font-bold font-mono">CERT-CN-000184</p>
              </div>
              <div className="bg-card/60 rounded-lg p-3">
                <p className="text-muted-foreground text-[10px] uppercase tracking-widest mb-1">Investor ID</p>
                <p className="text-white text-sm font-bold font-mono">CN-000184</p>
              </div>
              <div className="bg-card/60 rounded-lg p-3">
                <p className="text-muted-foreground text-[10px] uppercase tracking-widest mb-1">Issue Date</p>
                <p className="text-white text-sm font-bold">May 20, 2025</p>
              </div>
              <div className="bg-card/60 rounded-lg p-3">
                <p className="text-muted-foreground text-[10px] uppercase tracking-widest mb-1">Investment Round</p>
                <p className="text-white text-sm font-bold">Phase 1 — Round One</p>
              </div>
            </div>

            {/* QR + signature row */}
            <div className="flex items-end justify-between mt-2">
              {/* QR placeholder */}
              <div className="w-20 h-20 bg-white rounded-lg p-1.5 flex-shrink-0">
                <div className="w-full h-full bg-black rounded grid grid-cols-5 gap-0.5 p-1">
                  {Array.from({ length: 25 })?.map((_, i) => (
                    <div
                      key={`qr-cell-${i}`}
                      className="rounded-sm"
                      style={{ background: [0,1,2,3,4,5,6,7,10,12,14,17,18,19,20,21,22,23,24]?.includes(i) ? '#FFFFFF' : '#000000' }}
                    />
                  ))}
                </div>
              </div>

              {/* Signature area */}
              <div className="text-center">
                <div className="w-32 border-b border-primary/40 mb-1 mx-auto" />
                <p className="text-muted-foreground text-[10px]">Authorized Signature</p>
                <p className="text-white text-xs font-semibold mt-0.5">Chew Network Inc.</p>
              </div>

              {/* Seal */}
              <div className="w-16 h-16 rounded-full border-2 border-primary/60 flex items-center justify-center flex-shrink-0">
                <div className="w-12 h-12 rounded-full border border-primary/40 flex items-center justify-center">
                  <span className="text-2xl">🍴</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate footer */}
        <div className="px-8 py-3 bg-card/50 border-t border-border flex items-center justify-between">
          <p className="text-muted-foreground text-[10px]">This certificate is issued by Chew Network Inc. and is subject to the terms of the Offering Documents.</p>
          <span className="badge-green text-[10px] flex-shrink-0 ml-4">Verified Active</span>
        </div>
      </div>
    </div>
  );
}