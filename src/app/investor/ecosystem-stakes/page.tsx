'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/portal/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { investorService, type StakeTransaction } from '@/lib/services/investorService';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, ClockIcon } from '@heroicons/react/24/outline';

const txTypeLabels: Record<string, { label: string; color: string }> = {
  purchase: { label: 'PURCHASE', color: 'text-green-400' },
  additional_purchase: { label: 'ADDITIONAL PURCHASE', color: 'text-green-400' },
  transfer_in: { label: 'TRANSFER IN', color: 'text-blue-400' },
  transfer_out: { label: 'TRANSFER OUT', color: 'text-red-400' },
  company_repurchase: { label: 'COMPANY REPURCHASE', color: 'text-amber-400' },
  redemption: { label: 'REDEMPTION', color: 'text-red-400' },
  adjustment: { label: 'ADJUSTMENT', color: 'text-purple-400' },
};

export default function MyEcosystemStakesPage() {
  const { investorProfile, loading } = useAuth();
  const [transactions, setTransactions] = useState<StakeTransaction[]>([]);
  const [txLoading, setTxLoading] = useState(true);

  useEffect(() => {
    investorService.getMyTransactions().then((data) => {
      setTransactions(data);
      setTxLoading(false);
    });
  }, []);

  const formatOwnership = (pct: number) => {
    if (!pct) return '0%';
    return pct.toFixed(7).replace(/\.?0+$/, '') + '%';
  };

  const formatStakes = (val: number) => new Intl.NumberFormat('en-US').format(val || 0);
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

  const ownershipPct = investorProfile?.ownershipPercentage || 0;
  const donutPct = Math.min((ownershipPct / 5) * 100, 100);
  const circumference = 2 * Math.PI * 54;
  const strokeDash = (donutPct / 100) * circumference;

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-4 max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold">My Ecosystem Stakes</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {loading ? '...' : `Investor ID: ${investorProfile?.investorId || '—'} — Founding Owner & Investor`}
            </p>
          </div>
          <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
            investorProfile?.accountStatus === 'active' ? 'badge-green' : 'bg-gray-500/20 text-gray-400'
          }`}>
            {investorProfile?.accountStatus?.toUpperCase() || 'ACTIVE'}
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {[
            { label: 'Original Stakes', value: formatStakes(investorProfile?.originalStakesPurchased || 0) },
            { label: 'Additional Stakes', value: formatStakes(investorProfile?.additionalStakesPurchased || 0) },
            { label: 'Current Stakes Owned', value: formatStakes(investorProfile?.currentStakesOwned || 0), highlight: true },
            { label: 'Stakes Sold / Transferred', value: formatStakes(investorProfile?.stakesSold || 0) },
            { label: 'Company Repurchases', value: formatStakes(investorProfile?.stakesRepurchased || 0) },
            { label: 'Original Stake Price', value: `$${(investorProfile?.originalStakePrice || 0.01).toFixed(2)}` },
            { label: 'Original Investment', value: formatCurrency(investorProfile?.originalInvestment || 0) },
            { label: 'Purchase Date', value: investorProfile?.joinDate || '—' },
            { label: 'Round', value: investorProfile?.round || 'Phase 1' },
            { label: 'Certificate #', value: investorProfile?.certificateNumber || '—' },
          ].map((s, i) => (
            <div key={i} className={`stat-card ${s.highlight ? 'border-primary/40' : ''}`}>
              <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
              <p className={`font-bold text-base ${s.highlight ? 'text-primary' : 'text-white'}`}>{loading ? '...' : s.value}</p>
            </div>
          ))}
        </div>

        {/* Ownership chart + history */}
        <div className="flex flex-col xl:flex-row gap-4">
          {/* Ownership donut */}
          <div className="xl:w-[280px] flex-shrink-0">
            <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center">
              <h3 className="text-white font-bold text-sm mb-4">Your Ownership</h3>
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#1e293b" strokeWidth="12" />
                  <circle
                    cx="60" cy="60" r="54" fill="none"
                    stroke="#F97316" strokeWidth="12"
                    strokeDasharray={`${strokeDash} ${circumference}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-white font-extrabold text-sm leading-tight text-center">YOU OWN</p>
                  <p className="text-primary font-extrabold text-xs leading-tight text-center">
                    {loading ? '...' : formatOwnership(ownershipPct)}
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground text-xs text-center mt-3">OF CHEW NETWORK</p>
              <p className="text-xs text-muted-foreground/60 text-center mt-1">
                Based on 800,000,000 total stakes = 5%
              </p>
            </div>
          </div>

          {/* Transaction history */}
          <div className="flex-1 min-w-0">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <ClockIcon className="w-4 h-4 text-primary" />
                <h3 className="text-white font-bold text-sm">Ownership History</h3>
              </div>

              {txLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse h-16 bg-border/30 rounded-lg" />
                  ))}
                </div>
              ) : transactions.length === 0 ? (
                <p className="text-muted-foreground text-sm">No transactions recorded yet.</p>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx) => {
                    const txInfo = txTypeLabels[tx.transactionType] || { label: tx.transactionType.toUpperCase(), color: 'text-white' };
                    const isPositive = ['purchase', 'additional_purchase', 'transfer_in'].includes(tx.transactionType);
                    return (
                      <div key={tx.id} className="border border-border/50 rounded-xl p-4 hover:border-primary/30 transition-colors">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {isPositive
                                ? <ArrowTrendingUpIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
                                : <ArrowTrendingDownIcon className="w-4 h-4 text-red-400 flex-shrink-0" />
                              }
                              <span className={`text-xs font-bold tracking-wide ${txInfo.color}`}>{txInfo.label}</span>
                            </div>
                            <p className="text-white font-bold text-base">{formatStakes(tx.numberOfStakes)} Stakes</p>
                            <p className="text-muted-foreground text-xs mt-0.5">
                              ${tx.pricePerStake.toFixed(4)} per stake · {formatCurrency(tx.grossAmount)}
                            </p>
                            {tx.notes && <p className="text-muted-foreground/60 text-xs mt-1 italic">{tx.notes}</p>}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-muted-foreground text-xs">{tx.transactionDate}</p>
                            <p className="text-xs text-muted-foreground/60 mt-0.5">{tx.round}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}