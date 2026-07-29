'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { Analytics } from '@/lib/analytics';

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const { clientX, clientY, currentTarget } = e;
      const target = currentTarget as HTMLElement;
      const { width, height } = target.getBoundingClientRect();
      const xPct = (clientX / width - 0.5) * 2;
      const yPct = (clientY / height - 0.5) * 2;
      const floatingCard = heroRef.current.querySelector('.floating-card') as HTMLElement;
      if (floatingCard) {
        floatingCard.style.transform = `translate(${xPct * 8}px, ${yPct * 6}px)`;
      }
    };
    const el = heroRef.current;
    if (el) {
      el.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (el) el.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen overflow-hidden bg-foreground flex flex-col justify-end"
      aria-label="Hero section">
      
      {/* Background food image */}
      <div className="absolute inset-0 z-0">
        <AppImage
          src="https://img.rocket.new/generatedImages/rocket_gen_img_1b9d28c10-1772540474138.png"
          alt="Vibrant overhead spread of colorful gourmet dishes, fresh ingredients, and beautifully plated food on a dark wooden table"
          fill
          priority
          className="object-cover opacity-60 animate-cinematic"
          sizes="100vw" />
        {/* Gradient scrim — dark at bottom for white text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
      </div>

      {/* Grid lines decoration */}
      <div className="absolute inset-0 z-0 flex justify-between px-6 lg:px-12 pointer-events-none opacity-10">
        <div className="w-px h-full bg-white/30" />
        <div className="w-px h-full bg-white/30 hidden md:block" />
        <div className="w-px h-full bg-white/30 hidden md:block" />
        <div className="w-px h-full bg-white/30" />
      </div>

      {/* Floating Chef Pepe card — top right */}
      <div className="absolute top-24 right-6 lg:right-16 z-20 hidden md:block floating-card transition-transform duration-700 ease-out">
        <div className="relative overflow-hidden bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 w-72 shadow-2xl animate-slide-up opacity-0 delay-2000">
          {/* Shimmer */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/8 to-transparent pointer-events-none animate-shimmer" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white text-lg animate-float">
                🍳
              </div>
              <div>
                <p className="text-white font-bold text-sm">Chef Pepe</p>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-white/60 text-xs">Online now</span>
                </div>
              </div>
            </div>
            {/* Speech bubble */}
            <div className="bg-white/15 rounded-2xl rounded-tl-sm p-4 mb-4">
              <p className="text-white text-sm leading-relaxed font-medium">
                Hey! What are we cooking today? 👨‍🍳
              </p>
            </div>
            {/* Waveform */}
            <div className="flex items-center gap-1 justify-center">
              {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((_, i) =>
              <div
                key={i}
                className={`w-1 rounded-full bg-accent wave-bar-${i % 5 + 1}`}
                style={{ height: '8px' }} />

              )}
            </div>
          </div>
        </div>
      </div>

      {/* Live indicator — top left */}
      <div className="absolute top-24 left-6 lg:left-16 z-20 hidden lg:block animate-slide-up opacity-0 delay-1500">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/90 text-xs font-mono uppercase tracking-wider">Food + Technology + Community</span>
        </div>
      </div>

      {/* Hero content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pb-20 lg:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        {/* Left column — main copy */}
        <div className="lg:col-span-7">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6 animate-slide-up opacity-0 delay-500">
            <span className="h-px w-8 bg-accent" />
            <span className="text-accent text-xs font-bold uppercase tracking-widest">Food + Technology + Community</span>
          </div>

          {/* Main headline */}
          <h1 className="font-extrabold text-white mb-6 leading-tight">
            <span className="block text-hero-xl animate-slide-up opacity-0 delay-700">Welcome to the</span>
            <span className="block text-hero-xl animate-slide-up opacity-0 delay-800">Future Home</span>
            <span className="block text-hero-xl animate-slide-up opacity-0 delay-1000 text-accent">of Food.</span>
          </h1>

          {/* Paragraph */}
          <p className="text-white/80 text-lg lg:text-xl leading-relaxed max-w-xl mb-8 font-medium animate-slide-up opacity-0 delay-1200">
            Discover what to cook, learn with Chef Pepe, share your recipes, find restaurants, and build a food brand — all inside one connected network.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 animate-slide-up opacity-0 delay-1500">
            <Link href="/see-it-cook-it" onClick={() => Analytics.heroTrySeeItCookIt()} className="btn-primary text-base px-8 py-4">
              <Icon name="CameraIcon" size={20} />
              Try See It. Cook It.
            </Link>
            <Link href="/chef-pepe" onClick={() => Analytics.heroMeetChefPepe()} className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:bg-white/25">
              <span>👨‍🍳</span>
              Meet Chef Pepe
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-8 mt-10 animate-slide-up opacity-0 delay-2000">
            {[
            { value: '500+', label: 'Recipes' },
            { value: '50+', label: 'Creators' },
            { value: '100+', label: 'Restaurants' }].
            map((stat) =>
            <div key={stat.label} className="flex flex-col">
                <span className="text-white font-extrabold text-2xl">{stat.value}</span>
                <span className="text-white/50 text-xs uppercase tracking-wider font-medium">{stat.label}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right column — phone mockup (desktop) */}
        <div className="lg:col-span-5 hidden lg:flex justify-end items-end pb-4 animate-slide-up opacity-0 delay-1200">
          <div className="relative">
            {/* Phone frame */}
            <div className="w-64 h-[480px] bg-foreground border-4 border-white/20 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
              <AppImage
                src="https://images.unsplash.com/photo-1728289114485-b03aa8ddf584"
                alt="Chef Pepe AI analyzing a colorful meal bowl — phone screen showing ingredient identification overlay with green scanning lines"
                fill
                className="object-cover"
                sizes="256px" />
              
              {/* Scan overlay */}
              <div className="absolute inset-0 flex flex-col justify-between p-4">
                <div className="flex justify-between items-start">
                  <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
                    <span className="text-white text-xs font-bold">Chef Pepe</span>
                  </div>
                  <div className="flex gap-1 items-center bg-accent/90 rounded-full px-2 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="text-white text-xs font-bold">Scanning</span>
                  </div>
                </div>
                {/* Scan lines */}
                <div className="absolute inset-8 border-2 border-primary/60 rounded-2xl" />
                <div className="absolute inset-8 border border-primary/30 rounded-2xl" style={{ inset: '2.5rem' }} />
                <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-3">
                  <p className="text-white/60 text-xs mb-1">Identified:</p>
                  <p className="text-white font-bold text-sm">Avocado Buddha Bowl</p>
                  <p className="text-primary text-xs mt-1">3 substitutions available →</p>
                </div>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -left-8 top-1/2 bg-white rounded-2xl shadow-xl p-3 animate-float">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🥑</span>
                <div>
                  <p className="text-foreground font-bold text-xs">Recipe found!</p>
                  <p className="text-muted-foreground text-xs">12 ingredients</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-slide-up opacity-0 delay-2000">
        <span className="text-white/40 text-xs uppercase tracking-widest font-mono">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>);

}