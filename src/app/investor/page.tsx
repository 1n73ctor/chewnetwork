import React from 'react';
import AppLayout from '@/components/portal/AppLayout';
import HeroBanner from './components/HeroBanner';
import StatsRow from './components/StatsRow';
import StakesOverviewCard from './components/StakesOverviewCard';
import QuickAccessGrid from './components/QuickAccessGrid';
import OwnershipJourney from './components/OwnershipJourney';
import NetworkUpdates from './components/NetworkUpdates';
import InvestorHotline from './components/InvestorHotline';

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="p-4 lg:p-6 space-y-4 max-w-screen-2xl mx-auto">
        {/* Hero Banner */}
        <HeroBanner />

        {/* Stats Row */}
        <StatsRow />

        {/* Main + Right Panel */}
        <div className="flex flex-col xl:flex-row gap-4">
          {/* Left/Main column */}
          <div className="flex-1 min-w-0 space-y-4">
            <StakesOverviewCard />
            <QuickAccessGrid />
            <OwnershipJourney />
          </div>

          {/* Right panel */}
          <div className="xl:w-[300px] 2xl:w-[320px] flex-shrink-0 space-y-4">
            <NetworkUpdates />
            <InvestorHotline />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}