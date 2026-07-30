'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function SignupCTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section ref={sectionRef} className="relative py-20 lg:py-28 overflow-hidden bg-[#1a1f1b]" aria-labelledby="cta-heading">
      {/* Background food image */}
      <div className="absolute inset-0 z-0">
        <AppImage
          src="https://img.rocket.new/generatedImages/rocket_gen_img_173238325-1767931448948.png"
          alt="Friends and family gathered around a large table covered with diverse dishes, laughing and sharing food, warm evening light, genuine connection"
          fill
          className="object-cover opacity-20"
          sizes="100vw" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-dark-panel via-dark-panel/80 to-dark-panel/60" />
      </div>

      {/* Background blobs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 blob-green opacity-15 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-60 h-60 blob-orange opacity-15 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8 text-center">
        <div className="scroll-reveal opacity-1">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 animate-float">
            🍳
          </div>
          <h2 id="cta-heading" className="text-hero-lg font-extrabold text-white mb-4">
            Come hungry.<br />Leave inspired.
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            Join Chew Network and be among the first to cook, create, share, and build with us.
          </p>

          {!submitted ?
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6" role="form" aria-label="Email signup form">
              <div className="flex-1">
                <label htmlFor="cta-email" className="sr-only">Email address</label>
                <input
                id="cta-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary text-sm font-medium backdrop-blur-sm transition-all"
                aria-required="true" />
              
              </div>
              <button type="submit" className="btn-primary px-6 py-4 shrink-0 justify-center">
                Join Chew
                <Icon name="ArrowRightIcon" size={16} />
              </button>
            </form> :

          <div className="bg-white/10 border border-white/20 rounded-2xl px-8 py-6 max-w-md mx-auto mb-6 backdrop-blur-sm">
              <div className="text-3xl mb-2">🎉</div>
              <p className="text-white font-bold text-lg mb-1">You're in!</p>
              <p className="text-white/70 text-sm">We'll use your email to guide you to the right part of Chew Network and keep you updated on the products you selected.</p>
            </div>
          }

          <p className="text-white/40 text-xs mb-8">
            No spam. Unsubscribe anytime. By joining you agree to our{' '}
            <Link href="/terms" className="underline hover:text-white/70">Terms</Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:text-white/70">Privacy Policy</Link>.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/see-it-cook-it" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors">
              <Icon name="CameraIcon" size={16} />
              Try See It. Cook It.
            </Link>
            <span className="text-white/20">·</span>
            <Link href="/chef-pepe" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors">
              <span>🍳</span>
              Meet Chef Pepe
            </Link>
            <span className="text-white/20">·</span>
            <Link href="/creators" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors">
              <Icon name="SparklesIcon" size={16} />
              Become a Creator
            </Link>
          </div>
        </div>
      </div>
    </section>);

}