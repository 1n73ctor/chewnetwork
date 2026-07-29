'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function SICFinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate-in-view');
        });
      },
      { threshold: 0.15 }
    );
    const elements = sectionRef.current?.querySelectorAll('.scroll-reveal');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section ref={sectionRef} className="bg-background py-16 lg:py-24" aria-labelledby="sic-cta-heading">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
        <div className="scroll-reveal opacity-1">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center text-4xl mx-auto mb-8 animate-float">
            🍽️
          </div>
          <h2 id="sic-cta-heading" className="text-hero-md font-extrabold text-foreground mb-4">
            Your next meal may already be in front of you.
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-lg mx-auto">
            Join early access and be first to try the full See It. Cook It. experience — with voice mode, image recognition, and Chef Pepe guidance.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6" aria-label="Early access signup">
              <div className="flex-1">
                <label htmlFor="sic-email" className="sr-only">Email address</label>
                <input
                  id="sic-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm font-medium transition-all"
                  aria-required="true"
                />
              </div>
              <button type="submit" className="btn-primary px-6 py-4 shrink-0 justify-center">
                Join Early Access
                <Icon name="ArrowRightIcon" size={16} />
              </button>
            </form>
          ) : (
            <div className="bg-muted border border-border rounded-2xl px-8 py-6 max-w-md mx-auto mb-6">
              <div className="text-3xl mb-2">🎉</div>
              <p className="text-foreground font-bold text-lg mb-1">You're on the list!</p>
              <p className="text-muted-foreground text-sm">We'll reach out as soon as See It. Cook It. is ready for you.</p>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Link href="/chef-pepe" className="btn-secondary text-sm px-5 py-2.5">
              <span>🍳</span>
              Meet Chef Pepe
            </Link>
            <Link href="/recipes" className="btn-secondary text-sm px-5 py-2.5">
              <Icon name="BookOpenIcon" size={16} />
              Browse Recipes
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}