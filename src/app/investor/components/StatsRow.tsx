'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  IdentificationIcon,
  CircleStackIcon,
  ChartPieIcon,
  TagIcon,
  CurrencyDollarIcon,
  FlagIcon,
} from '@heroicons/react/24/outline';

export default function StatsRow() {
  const { investorProfile, loading } = useAuth();

  const formatOwnership = (pct: number) => {
    if (!pct) return '0%';
    return pct.toFixed(7).replace(/\.?0+$/, '') + '%';
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

  const formatStakes = (val: number) =>
    new Intl.NumberFormat('en-US').format(val || 0);

  const stats = [
    {
      id: 'stat-investor-id',
      icon: <IdentificationIcon className="w-5 h-5 text-primary" />,
      label: 'Investor ID',
      value: loading ? '...' : (investorProfile?.investorId || '—'),
      sub: 'Founding Owner',
      subColor: 'text-primary',
    },
    {
      id: 'stat-stakes',
      icon: <CircleStackIcon className="w-5 h-5 text-primary" />,
      label: 'Ecosystem Stakes Owned',
      value: loading ? '...' : formatStakes(investorProfile?.currentStakesOwned || 0),
      sub: 'Stakes',
      subColor: 'text-muted-foreground',
    },
    {
      id: 'stat-ownership',
      icon: <ChartPieIcon className="w-5 h-5 text-primary" />,
      label: 'Ownership Represented',
      value: loading ? '...' : formatOwnership(investorProfile?.ownershipPercentage || 0),
      sub: 'Of Chew Network',
      subColor: 'text-muted-foreground',
    },
    {
      id: 'stat-price',
      icon: <TagIcon className="w-5 h-5 text-primary" />,
      label: 'Original Stake Price',
      value: loading ? '...' : `$${(investorProfile?.originalStakePrice || 0.01).toFixed(2)}`,
      sub: 'Per Stake',
      subColor: 'text-muted-foreground',
    },
    {
      id: 'stat-investment',
      icon: <CurrencyDollarIcon className="w-5 h-5 text-primary" />,
      label: 'Total Investment',
      value: loading ? '...' : formatCurrency(investorProfile?.originalInvestment || 0),
      sub: 'USD',
      subColor: 'text-muted-foreground',
    },
    {
      id: 'stat-round',
      icon: <FlagIcon className="w-5 h-5 text-primary" />,
      label: 'Round',
      value: loading ? '...' : (investorProfile?.round || 'Phase 1'),
      sub: investorProfile?.accountStatus === 'active' ? 'Active' : (investorProfile?.accountStatus || 'Active'),
      subColor: investorProfile?.accountStatus === 'active' ? 'text-green-400' : 'text-muted-foreground',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
      {stats?.map((stat) => (
        <div key={stat?.id} className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            {stat?.icon}
            <span className="text-xs text-muted-foreground font-medium leading-tight">{stat?.label}</span>
          </div>
          <p className="text-white font-bold text-xl font-tabular leading-tight">{stat?.value}</p>
          <p className={`text-xs font-medium mt-0.5 ${stat?.subColor}`}>{stat?.sub}</p>
        </div>
      ))}
    </div>
  );
}