'use client';

import React, { useEffect, useState } from 'react';
import { investorService, type InvestorUpdate } from '@/lib/services/investorService';
import { createClient } from '@/lib/supabase/client';
import { NewspaperIcon } from '@heroicons/react/24/outline';

const categoryLabels: Record<string, string> = {
  see_it_cook_it: 'SEE IT. COOK IT.',
  chef_pepe: 'CHEF PEPE',
  technology: 'TECHNOLOGY',
  company: 'COMPANY',
  creators: 'CREATORS',
  restaurants: 'RESTAURANTS',
  milestones: 'MILESTONES',
  phase_2: 'PHASE 2',
  general: 'GENERAL',
};

export default function NetworkUpdates() {
  const [updates, setUpdates] = useState<InvestorUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<InvestorUpdate | null>(null);

  const fetchUpdates = async () => {
    const data = await investorService.getUpdates();
    setUpdates(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUpdates();

    const supabase = createClient();
    const channel = supabase
      .channel('investor-updates-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'investor_updates' },
        () => { fetchUpdates(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (selected) {
    return (
      <div className="bg-card border border-border rounded-xl p-4">
        <button onClick={() => setSelected(null)} className="text-xs text-primary mb-3 hover:underline">← Back to Updates</button>
        <span className="text-[10px] font-bold tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          {categoryLabels[selected.category] || selected.category.toUpperCase()}
        </span>
        <h3 className="text-white font-bold text-sm mt-2 mb-1">{selected.title}</h3>
        <p className="text-xs text-muted-foreground mb-3">{selected.publishDate}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{selected.fullContent}</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <NewspaperIcon className="w-4 h-4 text-primary" />
        <h3 className="text-white font-bold text-sm">Investor Updates</h3>
        {updates.length > 0 && (
          <span className="badge-orange ml-auto">{updates.length}</span>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-3 bg-border rounded w-1/3 mb-1" />
              <div className="h-4 bg-border rounded w-full mb-1" />
              <div className="h-3 bg-border rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : updates.length === 0 ? (
        <p className="text-muted-foreground text-xs">No updates yet.</p>
      ) : (
        <div className="space-y-3">
          {updates.slice(0, 3).map((update) => (
            <button
              key={update.id}
              onClick={() => setSelected(update)}
              className="w-full text-left group"
            >
              <div className="border border-border/50 rounded-lg p-3 hover:border-primary/40 hover:bg-primary/5 transition-all">
                <span className="text-[10px] font-bold tracking-widest text-primary">
                  {categoryLabels[update.category] || update.category.toUpperCase()}
                </span>
                <p className="text-white text-xs font-semibold mt-0.5 leading-snug group-hover:text-primary transition-colors">
                  {update.title}
                </p>
                <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{update.shortDescription}</p>
                <p className="text-muted-foreground/60 text-[10px] mt-1">{update.publishDate}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}