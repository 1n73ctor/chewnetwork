'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const scanStates = [
{ label: 'Ready to scan', status: 'idle' },
{ label: 'Uploading image...', status: 'uploading' },
{ label: 'Chef Pepe is analyzing...', status: 'analyzing' },
{ label: '✓ Dish identified!', status: 'result' }];


export default function SICHero() {
  const [scanState, setScanState] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setScanState((prev) => (prev + 1) % scanStates?.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-dark-panel flex items-center" aria-label="See It. Cook It. hero">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <AppImage
          src="https://images.unsplash.com/photo-1728289114485-b03aa8ddf584"
          alt="Person holding a phone over a colorful meal spread on a kitchen counter, warm natural light, AI scanning overlay visible on screen, dark atmospheric kitchen background"
          fill
          priority
          className="object-cover opacity-30 animate-cinematic"
          sizes="100vw" />
        
        <div className="absolute inset-0 bg-gradient-to-r from-dark-panel/95 via-dark-panel/70 to-dark-panel/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-panel/80 to-transparent" />
      </div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 blob-green opacity-10 pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left: copy */}
        <div>
          <div className="flex items-center gap-3 mb-6 animate-slide-up opacity-0">
            <span className="h-px w-8 bg-accent" />
            <span className="text-accent text-xs font-bold uppercase tracking-widest">The Front Door to Chew Network</span>
          </div>
          <h1 className="font-extrabold text-white mb-6 animate-slide-up opacity-0 delay-200">
            <span className="block text-hero-xl">See it.</span>
            <span className="block text-hero-xl text-primary">Cook it.</span>
          </h1>
          <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-lg font-medium animate-slide-up opacity-0 delay-300">
            Show Chef Pepe a meal, a group of ingredients, or a recipe. He will help you understand what you are looking at and turn it into a cooking plan.
          </p>
          <div className="flex flex-wrap gap-4 mb-8 animate-slide-up opacity-0 delay-400">
            <Link href="/see-it-cook-it?mode=meal" className="btn-primary px-7 py-4 text-base">
              <Icon name="CameraIcon" size={20} />
              Upload a Meal
            </Link>
            <Link href="/chef-pepe#voice-demo" className="inline-flex items-center gap-2 border border-white/30 text-white px-7 py-4 rounded-full font-semibold text-base hover:bg-white/10 transition-all duration-300">
              <Icon name="MicrophoneIcon" size={20} />
              Hear a Demo
            </Link>
          </div>

          {/* Scan status indicator */}
          <div className="animate-slide-up opacity-0 delay-500">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-3">
              <div className={`w-2 h-2 rounded-full ${scanState === 0 ? 'bg-white/40' : scanState === 3 ? 'bg-primary' : 'bg-accent animate-pulse'}`} />
              <span className="text-white/80 text-sm font-medium">{scanStates?.[scanState]?.label}</span>
            </div>
          </div>
        </div>

        {/* Right: interface mockup */}
        <div className="flex justify-center lg:justify-end animate-slide-up opacity-0 delay-300">
          <div className="relative">
            {/* Glow behind phone */}
            <div className="absolute inset-0 blob-green opacity-30 scale-125" />

            {/* Phone */}
            <div className="relative w-72 bg-dark-panel border-4 border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
              <div className="relative h-[560px]">
                <AppImage
                  src="https://img.rocket.new/generatedImages/rocket_gen_img_1b625721b-1785264827921.png"
                  alt="Overhead view of a Neapolitan pizza being identified by Chef Pepe AI — green corner brackets overlay, ingredient labels appearing around toppings, dark phone interface"
                  fill
                  className="object-cover"
                  sizes="288px" />
                
                {/* Overlay UI */}
                <div className="absolute inset-0 flex flex-col justify-between p-5">
                  {/* Top bar */}
                  <div className="flex justify-between items-center">
                    <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2">
                      <span className="text-base">🍳</span>
                      <span className="text-white text-xs font-bold">Chef Pepe</span>
                    </div>
                    <div className={`rounded-full px-3 py-1.5 flex items-center gap-1.5 transition-all duration-500 ${
                    scanState === 3 ? 'bg-primary/90' : scanState === 0 ? 'bg-white/20' : 'bg-accent/90'}`
                    }>
                      <span className={`w-1.5 h-1.5 rounded-full bg-white ${scanState !== 0 ? 'animate-pulse' : ''}`} />
                      <span className="text-white text-xs font-bold">{scanStates?.[scanState]?.label}</span>
                    </div>
                  </div>

                  {/* Scan corners */}
                  <div className="absolute inset-8 pointer-events-none">
                    <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-primary rounded-tl" />
                    <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-primary rounded-tr" />
                    <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-primary rounded-bl" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-primary rounded-br" />
                  </div>

                  {/* Bottom result */}
                  <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-4">
                    {scanState < 3 ?
                    <div className="flex items-center gap-3">
                        <div className="flex gap-0.5 items-end">
                          {[1, 2, 3, 4, 5]?.map((b) =>
                        <div key={b} className={`w-1 rounded-full bg-primary wave-bar-${b}`} style={{ height: '8px' }} />
                        )}
                        </div>
                        <span className="text-white/70 text-sm">{scanStates?.[scanState]?.label}</span>
                      </div> :

                    <>
                        <p className="text-primary text-xs font-bold mb-1">✓ Identified</p>
                        <p className="text-white font-bold text-sm">Neapolitan Margherita Pizza</p>
                        <p className="text-white/60 text-xs mt-1">6 ingredients · 2 substitutions · 45 min</p>
                        <div className="mt-3 flex gap-2">
                          <span className="bg-primary/30 text-primary text-xs px-2 py-1 rounded-full font-semibold">Start Cooking →</span>
                        </div>
                      </>
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -left-10 top-1/3 bg-card rounded-2xl shadow-xl p-3 animate-float">
              <div className="flex items-center gap-2">
                <span className="text-xl">🍅</span>
                <div>
                  <p className="text-foreground font-bold text-xs">San Marzano</p>
                  <p className="text-muted-foreground text-xs">Confirmed</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-8 bottom-1/3 bg-card rounded-2xl shadow-xl p-3" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-2">
                <span className="text-xl">🧀</span>
                <div>
                  <p className="text-foreground font-bold text-xs">Fior di latte</p>
                  <p className="text-primary text-xs">Substitution →</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-slide-up opacity-0 delay-1000">
        <span className="text-white/30 text-xs uppercase tracking-widest font-mono">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>);

}