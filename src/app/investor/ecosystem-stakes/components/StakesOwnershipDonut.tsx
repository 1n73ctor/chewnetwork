'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const StakesOwnershipDonutInner = dynamic(
  () => import('./StakesOwnershipDonutInner'),
  { ssr: false, loading: () => <div className="h-[240px] animate-pulse bg-muted rounded-xl" /> }
);

export default function StakesOwnershipDonut() {
  return <StakesOwnershipDonutInner />;
}