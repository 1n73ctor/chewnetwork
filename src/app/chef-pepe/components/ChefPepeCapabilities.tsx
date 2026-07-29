'use client';

import React, { useRef, useEffect } from 'react';


// BENTO GRID AUDIT
// Array has 6 cards: [Plan, Teach, Guide, Fix, Adjust, ShoppingList]
// Row 1: [col-1: Plan cs-1] [col-2: Teach cs-1] [col-3: Guide cs-1]
// Row 2: [col-1: Fix cs-1] [col-2: Adjust cs-1] [col-3: ShoppingList cs-1]
// Placed 6/6 cards ✓

const capabilities = [
  {
    icon: '🗓️',
    label: 'Plan a Meal',
    example: '"Give me three dinners using chicken, rice, and broccoli."',
    desc: 'Chef Pepe builds full meal plans around your ingredients, preferences, and schedule.',
    color: 'border-primary/30 hover:border-primary bg-white',
    iconBg: 'bg-primary/10',
  },
  {
    icon: '🎓',
    label: 'Teach a Technique',
    example: '"How do I know when my steak is medium-rare?"',
    desc: 'From knife skills to sauce emulsification — Chef Pepe explains the why, not just the how.',
    color: 'border-accent/30 hover:border-accent bg-white',
    iconBg: 'bg-accent/10',
  },
  {
    icon: '📖',
    label: 'Guide a Recipe',
    example: '"Read the next step when I say ready."',
    desc: 'Step-by-step voice or text guidance. Chef Pepe waits for you at every stage.',
    color: 'border-primary/30 hover:border-primary bg-white',
    iconBg: 'bg-primary/10',
  },
  {
    icon: '🔧',
    label: 'Fix a Problem',
    example: '"My sauce is too salty. What can I do?"',
    desc: 'Real-time troubleshooting for common cooking mistakes and unexpected results.',
    color: 'border-accent/30 hover:border-accent bg-white',
    iconBg: 'bg-accent/10',
  },
  {
    icon: '⚖️',
    label: 'Adjust a Recipe',
    example: '"Make this recipe serve eight people."',
    desc: 'Instantly scale any recipe up or down. Ingredient quantities recalculate automatically.',
    color: 'border-primary/30 hover:border-primary bg-white',
    iconBg: 'bg-primary/10',
  },
  {
    icon: '🛒',
    label: 'Build a Shopping List',
    example: '"Organize everything I need by grocery aisle."',
    desc: 'Chef Pepe compiles your ingredients and organizes them for an efficient shopping trip.',
    color: 'border-accent/30 hover:border-accent bg-white',
    iconBg: 'bg-accent/10',
  },
];

export default function ChefPepeCapabilities() {
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
    <section ref={sectionRef} className="bg-background py-16 lg:py-24" aria-labelledby="capabilities-heading">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14 scroll-reveal">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-3 px-3 py-1 bg-muted rounded-full">What Chef Pepe Can Do</span>
          <h2 id="capabilities-heading" className="text-hero-md font-extrabold text-foreground mb-4">
            Ask Chef Pepe to...
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            From quick questions to complete cooking sessions — Chef Pepe adapts to what you need right now.
          </p>
        </div>

        {/* 6-card grid: 3 cols × 2 rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* [col-1: Plan cs-1] */}
          {/* [col-2: Teach cs-1] */}
          {/* [col-3: Guide cs-1] */}
          {/* [col-1: Fix cs-1] */}
          {/* [col-2: Adjust cs-1] */}
          {/* [col-3: ShoppingList cs-1] */}
          {capabilities?.map((cap, i) => (
            <div
              key={cap?.label}
              className={`scroll-reveal group ${cap?.color} border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={`${cap?.iconBg} w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {cap?.icon}
              </div>
              <h3 className="font-extrabold text-foreground text-base mb-2">{cap?.label}</h3>
              <p className="text-muted-foreground text-xs italic mb-3 leading-relaxed border-l-2 border-muted pl-3">{cap?.example}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">{cap?.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}