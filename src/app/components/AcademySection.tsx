'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const tracks = [
  { icon: '🎯', title: 'Food Creator Foundations', desc: 'Choose your focus, define your audience, and build a repeatable content plan.' },
  { icon: '📖', title: 'Recipe Development & Publishing', desc: 'Test, write, photograph, structure, and publish recipes people can actually follow.' },
  { icon: '🎬', title: 'Short-Form Food Video', desc: 'Plan, film, edit, caption, and package food videos for discovery.' },
  { icon: '📣', title: 'Audience Growth', desc: 'Build trust, use platforms intentionally, and turn viewers into a community.' },
  { icon: '🤝', title: 'Affiliate & Product Reviews', desc: 'Create useful product content, disclose relationships, and build ethical recommendations.' },
  { icon: '📚', title: 'Cookbooks & Digital Products', desc: 'Organize expertise into guides, classes, collections, and sellable products.' },
];

export default function AcademySection() {
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
    <section ref={sectionRef} className="section-cream py-16 lg:py-24 overflow-hidden" aria-labelledby="academy-heading">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12 scroll-reveal opacity-1">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-3 block">Learn. Create. Grow.</span>
            <h2 id="academy-heading" className="text-hero-lg font-extrabold text-foreground mb-4">
              Learn to build a food audience and business.
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-6 max-w-md">
              Creator Academy teaches the practical work behind food content — from your first recipe post to a complete creator business.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/creator-academy" className="btn-primary">
                <Icon name="AcademicCapIcon" size={18} />
                Explore Creator Academy
              </Link>
              <Link href="/join?interest=academy" className="btn-secondary">
                Join Academy Waitlist
              </Link>
            </div>
          </div>

          {/* Preview stat card */}
          <div className="bg-foreground rounded-3xl p-8 flex flex-col justify-between min-h-[200px] h-full">
            <div>
              <p className="text-accent text-xs font-bold uppercase tracking-widest mb-3">Creator Academy</p>
              <p className="text-white font-extrabold text-2xl mb-2">Start as a food lover.</p>
              <p className="text-white/60 text-sm leading-relaxed">Grow into a food creator.</p>
            </div>
            <div className="flex gap-6 mt-6">
              <div>
                <p className="text-white font-extrabold text-2xl">7</p>
                <p className="text-white/50 text-xs">Learning Tracks</p>
              </div>
              <div>
                <p className="text-white font-extrabold text-2xl">40+</p>
                <p className="text-white/50 text-xs">Lessons Planned</p>
              </div>
              <div>
                <p className="text-white font-extrabold text-2xl">Free</p>
                <p className="text-white/50 text-xs">To Get Started</p>
              </div>
            </div>
          </div>
        </div>

        {/* Track grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tracks?.map((track, i) => (
            <div
              key={track?.title}
              className="scroll-reveal opacity-1 group bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-md transition-all duration-300"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="text-3xl mb-4">{track?.icon}</div>
              <h3 className="font-bold text-foreground text-sm mb-2 leading-snug">{track?.title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{track?.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-primary text-xs font-semibold group-hover:gap-2 transition-all">
                Preview track <Icon name="ArrowRightIcon" size={12} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}