'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function ChefPepeCTA() {
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
    const elements = sectionRef?.current?.querySelectorAll('.scroll-reveal');
    elements?.forEach((el) => observer?.observe(el));
    return () => observer?.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-background py-16 lg:py-24" aria-labelledby="pepe-cta-heading">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="scroll-reveal bg-dark-panel rounded-[3rem] overflow-hidden relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 blob-green opacity-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 blob-orange opacity-10 pointer-events-none" />

          <div className="relative z-10 p-10 lg:p-16 text-center">
            <div className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 animate-float">
              🍳
            </div>
            <h2 id="pepe-cta-heading" className="text-hero-md font-extrabold text-white mb-4">
              Say hello. Dinner gets easier from here.
            </h2>
            <p className="text-white/70 text-base leading-relaxed mb-8 max-w-lg mx-auto">
              Whether you are cooking your first meal or your hundredth, Chef Pepe is ready to guide you from picture to plate.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Link href="/chef-pepe#demo" className="btn-accent px-8 py-4 text-base">
                <Icon name="MicrophoneIcon" size={20} />
                Talk to Chef Pepe
              </Link>
              <Link href="/see-it-cook-it" className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-white/10 transition-all duration-300">
                <Icon name="CameraIcon" size={20} />
                Show a Meal
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/recipes" className="text-white/60 hover:text-white transition-colors flex items-center gap-2">
                <Icon name="BookOpenIcon" size={16} />
                Start Cooking
              </Link>
              <span className="text-white/20">·</span>
              <Link href="/join?interest=chef-pepe" className="text-white/60 hover:text-white transition-colors flex items-center gap-2">
                <Icon name="UserPlusIcon" size={16} />
                Join Chew
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}