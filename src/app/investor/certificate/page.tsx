'use client';

import React, { useRef } from 'react';
import AppLayout from '@/components/portal/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { DocumentArrowDownIcon, PrinterIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

export default function MyCertificatePage() {
  const { investorProfile, loading } = useAuth();
  const certRef = useRef<HTMLDivElement>(null);

  const formatOwnership = (pct: number) => {
    if (!pct) return '0%';
    return pct.toFixed(7).replace(/\.?0+$/, '') + '%';
  };

  const handlePrint = () => {
    window.print();
  };

  const issueDate = investorProfile?.joinDate
    ? new Date(investorProfile.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold">My Certificate</h1>
            <p className="text-muted-foreground text-sm mt-1">Official Ecosystem Stake Ownership Certificate</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-card border border-border hover:border-primary/50 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
            >
              <PrinterIcon className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
            >
              <DocumentArrowDownIcon className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Certificate */}
        <div
          ref={certRef}
          className="bg-card border-2 border-primary/40 rounded-2xl overflow-hidden shadow-2xl print:shadow-none"
          style={{ background: 'linear-gradient(135deg, #0D0D1B 0%, #111827 50%, #0D0D1B 100%)' }}
        >
          {/* Top border accent */}
          <div className="h-1.5 bg-gradient-to-r from-primary via-amber-400 to-primary" />

          <div className="p-8 lg:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-px h-8 bg-primary/40" />
                <div>
                  <p className="text-primary text-xs font-bold tracking-[0.3em] mb-1">CHEW NETWORK</p>
                  <h2 className="text-white text-2xl lg:text-3xl font-extrabold tracking-tight">OFFICIAL ECOSYSTEM STAKE</h2>
                  <h2 className="text-white text-2xl lg:text-3xl font-extrabold tracking-tight">OWNERSHIP CERTIFICATE</h2>
                </div>
                <div className="w-px h-8 bg-primary/40" />
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckBadgeIcon className="w-5 h-5 text-primary" />
                <p className="text-primary text-xs font-semibold tracking-widest">VERIFIED & AUTHENTICATED</p>
                <CheckBadgeIcon className="w-5 h-5 text-primary" />
              </div>
            </div>

            {/* Decorative divider */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <div className="text-primary text-lg">◆</div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            </div>

            {/* Certificate body */}
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-8 bg-border/30 rounded" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {[
                  { label: 'Investor', value: `${investorProfile?.firstName || ''} ${investorProfile?.lastName || ''}`.trim() || '—' },
                  { label: 'Investor ID', value: investorProfile?.investorId || '—' },
                  { label: 'Certificate Number', value: investorProfile?.certificateNumber || '—' },
                  { label: 'Ecosystem Stakes', value: new Intl.NumberFormat('en-US').format(investorProfile?.currentStakesOwned || 0) },
                  { label: 'Ownership Represented', value: formatOwnership(investorProfile?.ownershipPercentage || 0) },
                  { label: 'Round', value: investorProfile?.round || 'Phase 1' },
                  { label: 'Issue Date', value: issueDate },
                  { label: 'Account Status', value: (investorProfile?.accountStatus || 'Active').toUpperCase() },
                ].map((field, i) => (
                  <div key={i} className="border-b border-border/30 pb-4">
                    <p className="text-muted-foreground text-xs font-semibold tracking-widest mb-1">{field.label.toUpperCase()}</p>
                    <p className="text-white font-bold text-lg">{field.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Ownership statement */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center mb-8">
              <p className="text-muted-foreground text-sm mb-2">This certifies that the above-named investor holds</p>
              <p className="text-white text-3xl font-extrabold mb-1">
                {loading ? '...' : new Intl.NumberFormat('en-US').format(investorProfile?.currentStakesOwned || 0)}
              </p>
              <p className="text-primary font-bold text-sm mb-2">ECOSYSTEM STAKES</p>
              <p className="text-muted-foreground text-sm">
                representing{' '}
                <span className="text-white font-bold">
                  {loading ? '...' : formatOwnership(investorProfile?.ownershipPercentage || 0)}
                </span>
                {' '}ownership of Chew Network
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <div className="text-primary text-lg">◆</div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            </div>

            <div className="text-center">
              <p className="text-muted-foreground text-xs leading-relaxed max-w-lg mx-auto">
                This certificate is issued by Chew Network and represents the holder&apos;s Ecosystem Stake ownership as recorded in the official Chew Network ownership ledger. Ownership transfers are governed by Chew Network&apos;s official documents and records.
              </p>
              <p className="text-primary text-xs font-bold tracking-widest mt-3">SEE IT. COOK IT. OWN THE FUTURE.</p>
            </div>
          </div>

          {/* Bottom border accent */}
          <div className="h-1.5 bg-gradient-to-r from-primary via-amber-400 to-primary" />
        </div>
      </div>
    </AppLayout>
  );
}