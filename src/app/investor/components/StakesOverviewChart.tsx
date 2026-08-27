'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const StakesDonutChartInner = dynamic(
  () => import('./StakesDonutChartInner'),
  { ssr: false, loading: () => <div className="w-[180px] h-[180px] rounded-full animate-pulse bg-muted" /> }
);

export default function StakesOverviewChart({
  ownershipPercentage = 0,
}: {
  ownershipPercentage?: number;
}) {
  return <StakesDonutChartInner ownershipPercentage={ownershipPercentage} />;
}
