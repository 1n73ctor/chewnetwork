'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { Analytics } from '@/lib/analytics';

const searchExamples = [
  'chicken dinner',
  'best tacos near me',
  'healthy meal prep',
  'teach me to cook steak',
  'vegan pasta',
  '30-minute meals',
];

const chefPepeActions = [
  {
    icon: '🎙️',
    label: 'Talk to Chef Pepe',
    desc: 'Ask anything about food or cooking',
    href: '/chef-pepe#talk',
    color: 'bg-primary',
  },
  {
    icon: '📸',
    label: 'Show a Meal',
    desc: 'Identify a dish and learn to make it',
    href: '/see-it-cook-it?mode=meal',
    color: 'bg-accent',
  },
  {
    icon: '🥦',
    label: 'Show Ingredients',
    desc: 'Get meal ideas from what you have',
    href: '/see-it-cook-it?mode=ingredients',
    color: 'bg-primary',
  },
  {
    icon: '📋',
    label: 'Scan a Recipe',
    desc: 'Turn any recipe into guided steps',
    href: '/see-it-cook-it?mode=recipe',
    color: 'bg-accent',
  },
];

export default function SearchSection() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      Analytics.searchSubmit(query.trim(), 'homepage');
      router.push(`/recipes?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="section-cream py-16 lg:py-20 relative overflow-hidden" aria-label="Search and Chef Pepe actions">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 blob-green opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 blob-orange opacity-20 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Search bar */}
        <div className="text-center mb-10 animate-on-scroll">
          <p className="text-muted-foreground text-sm font-semibold uppercase tracking-widest mb-3">Search Chew Network</p>
          <h2 className="text-hero-md font-extrabold text-foreground mb-6">
            What are you hungry for today?
          </h2>
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto" role="search">
            <label htmlFor="main-search" className="sr-only">Search recipes, restaurants, or ask Chef Pepe</label>
            <div className="relative flex items-center">
              <Icon name="MagnifyingGlassIcon" size={20} className="absolute left-5 text-muted-foreground" />
              <input
                id="main-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you hungry for today?"
                className="w-full pl-14 pr-32 py-5 rounded-2xl border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-base font-medium shadow-sm transition-all duration-200"
                aria-label="Search recipes, restaurants, or ask Chef Pepe"
              />
              <button
                type="submit"
                className="absolute right-2 btn-primary py-3 px-5 text-sm"
                aria-label="Search"
              >
                Search
              </button>
            </div>
          </form>

          {/* Example chips */}
          <div className="flex flex-wrap gap-2 justify-center mt-4" role="list" aria-label="Search suggestions">
            {searchExamples.map((ex) => (
              <button
                key={ex}
                onClick={() => setQuery(ex)}
                className="px-4 py-2 rounded-full bg-card border border-border text-foreground/70 text-sm font-medium hover:border-primary hover:text-primary transition-all duration-200"
                role="listitem"
                aria-label={`Search for ${ex}`}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Chef Pepe action panel */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-xl animate-float">🍳</div>
            <div>
              <h3 className="font-bold text-foreground text-lg">Meet Chef Pepe</h3>
              <p className="text-muted-foreground text-sm">Your AI cooking companion. Show him a meal, tell him what ingredients you have, or ask him to guide you one step at a time.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {chefPepeActions.map((action, i) => (
              <Link
                key={action.label}
                href={action.href}
                onClick={() => Analytics.talkToChefPepe('homepage_search_section')}
                className="group relative overflow-hidden bg-card border border-border rounded-2xl p-5 hover:border-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                aria-label={action.label}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  {action.icon}
                </div>
                <p className="font-bold text-foreground text-sm mb-1">{action.label}</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{action.desc}</p>
                <div className="absolute top-4 right-4 text-muted-foreground group-hover:text-primary transition-colors">
                  <Icon name="ArrowUpRightIcon" size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}