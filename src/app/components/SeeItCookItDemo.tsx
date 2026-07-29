'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const steps = [
{
  number: '01',
  icon: '📸',
  heading: 'Show Chef Pepe',
  text: 'Take a picture or upload an image of any meal, ingredient, or recipe.',
  color: 'bg-primary'
},
{
  number: '02',
  icon: '📋',
  heading: 'Review the Plan',
  text: 'Confirm the dish, ingredients, substitutions, and difficulty level.',
  color: 'bg-accent'
},
{
  number: '03',
  icon: '🍳',
  heading: 'Start Cooking',
  text: 'Follow visual instructions or cook hands-free with voice guidance from Chef Pepe.',
  color: 'bg-primary'
}];


const useCases = [
'Restaurant recreations',
'Weeknight meals',
'Family recipes',
'Leftover ingredients',
'Cooking lessons',
'Meal planning'];


export default function SeeItCookItDemo() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in-view');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -5% 0px' }
    );
    const elements = sectionRef?.current?.querySelectorAll('.scroll-reveal');
    elements?.forEach((el) => observer?.observe(el));
    return () => observer?.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="bg-background py-16 lg:py-24 overflow-hidden" aria-labelledby="see-it-cook-it-heading">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 scroll-reveal opacity-1">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-3 px-3 py-1 bg-muted rounded-full">THE FRONT DOOR TO CHEW NETWORK</span>
          <h2 id="see-it-cook-it-heading" className="text-hero-lg font-extrabold text-foreground mb-4">
            See it. Understand it. Cook it.
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Take a picture of a meal, ingredients, or a recipe. Chef Pepe helps identify it, organize what you need, and guide you through the cooking process.
          </p>
        </div>

        {/* Main demo layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
          {/* Left: Phone mockup / demo visual */}
          <div className="scroll-reveal opacity-1 relative flex justify-center">
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 blob-green opacity-40 scale-110" />
              {/* Phone */}
              <div className="relative w-72 lg:w-80 bg-foreground rounded-[3rem] border-4 border-foreground/80 overflow-hidden shadow-2xl">
                <div className="relative h-[520px]">
                  <AppImage
                    src="https://img.rocket.new/generatedImages/rocket_gen_img_1da6bf0c1-1785264827580.png"
                    alt="Close-up pizza with colorful toppings being analyzed by Chef Pepe AI — green scanning overlay with ingredient labels appearing around each topping"
                    fill
                    className="object-cover transition-opacity duration-500"
                    sizes="320px" />
                  
                  {/* UI overlay */}
                  <div className="absolute inset-0 flex flex-col justify-between p-5">
                    {/* Top bar */}
                    <div className="flex justify-between items-center">
                      <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2">
                        <span className="text-sm">🍳</span>
                        <span className="text-white text-xs font-bold">Chef Pepe</span>
                      </div>
                      <div className="bg-primary/90 rounded-full px-3 py-1.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span className="text-white text-xs font-bold">
                          {activeStep === 0 ? 'Scanning...' : activeStep === 1 ? 'Identified!' : 'Ready to cook'}
                        </span>
                      </div>
                    </div>
                    {/* Scan frame */}
                    <div className="absolute inset-10 border-2 border-primary/70 rounded-2xl pointer-events-none">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl-sm" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr-sm" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl-sm" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br-sm" />
                    </div>
                    {/* Bottom result */}
                    <div className="bg-black/75 backdrop-blur-sm rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-primary text-sm font-bold">
                          {activeStep === 0 ? 'Analyzing image...' : activeStep === 1 ? '✓ Identified:' : '✓ Plan ready:'}
                        </span>
                      </div>
                      <p className="text-white font-bold text-base">
                        {activeStep === 0 ? 'Neapolitan Margherita Pizza' : activeStep === 1 ? 'Neapolitan Margherita Pizza' : 'Start cooking — 8 steps'}
                      </p>
                      {activeStep >= 1 &&
                      <p className="text-white/60 text-xs mt-1">
                          {activeStep === 1 ? '6 ingredients • 2 substitutions available' : '45 min • Intermediate • Voice mode ready'}
                        </p>
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating ingredient tags */}
              {activeStep >= 1 &&
              <>
                  <div className="absolute -right-4 top-1/3 bg-white rounded-full px-3 py-1.5 shadow-lg flex items-center gap-1.5 animate-slide-up opacity-0">
                    <span className="text-sm">🍅</span>
                    <span className="text-foreground text-xs font-bold">San Marzano</span>
                  </div>
                  <div className="absolute -left-4 top-1/2 bg-white rounded-full px-3 py-1.5 shadow-lg flex items-center gap-1.5 animate-slide-up opacity-0 delay-200">
                    <span className="text-sm">🧀</span>
                    <span className="text-foreground text-xs font-bold">Mozzarella</span>
                  </div>
                </>
              }
            </div>
          </div>

          {/* Right: 3 steps */}
          <div className="space-y-6">
            {steps?.map((step, i) =>
            <div
              key={step?.number}
              className={`scroll-reveal opacity-1 group relative overflow-hidden rounded-2xl border-2 p-6 transition-all duration-500 cursor-default ${
              activeStep === i ?
              'border-primary bg-muted shadow-lg' :
              'border-border bg-white hover:border-primary/50'}`
              }
              style={{ animationDelay: `${i * 0.15}s` }}>
              
                <div className="flex items-start gap-4">
                  <div className={`${step?.color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-transform duration-300 ${activeStep === i ? 'scale-110' : 'group-hover:scale-105'}`}>
                    {step?.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{step?.number}</span>
                      <h3 className="font-bold text-foreground text-base">{step?.heading}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step?.text}</p>
                  </div>
                  {activeStep === i &&
                <div className="shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Icon name="CheckIcon" size={14} className="text-white" />
                    </div>
                }
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Use cases */}
        <div className="scroll-reveal opacity-1 bg-muted rounded-3xl p-8 lg:p-10">
          <h3 className="font-bold text-foreground text-lg mb-2">Useful every day — and for the meals you never forgot.</h3>
          <p className="text-muted-foreground text-sm mb-6">From quick weeknight dinners to recreating that dish you had in Paris.</p>
          <div className="flex flex-wrap gap-3">
            {useCases?.map((uc) =>
            <span key={uc} className="px-4 py-2 bg-white border border-border rounded-full text-foreground text-sm font-medium">
                {uc}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="/see-it-cook-it" className="btn-primary">
              <Icon name="CameraIcon" size={18} />
              Try See It. Cook It.
            </Link>
            <Link href="/chef-pepe#voice-demo" className="btn-secondary">
              <Icon name="MicrophoneIcon" size={18} />
              Hear a Demo
            </Link>
          </div>
        </div>
      </div>
    </section>);

}