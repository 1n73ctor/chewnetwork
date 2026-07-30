'use client';

import React, { useRef, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';


const traits = [
{ icon: '💚', label: 'Encouraging', desc: 'Celebrates every step forward, never makes you feel judged for your skill level.' },
{ icon: '🌍', label: 'Globally Inspired', desc: 'Draws from cuisines across every continent and culture with respect and curiosity.' },
{ icon: '🧑‍🏫', label: 'Explains the Why', desc: 'Does not just say "do this" — explains why each technique produces better results.' },
{ icon: '🛡️', label: 'Safety-First', desc: 'Always includes food safety reminders, temperature guidance, and allergen awareness.' },
{ icon: '⏳', label: 'Patient', desc: 'Waits until you are ready. Repeats without frustration. Adapts to your pace.' },
{ icon: '🔄', label: 'Adaptive', desc: 'Adjusts complexity, language, and detail based on your experience and preferences.' }];


export default function ChefPepePersonality() {
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
    <section ref={sectionRef} className="section-cream py-16 lg:py-24 overflow-hidden" aria-labelledby="personality-heading">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: image + quote */}
          <div className="scroll-reveal relative">
            <div className="relative rounded-[3rem] rounded-tr-[6rem] overflow-hidden aspect-[4/5] shadow-2xl">
              <AppImage
                src="https://img.rocket.new/generatedImages/rocket_gen_img_1333f5e2a-1772054042855.png"
                alt="Warm close-up of a professional chef tasting from a wooden spoon in a well-lit kitchen, genuine smile, relaxed and approachable atmosphere"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw" />
              
              <div className="absolute inset-0 bg-gradient-to-t from-dark-panel/50 to-transparent" />
            </div>

            {/* Floating quote */}
            <div className="absolute bottom-8 -right-4 lg:-right-8 bg-card rounded-2xl shadow-xl p-5 max-w-xs animate-float">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🍳</span>
                <span className="text-foreground font-bold text-sm">Chef Pepe</span>
              </div>
              <p className="text-foreground/80 text-sm italic leading-relaxed">
                "Every great cook started by burning something. That is how you learn the stove."
              </p>
            </div>
          </div>

          {/* Right: traits */}
          <div className="scroll-reveal">
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-3 block">Personality</span>
            <h2 id="personality-heading" className="text-hero-md font-extrabold text-foreground mb-4">
              A chef who teaches without judging.
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-md">
              Chef Pepe is encouraging, curious, patient, globally inspired, and serious about food safety. He explains the "why," celebrates progress, and adapts to the cook's experience.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {traits?.map((trait, i) =>
              <div
                key={trait?.label}
                className="flex items-start gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-all duration-200"
                style={{ animationDelay: `${i * 0.08}s` }}>
                
                  <span className="text-xl shrink-0">{trait?.icon}</span>
                  <div>
                    <p className="font-bold text-foreground text-sm mb-0.5">{trait?.label}</p>
                    <p className="text-muted-foreground text-xs leading-relaxed">{trait?.desc}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>);

}