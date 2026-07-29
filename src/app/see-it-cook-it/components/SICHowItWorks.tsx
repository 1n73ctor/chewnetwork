'use client';

import React, { useRef, useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const steps = [
  {
    number: '01',
    icon: '📸',
    heading: 'Show Chef Pepe',
    text: 'Take a picture or upload an image of any meal, ingredient collection, or recipe.',
    detail: [
      'Camera upload or file picker',
      'Drag and drop supported',
      'Works with any cuisine or dish type',
    ],
    color: 'bg-primary',
    borderColor: 'border-primary',
  },
  {
    number: '02',
    icon: '📋',
    heading: 'Review the Plan',
    text: 'Confirm the dish, ingredients, substitutions, and difficulty level before starting.',
    detail: [
      'Chef Pepe shows what he identified',
      'Swap ingredients you do not have',
      'Adjust servings before you begin',
    ],
    color: 'bg-accent',
    borderColor: 'border-accent',
  },
  {
    number: '03',
    icon: '🍳',
    heading: 'Start Cooking',
    text: 'Follow visual step-by-step instructions or cook completely hands-free with voice guidance.',
    detail: [
      'Step-by-step visual instructions',
      'Voice mode: hands-free cooking',
      'Ask questions at any step',
    ],
    color: 'bg-primary',
    borderColor: 'border-primary',
  },
];

export default function SICHowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);

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
    <section ref={sectionRef} className="bg-background py-16 lg:py-24" aria-labelledby="how-it-works-heading">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14 scroll-reveal opacity-1">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-3 px-3 py-1 bg-muted rounded-full">How It Works</span>
          <h2 id="how-it-works-heading" className="text-hero-md font-extrabold text-foreground mb-4">
            From picture to plate in three steps.
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            No complicated setup. No account required to try. Just show Chef Pepe what you have.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {steps?.map((step, i) => (
            <div
              key={step?.number}
              className={`scroll-reveal opacity-1 group relative border-2 rounded-3xl p-8 cursor-pointer transition-all duration-300 ${
                activeStep === i
                  ? `${step?.borderColor} bg-muted shadow-lg`
                  : 'border-border bg-white hover:border-primary/30 hover:shadow-md'
              }`}
              style={{ animationDelay: `${i * 0.15}s` }}
              onClick={() => setActiveStep(i)}
              role="button"
              tabIndex={0}
              aria-pressed={activeStep === i}
              onKeyDown={(e) => e?.key === 'Enter' && setActiveStep(i)}
            >
              {/* Step number */}
              <div className="flex items-center gap-3 mb-5">
                <span className={`${step?.color} text-white text-xs font-bold px-3 py-1 rounded-full`}>{step?.number}</span>
                {activeStep === i && (
                  <div className="flex items-center gap-1 text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-semibold">Active</span>
                  </div>
                )}
              </div>

              <div className={`${step?.color} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 group-hover:scale-105 transition-transform duration-300`}>
                {step?.icon}
              </div>

              <h3 className="font-extrabold text-foreground text-xl mb-3">{step?.heading}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">{step?.text}</p>

              <ul className="space-y-2">
                {step?.detail?.map((d) => (
                  <li key={d} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon name="CheckCircleIcon" size={14} className="text-primary shrink-0" variant="solid" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Connector line (desktop) */}
        <div className="hidden lg:flex items-center justify-center gap-0 -mt-4 mb-10 px-20 scroll-reveal opacity-1">
          {[0, 1]?.map((i) => (
            <React.Fragment key={i}>
              <div className="flex-1 h-px bg-border" />
              <div className="w-2 h-2 rounded-full bg-primary mx-2" />
            </React.Fragment>
          ))}
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Accuracy note */}
        <div className="scroll-reveal opacity-1 bg-secondary border border-border rounded-2xl p-6 flex gap-4 items-start">
          <div className="shrink-0 w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
            <Icon name="InformationCircleIcon" size={20} className="text-accent" />
          </div>
          <div>
            <p className="font-bold text-foreground text-sm mb-1">A note on accuracy</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Chef Pepe provides helpful cooking guidance, but image recognition and recipe estimates may not be exact. Users should review ingredients, allergies, food safety, and cooking temperatures before proceeding. Always confirm with a qualified professional for dietary, medical, or allergy-related decisions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}