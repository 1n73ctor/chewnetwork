import React from 'react';
import {
  CircleStackIcon,
  ChartPieIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

const stats = [
  {
    id: 'sstats-total',
    icon: <CircleStackIcon className="w-5 h-5 text-primary" />,
    label: 'Total Stakes Owned',
    value: '50,000',
    sub: 'No change since purchase',
    subColor: 'text-muted-foreground',
  },
  {
    id: 'sstats-ownership',
    icon: <ChartPieIcon className="w-5 h-5 text-primary" />,
    label: 'Current Ownership %',
    value: '0.0003125%',
    sub: 'Of total Chew Network',
    subColor: 'text-muted-foreground',
  },
  {
    id: 'sstats-investment',
    icon: <CurrencyDollarIcon className="w-5 h-5 text-primary" />,
    label: 'Original Investment',
    value: '$500.00',
    sub: 'Phase 1 — Round One',
    subColor: 'text-muted-foreground',
  },
  {
    id: 'sstats-price',
    icon: <ArrowTrendingUpIcon className="w-5 h-5 text-primary" />,
    label: 'Stake Price at Purchase',
    value: '$0.01',
    sub: 'Per ecosystem stake',
    subColor: 'text-muted-foreground',
  },
];

export default function StakesStatsRow() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      {stats?.map((s) => (
        <div key={s?.id} className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            {s?.icon}
            <span className="text-xs text-muted-foreground font-medium leading-tight">{s?.label}</span>
          </div>
          <p className="text-white font-bold text-xl font-tabular">{s?.value}</p>
          <p className={`text-xs font-medium mt-0.5 ${s?.subColor}`}>{s?.sub}</p>
        </div>
      ))}
    </div>
  );
}