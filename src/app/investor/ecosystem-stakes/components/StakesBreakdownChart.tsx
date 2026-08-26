'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const StakesBreakdownInner = dynamic(
  () => import('./StakesBreakdownInner'),
  { ssr: false, loading: () => <div className="h-[260px] animate-pulse bg-muted rounded-xl" /> }
);

export default function StakesBreakdownChart() {
  return <StakesBreakdownInner />;
}