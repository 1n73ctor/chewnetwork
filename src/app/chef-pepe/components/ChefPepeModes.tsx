'use client';

import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

const modes = [
  {
    id: 'beginner',
    icon: '🌱',
    label: 'Beginner Mode',
    tagline: 'Building confidence one step at a time.',
    desc: 'More explanation, slower steps, and confidence-building reminders. Perfect for first-time cooks or anyone trying a new cuisine.',
    features: [
      'Detailed explanations for every technique',
      'Encouragement at key milestones',
      'Safety reminders at critical steps',
      'Slower pacing with check-ins',
    ],
    color: 'bg-primary',
    selected: true,
  },
  {
    id: 'quick',
    icon: '⚡',
    label: 'Quick Mode',
    tagline: 'Just the essentials, fast.',
    desc: 'Short, direct instructions for people who already know the basics. Get through recipes efficiently without extra explanation.',
    features: [
      'Concise step instructions',
      'Minimal explanatory text',
      'Faster pacing overall',
      'Key reminders only',
    ],
    color: 'bg-accent',
    selected: false,
  },
  {
    id: 'pro',
    icon: '🔬',
    label: 'Pro Mode',
    tagline: 'Deep technique for serious cooks.',
    desc: 'Technique-focused guidance covering timing, ratios, temperature science, and deeper culinary detail for advanced cooks.',
    features: [
      'Temperature and timing precision',
      'Ratios and scaling science',
      'Technique variations and history',
      'Professional kitchen context',
    ],
    color: 'bg-foreground',
    selected: false,
  },
  {
    id: 'family',
    icon: '👨‍👩‍👧',
    label: 'Family Mode',
    tagline: 'Cook together, safely.',
    desc: 'Simple, clear language with age-appropriate participation ideas and adult supervision reminders throughout.',
    features: [
      'Simple, age-appropriate language',
      'Suggested tasks for kids',
      'Adult supervision reminders',
      'Fun food facts along the way',
    ],
    color: 'bg-primary',
    selected: false,
  },
];

export default function ChefPepeModes() {
  const [activeMode, setActiveMode] = useState('beginner');
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

  const active = modes?.find((m) => m?.id === activeMode) || modes?.[0];

  return (
    <section ref={sectionRef} className="bg-foreground py-16 lg:py-24 overflow-hidden" aria-labelledby="modes-heading">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14 scroll-reveal">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent mb-3 px-3 py-1 bg-white/10 rounded-full">Cooking Modes</span>
          <h2 id="modes-heading" className="text-hero-md font-extrabold text-white mb-4">
            Choose how Chef Pepe helps.
          </h2>
          <p className="text-white/60 text-base max-w-xl mx-auto">
            Whether you are cooking your first meal or your hundredth, Chef Pepe adjusts to match your experience and pace.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start scroll-reveal">
          {/* Mode selector */}
          <div className="grid grid-cols-2 gap-4">
            {modes?.map((mode) => (
              <button
                key={mode?.id}
                onClick={() => setActiveMode(mode?.id)}
                className={`group text-left p-5 rounded-2xl border-2 transition-all duration-300 ${
                  activeMode === mode?.id
                    ? 'border-white/40 bg-white/10' :'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                }`}
                aria-pressed={activeMode === mode?.id}
                aria-label={`Select ${mode?.label}`}
              >
                <div className={`${mode?.color} w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform`}>
                  {mode?.icon}
                </div>
                <p className={`font-bold text-sm mb-1 transition-colors ${activeMode === mode?.id ? 'text-white' : 'text-white/70'}`}>
                  {mode?.label}
                </p>
                <p className="text-white/40 text-xs">{mode?.tagline}</p>
                {activeMode === mode?.id && (
                  <div className="mt-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-primary text-xs font-semibold">Active</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Active mode detail */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
            {/* Shimmer */}
            <div className="overflow-hidden absolute inset-0 rounded-3xl pointer-events-none">
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/3 to-transparent animate-shimmer" />
            </div>
            <div className="relative z-10">
              <div className={`${active?.color} w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5`}>
                {active?.icon}
              </div>
              <h3 className="text-white font-extrabold text-xl mb-2">{active?.label}</h3>
              <p className="text-accent text-sm font-semibold mb-4">{active?.tagline}</p>
              <p className="text-white/70 text-sm leading-relaxed mb-6">{active?.desc}</p>
              <ul className="space-y-3">
                {active?.features?.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-white/80 text-sm">
                    <Icon name="CheckCircleIcon" size={16} className="text-primary shrink-0" variant="solid" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className="mt-6 btn-primary w-full justify-center">
                <span>{active?.icon}</span>
                Start in {active?.label}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}