'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const challengeEntries = [
{
  id: 1,
  creator: 'Amara Osei',
  dish: 'Smash Burger with Caramelized Onions',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_10302578c-1772227279977.png",
  imageAlt: 'Smash burger with gooey melted cheese and caramelized onions on brioche bun, overhead dramatic lighting',
  votes: 342,
  flag: '🇬🇭'
},
{
  id: 2,
  creator: 'Kenji Watanabe',
  dish: 'Teriyaki Burger with Pickled Daikon',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_129449eb9-1770195599544.png",
  imageAlt: 'Teriyaki burger with pickled daikon and sesame seeds on dark plate, Japanese fusion style',
  votes: 289,
  flag: '🇯🇵'
},
{
  id: 3,
  creator: 'Isabella Torres',
  dish: 'Chorizo Burger with Chipotle Mayo',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1e5807691-1773115141538.png",
  imageAlt: 'Chorizo burger with bright red chipotle mayo dripping, fresh avocado slices and crispy tortilla strips',
  votes: 267,
  flag: '🇲🇽'
}];


export default function ChallengeSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate-in-view');
        });
      },
      { threshold: 0.1 }
    );
    const elements = sectionRef?.current?.querySelectorAll('.scroll-reveal');
    elements?.forEach((el) => observer?.observe(el));
    return () => observer?.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="section-cream py-16 lg:py-24 overflow-hidden" aria-labelledby="challenge-heading">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Challenge info */}
          <div className="scroll-reveal opacity-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">This Week on Chew</span>
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs text-muted-foreground font-medium">Live Challenge</span>
            </div>
            <h2 id="challenge-heading" className="text-hero-md font-extrabold text-foreground mb-4">
              The Perfect Burger Challenge 🍔
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-6 max-w-md">
              Cook it your way. Share your creation. Let the community choose the favorites. Build your best burger, tell us what makes it special, and share your final plate.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="bg-card border border-border rounded-2xl px-5 py-3">
                <p className="text-xs text-muted-foreground font-medium mb-0.5">Entries</p>
                <p className="text-foreground font-extrabold text-xl">1,247</p>
              </div>
              <div className="bg-card border border-border rounded-2xl px-5 py-3">
                <p className="text-xs text-muted-foreground font-medium mb-0.5">Days Left</p>
                <p className="text-foreground font-extrabold text-xl">4</p>
              </div>
              <div className="bg-card border border-border rounded-2xl px-5 py-3">
                <p className="text-xs text-muted-foreground font-medium mb-0.5">Countries</p>
                <p className="text-foreground font-extrabold text-xl">38</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/community#challenges" className="btn-primary">
                <Icon name="TrophyIcon" size={18} />
                Join the Challenge
              </Link>
              <Link href="/community" className="btn-secondary">
                View All Entries
              </Link>
            </div>
          </div>

          {/* Right: Challenge entries */}
          <div className="space-y-4">
            {challengeEntries?.map((entry, i) =>
            <div
              key={entry?.id}
              className="scroll-reveal opacity-1 group bg-card border border-border rounded-2xl overflow-hidden flex gap-0 hover:border-primary/40 hover:shadow-md transition-all duration-300"
              style={{ animationDelay: `${i * 0.12}s` }}>
              
                {/* Rank badge */}
                <div className={`shrink-0 w-12 flex items-center justify-center font-extrabold text-lg ${i === 0 ? 'bg-accent text-white' : 'bg-muted text-muted-foreground'}`}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                </div>
                {/* Image */}
                <div className="relative w-24 h-24 shrink-0">
                  <AppImage
                  src={entry?.image}
                  alt={entry?.imageAlt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="96px" />
                
                </div>
                {/* Content */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <p className="font-bold text-foreground text-sm leading-tight mb-1">{entry?.dish}</p>
                    <div className="flex items-center gap-1.5">
                      <span>{entry?.flag}</span>
                      <span className="text-muted-foreground text-xs">{entry?.creator}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Icon name="HeartIcon" size={12} className="text-accent" />
                    <span className="font-semibold text-foreground">{entry?.votes}</span>
                    <span>votes</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

}