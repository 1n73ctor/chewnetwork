'use client';

import React, { useRef, useEffect } from 'react';


const benefits = [
  {
    icon: '🌍',
    title: 'Every cuisine, every skill level',
    desc: 'From beginner grilled cheese to advanced French sauces — Chef Pepe adjusts his guidance to match your experience.',
  },
  {
    icon: '♻️',
    title: 'Use what you already have',
    desc: 'No more wasted groceries. Show your fridge or pantry and get realistic meal ideas built around existing ingredients.',
  },
  {
    icon: '🔄',
    title: 'Smart substitutions',
    desc: 'Missing an ingredient? Chef Pepe suggests practical swaps that preserve the dish\'s flavor and texture.',
  },
  {
    icon: '👨‍👩‍👧',
    title: 'Cook for any group size',
    desc: 'Adjust portions up or down instantly. Chef Pepe recalculates every ingredient automatically.',
  },
  {
    icon: '🎙️',
    title: 'Truly hands-free',
    desc: 'Keep your hands in the dough, not on your phone. Voice commands let you move through recipes without touching the screen.',
  },
  {
    icon: '🛡️',
    title: 'Safety-first guidance',
    desc: 'Chef Pepe includes food safety reminders, temperature guides, and allergen flagging throughout every recipe.',
  },
];

export default function SICBenefits() {
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
    <section ref={sectionRef} className="section-cream py-16 lg:py-24" aria-labelledby="benefits-heading">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14 scroll-reveal opacity-1">
          <h2 id="benefits-heading" className="text-hero-md font-extrabold text-foreground mb-4">
            Useful every day — and for the meals you never forgot.
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Restaurant recreations · Weeknight meals · Family recipes · Leftover ingredients · Cooking lessons · Meal planning
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits?.map((b, i) => (
            <div
              key={b?.title}
              className="scroll-reveal opacity-1 group bg-white border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-md transition-all duration-300"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="text-3xl mb-4">{b?.icon}</div>
              <h3 className="font-bold text-foreground text-base mb-2 leading-snug">{b?.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{b?.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}