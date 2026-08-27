'use client';

import React from 'react';
import Link from 'next/link';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, formatDate, formatOwnership, formatStakes } from '@/lib/format';
import StakesOverviewChart from './StakesOverviewChart';

export default function StakesOverviewCard() {
  const { investorProfile, loading } = useAuth();

  const placeholder = '—';
  const show = (value: string) => (loading ? '…' : investorProfile ? value : placeholder);

  // Sold and transferred are separate columns but read as one line here, the
  // way the certificate presents them.
  const stakesOut =
    (investorProfile?.stakesSold || 0) + (investorProfile?.stakesTransferred || 0);

  const tableRows = [
    {
      id: 'row-original',
      label: 'Original Stakes Purchased',
      value: show(formatStakes(investorProfile?.originalStakesPurchased)),
    },
    {
      id: 'row-additional',
      label: 'Additional Stakes Purchased',
      value: show(formatStakes(investorProfile?.additionalStakesPurchased)),
    },
    {
      id: 'row-current',
      label: 'Current Stakes Owned',
      value: show(formatStakes(investorProfile?.currentStakesOwned)),
    },
    {
      id: 'row-sold',
      label: 'Stakes Sold / Transferred',
      value: show(formatStakes(stakesOut)),
    },
    {
      id: 'row-repurchased',
      label: 'Stakes Repurchased (Company)',
      value: show(formatStakes(investorProfile?.stakesRepurchased)),
    },
    {
      id: 'row-ownership',
      label: 'Current Ownership %',
      value: show(formatOwnership(investorProfile?.ownershipPercentage)),
    },
  ];

  const detailRows = [
    {
      id: 'detail-purchase',
      label: 'Purchase Date',
      value: show(formatDate(investorProfile?.joinDate)),
    },
    {
      id: 'detail-investment',
      label: 'Original Investment',
      value: show(formatCurrency(investorProfile?.originalInvestment)),
    },
    {
      id: 'detail-cert',
      label: 'Certificate Number',
      value: show(investorProfile?.certificateNumber || placeholder),
    },
  ];

  const status = investorProfile?.accountStatus || '';
  const isActive = status.toLowerCase() === 'active';

  return (
    <div className="card-surface p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <ChartBarIcon className="w-5 h-5 text-primary" />
        <h2 className="text-white font-semibold text-base">My Ecosystem Stakes Overview</h2>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left table */}
        <div className="flex-1 min-w-0">
          {tableRows?.map((row) => (
            <div key={row?.id} className="overview-table-row">
              <span className="text-muted-foreground text-[13px]">{row?.label}</span>
              <span className="text-white font-semibold text-[13px] font-tabular">{row?.value}</span>
            </div>
          ))}
          <Link
            href="/investor/ecosystem-stakes"
            className="inline-block mt-4 px-4 py-2 rounded-lg border border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-white transition-all duration-150 active:scale-95"
          >
            View Full Ownership History
          </Link>
        </div>

        {/* Center donut */}
        <div className="flex items-center justify-center flex-shrink-0">
          <StakesOverviewChart ownershipPercentage={investorProfile?.ownershipPercentage || 0} />
        </div>

        {/* Right details */}
        <div className="flex-shrink-0 min-w-[180px]">
          {detailRows?.map((row) => (
            <div key={row?.id} className="mb-4">
              <p className="text-muted-foreground text-xs mb-0.5">{row?.label}</p>
              <p className="text-white text-sm font-semibold font-tabular">{row?.value}</p>
            </div>
          ))}
          <div>
            <p className="text-muted-foreground text-xs mb-1">Status</p>
            {loading ? (
              <span className="text-muted-foreground text-sm">…</span>
            ) : (
              <span className={isActive ? 'badge-green' : 'badge-orange'}>
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : placeholder}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
