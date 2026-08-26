'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminService, type Investor } from '@/lib/services/investorService';
import { AdminLayout } from '../certificates/page';
import { BuildingStorefrontIcon, MagnifyingGlassIcon, CheckIcon } from '@heroicons/react/24/outline';
import { createClient } from '@/lib/supabase/client';

export default function AdminCreatorsPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [creatorForm, setCreatorForm] = useState({
    creatorProgramStatus: false,
    creatorBrandApproach: '',
    creatorWebsiteStatus: '',
    creatorAffiliateStatus: '',
    creatorAiContentStatus: '',
    creatorSocialPlatforms: 0,
    creator90dayStart: '',
  });

  useEffect(() => {
    if (!loading && !isAdmin) router.push('/');
  }, [isAdmin, loading]);

  useEffect(() => {
    if (isAdmin) {
      adminService.getAllInvestors().then((data) => { setInvestors(data); setDataLoading(false); });
    }
  }, [isAdmin]);

  const filtered = investors.filter((inv) => {
    const q = search.toLowerCase();
    return !q || inv.firstName?.toLowerCase().includes(q) || inv.lastName?.toLowerCase().includes(q) || inv.investorId?.toLowerCase().includes(q);
  });

  const handleSelectInvestor = (inv: Investor) => {
    setSelectedInvestor(inv);
    setCreatorForm({
      creatorProgramStatus: inv.creatorProgramStatus || false,
      creatorBrandApproach: inv.creatorBrandApproach || '',
      creatorWebsiteStatus: inv.creatorWebsiteStatus || '',
      creatorAffiliateStatus: inv.creatorAffiliateStatus || '',
      creatorAiContentStatus: inv.creatorAiContentStatus || '',
      creatorSocialPlatforms: inv.creatorSocialPlatforms || 0,
      creator90dayStart: inv.creator90dayStart || '',
    });
  };

  const handleSaveCreator = async () => {
    if (!selectedInvestor) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from('investors').update({
      creator_program_status: creatorForm.creatorProgramStatus,
      creator_brand_approach: creatorForm.creatorBrandApproach || null,
      creator_website_status: creatorForm.creatorWebsiteStatus || null,
      creator_affiliate_status: creatorForm.creatorAffiliateStatus || null,
      creator_ai_content_status: creatorForm.creatorAiContentStatus || null,
      creator_social_platforms: creatorForm.creatorSocialPlatforms,
      creator_90day_start: creatorForm.creator90dayStart || null,
      updated_at: new Date().toISOString(),
    }).eq('id', selectedInvestor.id);

    if (!error) {
      await adminService.createAuditLog(
        creatorForm.creatorProgramStatus ? 'CREATOR_PROGRAM_ACTIVATED' : 'CREATOR_PROGRAM_UPDATED',
        selectedInvestor.id,
        { creatorProgramStatus: selectedInvestor.creatorProgramStatus },
        { creatorProgramStatus: creatorForm.creatorProgramStatus }
      );
      const updated = await adminService.getAllInvestors();
      setInvestors(updated);
      const refreshed = updated.find(i => i.id === selectedInvestor.id);
      if (refreshed) setSelectedInvestor(refreshed);
      setSuccessMsg('Creator program updated successfully. Ownership records unchanged.');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!isAdmin) return null;

  const activeCreators = investors.filter(i => i.creatorProgramStatus).length;

  return (
    <AdminLayout activeId="creators">
      <div className="p-4 lg:p-6 space-y-5">
        <div>
          <h1 className="text-white text-2xl font-bold">Creator Programs</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage investor creator program participation</p>
        </div>

        {successMsg && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
            <p className="text-green-400 text-sm">{successMsg}</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Total Investors', value: investors.length },
            { label: 'Active Creators', value: activeCreators },
            { label: 'Ecosystem Only', value: investors.length - activeCreators },
          ].map((stat, i) => (
            <div key={i} className="stat-card">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-white font-bold text-xl">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Investor list */}
          <div className="space-y-3">
            <div className="relative">
              <MagnifyingGlassIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search investors..."
                className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {dataLoading ? (
                <div className="p-4 space-y-3">{[1,2,3].map(i => <div key={i} className="animate-pulse h-10 bg-border/30 rounded" />)}</div>
              ) : (
                <div className="divide-y divide-border/50 max-h-96 overflow-y-auto">
                  {filtered.map((inv) => (
                    <button
                      key={inv.id}
                      onClick={() => handleSelectInvestor(inv)}
                      className={`w-full flex items-center justify-between px-4 py-3 hover:bg-primary/5 transition-colors text-left ${selectedInvestor?.id === inv.id ? 'bg-primary/10 border-l-2 border-primary' : ''}`}
                    >
                      <div>
                        <p className="text-white text-sm font-medium">{inv.firstName} {inv.lastName}</p>
                        <p className="text-muted-foreground text-xs">{inv.investorId}</p>
                      </div>
                      {inv.creatorProgramStatus ? (
                        <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">Creator</span>
                      ) : (
                        <span className="text-xs bg-gray-500/15 text-gray-400 border border-gray-500/30 px-2 py-0.5 rounded-full">Investor Only</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Edit panel */}
          {selectedInvestor ? (
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div>
                <h3 className="text-white font-bold text-sm">{selectedInvestor.firstName} {selectedInvestor.lastName}</h3>
                <p className="text-muted-foreground text-xs">{selectedInvestor.investorId}</p>
              </div>

              {/* Ownership summary (read-only) */}
              <div className="bg-background rounded-xl p-3 border border-border/50 space-y-1.5">
                <p className="text-xs text-muted-foreground font-semibold tracking-widest mb-2">EXISTING ECOSYSTEM OWNERSHIP</p>
                {[
                  { label: 'Original Stakes', value: new Intl.NumberFormat('en-US').format(selectedInvestor.originalStakesPurchased) },
                  { label: 'Additional Stakes', value: new Intl.NumberFormat('en-US').format(selectedInvestor.additionalStakesPurchased) },
                  { label: 'Current Stakes', value: new Intl.NumberFormat('en-US').format(selectedInvestor.currentStakesOwned) },
                  { label: 'Ownership %', value: `${(selectedInvestor.ownershipPercentage || 0).toFixed(7)}%` },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="text-white font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Creator fields */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-white font-medium">Creator Program Active</label>
                  <button
                    onClick={() => setCreatorForm({ ...creatorForm, creatorProgramStatus: !creatorForm.creatorProgramStatus })}
                    className={`w-12 h-6 rounded-full flex items-center px-0.5 transition-all ${creatorForm.creatorProgramStatus ? 'bg-primary justify-end' : 'bg-border justify-start'}`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white" />
                  </button>
                </div>

                {creatorForm.creatorProgramStatus && (
                  <>
                    <div>
                      <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Brand Approach</label>
                      <select
                        value={creatorForm.creatorBrandApproach}
                        onChange={(e) => setCreatorForm({ ...creatorForm, creatorBrandApproach: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary"
                      >
                        <option value="">Select...</option>
                        <option value="behind_the_scenes">Behind the Scenes</option>
                        <option value="you_are_the_brand">You Are the Brand</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Website Status</label>
                      <input type="text" value={creatorForm.creatorWebsiteStatus} onChange={(e) => setCreatorForm({ ...creatorForm, creatorWebsiteStatus: e.target.value })} placeholder="e.g. IN DEVELOPMENT" className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Affiliate Setup</label>
                      <input type="text" value={creatorForm.creatorAffiliateStatus} onChange={(e) => setCreatorForm({ ...creatorForm, creatorAffiliateStatus: e.target.value })} placeholder="e.g. IN PROGRESS" className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground font-medium mb-1.5 block">AI Content Status</label>
                      <input type="text" value={creatorForm.creatorAiContentStatus} onChange={(e) => setCreatorForm({ ...creatorForm, creatorAiContentStatus: e.target.value })} placeholder="e.g. ACTIVE" className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Social Platforms</label>
                      <input type="number" min="0" value={creatorForm.creatorSocialPlatforms} onChange={(e) => setCreatorForm({ ...creatorForm, creatorSocialPlatforms: parseInt(e.target.value) || 0 })} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground font-medium mb-1.5 block">90-Day Buildout Start Date</label>
                      <input type="date" value={creatorForm.creator90dayStart} onChange={(e) => setCreatorForm({ ...creatorForm, creator90dayStart: e.target.value })} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary" />
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={handleSaveCreator}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
              >
                <CheckIcon className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Creator Settings'}
              </button>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center justify-center text-center">
              <BuildingStorefrontIcon className="w-10 h-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">Select an investor to manage their creator program settings.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
