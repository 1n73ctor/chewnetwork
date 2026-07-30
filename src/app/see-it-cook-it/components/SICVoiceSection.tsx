'use client';

import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

const voiceSteps = [
  { icon: '🔊', text: 'Dice the onion into small, even pieces — about half a centimeter each.' },
  { icon: '⏳', text: 'Heat two tablespoons of olive oil in a pan over medium heat.' },
  { icon: '✅', text: 'Add the onion and cook for five minutes, stirring occasionally.' },
];

export default function SICVoiceSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate-in-view');
        });
      },
      { threshold: 0.1 }
    );
    const elements = sectionRef.current?.querySelectorAll('.scroll-reveal');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handlePlay = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= voiceSteps.length - 1) {
          setIsPlaying(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev + 1;
      });
    }, 2500);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} id="voice-demo" className="bg-dark-panel py-16 lg:py-24 overflow-hidden" aria-labelledby="voice-heading">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div className="scroll-reveal opacity-1">
            <span className="text-xs font-bold uppercase tracking-widest text-accent mb-3 block">Voice Mode</span>
            <h2 id="voice-heading" className="text-hero-md font-extrabold text-white mb-5">
              Keep your hands on the food, not the screen.
            </h2>
            <p className="text-white/70 text-base leading-relaxed mb-6 max-w-md">
              Chef Pepe can read each step, wait until you are ready, repeat instructions, answer questions, adjust portions, and help when something does not look right.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Reads instructions aloud at your pace',
                '"Next step" or "Repeat that" voice commands',
                'Answers mid-cook questions',
                'Adjusts quantities on the fly',
                'Captions and transcripts always available',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-white/80 text-sm">
                  <Icon name="CheckCircleIcon" size={16} className="text-primary shrink-0" variant="solid" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: voice demo UI */}
          <div className="scroll-reveal opacity-1">
            <div className="relative bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
              {/* Shimmer */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/4 to-transparent animate-shimmer" />
              </div>

              <div className="relative z-10">
                {/* Chef Pepe avatar + waveform */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-3xl">
                      🍳
                    </div>
                    {isPlaying && (
                      <div className="absolute -inset-1 rounded-2xl border-2 border-primary animate-pulse-ring" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-bold">Chef Pepe</p>
                    <p className="text-white/50 text-sm">{isPlaying ? 'Speaking...' : 'Ready to guide you'}</p>
                    {/* Waveform */}
                    <div className="flex items-center gap-0.5 mt-2 h-6">
                      {isPlaying ? (
                        [1,2,3,4,5,4,3,2,1].map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 rounded-full bg-primary wave-bar-${(i % 5) + 1}`}
                            style={{ height: '8px' }}
                          />
                        ))
                      ) : (
                        [1,2,3,4,5,4,3,2,1].map((_, i) => (
                          <div key={i} className="w-1 rounded-full bg-white/20" style={{ height: '4px' }} />
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Step display */}
                <div className="space-y-3 mb-8">
                  {voiceSteps.map((step, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 p-4 rounded-2xl transition-all duration-500 ${
                        isPlaying && currentStep === i
                          ? 'bg-primary/20 border border-primary/40'
                          : isPlaying && currentStep > i
                          ? 'bg-white/5 opacity-50' :'bg-white/5'
                      }`}
                    >
                      <span className="text-lg shrink-0">{step.icon}</span>
                      <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                        isPlaying && currentStep === i ? 'text-white' : 'text-white/60'
                      }`}>
                        {step.text}
                      </p>
                      {isPlaying && currentStep === i && (
                        <div className="shrink-0 flex gap-0.5 items-end mt-1">
                          {[1,2,3].map((b) => (
                            <div key={b} className={`w-0.5 rounded-full bg-primary wave-bar-${b}`} style={{ height: '6px' }} />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={isPlaying ? handleStop : handlePlay}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-sm transition-all duration-300 ${
                      isPlaying
                        ? 'bg-white/10 text-white hover:bg-white/20' :'bg-primary text-white hover:bg-primary/90'
                    }`}
                    aria-label={isPlaying ? 'Stop voice demo' : 'Play voice demo'}
                  >
                    <Icon name={isPlaying ? 'StopIcon' : 'PlayIcon'} size={20} variant="solid" />
                    {isPlaying ? 'Stop Demo' : 'Play Voice Demo'}
                  </button>
                  {isPlaying && (
                    <button
                      className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-all"
                      aria-label="Repeat current step"
                    >
                      <Icon name="ArrowPathIcon" size={18} />
                    </button>
                  )}
                </div>

                <p className="text-white/30 text-xs text-center mt-4">
                  Captions and transcripts are always available. Voice demo for illustration purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}