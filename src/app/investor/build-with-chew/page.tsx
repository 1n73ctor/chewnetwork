'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/portal/AppLayout';
import { useAuth } from '@/contexts/AuthContext';

import { BuildingStorefrontIcon, CheckCircleIcon, XCircleIcon, ArrowTopRightOnSquareIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

export default function BuildWithChewPage() {
  const { investorProfile, loading } = useAuth();
  const [stakes, setStakes] = useState<number>(0);
  const [ownership, setOwnership] = useState<number>(0);

  useEffect(() => {
    if (investorProfile) {
      setStakes(investorProfile.currentStakesOwned || 0);
      setOwnership(investorProfile.ownershipPercentage || 0);
    }
  }, [investorProfile]);

  const creatorActive = investorProfile?.creatorProgramStatus === true;
  const daysSinceStart = investorProfile?.creator90dayStart
    ? Math.floor((Date.now() - new Date(investorProfile.creator90dayStart).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const formatStakes = (n: number) => new Intl.NumberFormat('en-US').format(n);

  const StatusBadge = ({ active, label }: { active: boolean; label: string }) => (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${active ? 'bg-green-500/15 text-green-400 border border-green-500/30' : 'bg-gray-500/15 text-gray-400 border border-gray-500/30'}`}>
      {active ? <CheckCircleIcon className="w-3.5 h-3.5" /> : <XCircleIcon className="w-3.5 h-3.5" />}
      {label}
    </div>
  );

  if (loading) {
    return (
      <AppLayout>
        <div className="p-4 lg:p-6 flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <BuildingStorefrontIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold">Build With Chew</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Your current participation in the Chew Network ecosystem</p>
          </div>
        </div>

        {/* Current Participation */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-white font-bold text-sm tracking-widest mb-4">YOUR CURRENT PARTICIPATION</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-background rounded-xl p-4 border border-border/50">
              <p className="text-xs text-muted-foreground font-semibold tracking-widest mb-2">ECOSYSTEM OWNER</p>
              <StatusBadge active={true} label="ACTIVE" />
              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Stakes Owned</span>
                  <span className="text-white font-semibold">{formatStakes(stakes)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Ownership</span>
                  <span className="text-primary font-semibold">{ownership.toFixed(7)}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Investor ID</span>
                  <span className="text-white font-semibold">{investorProfile?.investorId || '—'}</span>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-xl p-4 border border-border/50">
              <p className="text-xs text-muted-foreground font-semibold tracking-widest mb-2">CREATOR PROGRAM</p>
              <StatusBadge active={creatorActive} label={creatorActive ? 'ACTIVE' : 'NOT ACTIVE'} />
              {creatorActive && (
                <div className="mt-3 space-y-1.5">
                  {investorProfile?.creatorBrandApproach && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Brand Approach</span>
                      <span className="text-white font-semibold capitalize">{investorProfile.creatorBrandApproach.replace(/_/g, ' ')}</span>
                    </div>
                  )}
                  {investorProfile?.creatorWebsiteStatus && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Website</span>
                      <span className="text-white font-semibold capitalize">{investorProfile.creatorWebsiteStatus.replace(/_/g, ' ')}</span>
                    </div>
                  )}
                  {investorProfile?.creatorAffiliateStatus && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Affiliate Setup</span>
                      <span className="text-white font-semibold capitalize">{investorProfile.creatorAffiliateStatus.replace(/_/g, ' ')}</span>
                    </div>
                  )}
                  {investorProfile?.creatorAiContentStatus && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">AI Content</span>
                      <span className="text-white font-semibold capitalize">{investorProfile.creatorAiContentStatus.replace(/_/g, ' ')}</span>
                    </div>
                  )}
                  {(investorProfile?.creatorSocialPlatforms || 0) > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Social Platforms</span>
                      <span className="text-white font-semibold">{investorProfile?.creatorSocialPlatforms}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 90-Day Buildout (only if creator active and has start date) */}
        {creatorActive && investorProfile?.creator90dayStart && (
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDaysIcon className="w-5 h-5 text-primary" />
              <h2 className="text-white font-bold text-sm">90-Day Buildout Progress</h2>
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="text-center">
                <p className="text-primary text-3xl font-extrabold">{Math.min(daysSinceStart, 90)}</p>
                <p className="text-muted-foreground text-xs">of 90 days</p>
              </div>
              <div className="flex-1">
                <div className="w-full bg-border rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min((daysSinceStart / 90) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-muted-foreground text-xs mt-1.5">
                  Started {new Date(investorProfile.creator90dayStart).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Ownership note */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-white font-bold text-sm mb-3">Your Ecosystem Ownership Is Protected</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Adding Creator Program services does not affect your Ecosystem Stake ownership. Your stakes, ownership percentage, and investment history remain exactly as recorded — regardless of any creator program activity.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: 'Original Stakes', value: formatStakes(investorProfile?.originalStakesPurchased || 0) },
              { label: 'Additional Stakes', value: formatStakes(investorProfile?.additionalStakesPurchased || 0) },
              { label: 'Current Stakes', value: formatStakes(stakes) },
            ].map((item, i) => (
              <div key={i} className="bg-background rounded-xl p-3 text-center border border-border/50">
                <p className="text-white font-bold text-lg">{item.value}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA if not a creator */}
        {!creatorActive && (
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 text-center">
            <BuildingStorefrontIcon className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="text-white font-bold text-base mb-2">Explore the Creator Program</h3>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
              Some investors choose to also become Chew Creators — building their brand, content, and affiliate presence within the Chew Network ecosystem. Contact Chew Network to learn more.
            </p>
            <a
              href="/investor/hotline"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
            >
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              Contact Investor Support
            </a>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
