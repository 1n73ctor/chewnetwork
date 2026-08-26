'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/portal/AppLayout';
import { investorService, type WelcomeKit } from '@/lib/services/investorService';
import { GiftIcon, DocumentArrowDownIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function WelcomeKitPage() {
  const [kit, setKit] = useState<WelcomeKit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    investorService.getWelcomeKit().then((data) => {
      setKit(data);
      setLoading(false);
    });
  }, []);

  const contents = [
    'Welcome to Chew Network',
    'What Chew Network Is',
    'What Ecosystem Stakes Are',
    'See It. Cook It.',
    'Chef Pepe',
    'How Ownership Is Recorded',
    'Phase 1 Details',
    'Future Phase 2 Information',
    'Important Dates',
    'Investor FAQs',
    'Investor Hotline',
    'Contact Information',
  ];

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-4">
        <div>
          <h1 className="text-white text-2xl font-bold">Welcome Kit</h1>
          <p className="text-muted-foreground text-sm mt-1">Your official Chew Network Founder&apos;s Welcome Kit</p>
        </div>

        {/* Hero card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary via-amber-400 to-primary" />
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <GiftIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">
                  {loading ? 'Loading...' : (kit?.title || "Founder's Welcome Kit")}
                </h2>
                <p className="text-muted-foreground text-sm">Chew Network Investor Back Office</p>
              </div>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Welcome to the Chew Network family. This kit contains everything you need to understand your investment, your Ecosystem Stakes, and the future of Chew Network.
            </p>

            {/* Contents list */}
            <div className="mb-6">
              <p className="text-xs text-muted-foreground font-semibold tracking-widest mb-3">CONTENTS</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {contents.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {kit?.fileUrl ? (
                <>
                  <a
                    href={kit.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-card border border-border hover:border-primary/50 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all flex-1"
                  >
                    <EyeIcon className="w-4 h-4" />
                    View Welcome Kit
                  </a>
                  <a
                    href={kit.fileUrl}
                    download
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all flex-1"
                  >
                    <DocumentArrowDownIcon className="w-4 h-4" />
                    Download Welcome Kit
                  </a>
                </>
              ) : (
                <div className="bg-background/50 rounded-xl p-4 text-center flex-1">
                  <p className="text-muted-foreground text-sm">
                    {loading ? 'Loading welcome kit...' : 'Welcome Kit will be available soon. Check back shortly.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { emoji: '🧑‍🍳', title: 'Chef Pepe', desc: 'Meet our founding culinary ambassador and the face of Chew Network.' },
            { emoji: '📱', title: 'See It. Cook It.', desc: 'Discover how our platform connects food creators with their communities.' },
            { emoji: '🌱', title: 'Phase 2 Preview', desc: 'Get a glimpse of what is coming in the next phase of Chew Network.' },
          ].map((card, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <div className="text-3xl mb-2">{card.emoji}</div>
              <h3 className="text-white font-bold text-sm mb-1">{card.title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
