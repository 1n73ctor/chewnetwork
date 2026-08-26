'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/portal/AppLayout';
import { investorService, type InvestorUpdate } from '@/lib/services/investorService';
import { NewspaperIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

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

const categoryColors: Record<string, string> = {
  see_it_cook_it: 'text-orange-400 bg-orange-400/10',
  chef_pepe: 'text-amber-400 bg-amber-400/10',
  technology: 'text-blue-400 bg-blue-400/10',
  company: 'text-purple-400 bg-purple-400/10',
  creators: 'text-green-400 bg-green-400/10',
  restaurants: 'text-red-400 bg-red-400/10',
  milestones: 'text-yellow-400 bg-yellow-400/10',
  phase_2: 'text-cyan-400 bg-cyan-400/10',
  general: 'text-gray-400 bg-gray-400/10',
};

export default function InvestorUpdatesPage() {
  const [updates, setUpdates] = useState<InvestorUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<InvestorUpdate | null>(null);

  useEffect(() => {
    investorService.getUpdates().then((data) => {
      setUpdates(data);
      setLoading(false);
    });
  }, []);

  if (selected) {
    return (
      <AppLayout>
        <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-4">
          <button onClick={() => setSelected(null)} className="text-sm text-primary hover:underline flex items-center gap-1">
            ← Back to Updates
          </button>
          <div className="bg-card border border-border rounded-xl p-6">
            <span className={`text-xs font-bold tracking-widest px-2 py-1 rounded-full ${categoryColors[selected.category] || 'text-gray-400 bg-gray-400/10'}`}>
              {categoryLabels[selected.category] || selected.category.toUpperCase()}
            </span>
            <h1 className="text-white text-xl font-bold mt-3 mb-1">{selected.title}</h1>
            <p className="text-muted-foreground text-sm mb-4">{selected.publishDate}</p>
            <div className="border-t border-border pt-4">
              <p className="text-muted-foreground leading-relaxed">{selected.fullContent}</p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-4">
        <div>
          <h1 className="text-white text-2xl font-bold">Messages &amp; Updates</h1>
          <p className="text-muted-foreground text-sm mt-1">Private investor newsfeed from Chew Network</p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-card border border-border rounded-xl h-28" />
            ))}
          </div>
        ) : updates.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <NewspaperIcon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-white font-semibold mb-1">No Updates Yet</p>
            <p className="text-muted-foreground text-sm">Investor updates will appear here when published.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {updates.map((update) => (
              <button
                key={update.id}
                onClick={() => setSelected(update)}
                className="w-full text-left bg-card border border-border rounded-xl p-5 hover:border-primary/40 hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full ${categoryColors[update.category] || 'text-gray-400 bg-gray-400/10'}`}>
                        {categoryLabels[update.category] || update.category.toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">{update.publishDate}</span>
                    </div>
                    <h3 className="text-white font-bold text-sm mb-1 group-hover:text-primary transition-colors">
                      {update.title}
                    </h3>
                    <p className="text-muted-foreground text-xs line-clamp-2">{update.shortDescription}</p>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
