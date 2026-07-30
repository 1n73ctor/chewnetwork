'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

type MicState = 'idle' | 'requesting' | 'active' | 'denied';

export default function ChefPepeHero() {
  const [inputValue, setInputValue] = useState('');
  const [micState, setMicState] = useState<MicState>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleMicClick = async () => {
    if (micState === 'active') {
      setMicState('idle');
      return;
    }
    setMicState('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Permission granted — stop tracks immediately (demo only)
      stream.getTracks().forEach(t => t.stop());
      setMicState('active');
    } catch {
      setMicState('denied');
    }
  };

  const examplePrompts = [
    'How do I sear a steak?',
    'Substitute for heavy cream?',
    'Quick 20-minute dinners',
    'Meal plan for the week',
  ];

  const micLabel =
    micState === 'requesting' ? 'Requesting microphone…' :
    micState === 'active' ? 'Listening… (tap to stop)' :
    micState === 'denied'? 'Microphone access denied' : 'Talk to Chef Pepe via microphone';

  const micBg =
    micState === 'active' ? 'rgb(var(--primary))' :
    micState === 'denied'? 'rgb(var(--muted-foreground))' : 'rgb(var(--accent))';

  return (
    <section
      className="relative w-full min-h-screen overflow-hidden flex items-center"
      style={{ backgroundColor: 'rgb(var(--secondary))' }}
      aria-label="Chef Pepe hero">
      
      {/* Subtle background blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(191,89,37,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(31,122,90,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">

        {/* Left: Copy + Interaction */}
        <div>
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-8" style={{ backgroundColor: 'rgb(var(--accent))' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgb(var(--accent))' }}>
              Meet Your AI Cooking Companion
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-extrabold mb-6" style={{ color: 'rgb(var(--foreground))' }}>
            <span className="block text-hero-xl">Meet</span>
            <span className="block text-hero-xl" style={{ color: 'rgb(var(--accent))' }}>Chef Pepe.</span>
          </h1>

          {/* Body */}
          <p className="text-lg leading-relaxed mb-8 max-w-lg font-medium" style={{ color: 'rgb(var(--muted-foreground))' }}>
            Friendly enough for your first grilled cheese. Smart enough to help with tonight&apos;s dinner. Patient enough to stay with you step by step.
          </p>

          {/* Chef Pepe greeting bubble */}
          <div
            className="rounded-2xl rounded-tl-sm p-5 mb-6 max-w-sm border"
            style={{ backgroundColor: 'rgb(var(--card))', borderColor: 'rgb(var(--border))', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🍳</span>
              <span className="font-bold text-sm" style={{ color: 'rgb(var(--foreground))' }}>Chef Pepe</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 ml-1" />
            </div>
            <p className="text-base font-medium" style={{ color: 'rgb(var(--foreground))' }}>
              Hey! I&apos;m Chef Pepe. What are we cooking today? 👨‍🍳
            </p>
            {/* Waveform — animated when mic is active */}
            <div className="flex items-end gap-0.5 mt-3 h-5">
              {[4, 8, 14, 10, 18, 12, 8, 16, 6, 10, 14, 8, 4].map((h, i) =>
                <div
                  key={i}
                  className="w-1 rounded-full"
                  style={{
                    height: `${h}px`,
                    backgroundColor: micState === 'active' ? 'rgb(var(--primary))' : 'rgb(var(--accent))',
                    opacity: micState === 'active' ? 0.9 : 0.5,
                    transition: 'background-color 0.3s',
                  }} />
              )}
            </div>
          </div>

          {/* Mic denied notice */}
          {micState === 'denied' && (
            <div className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2 max-w-lg">
              <Icon name="ExclamationCircleIcon" size={16} />
              <span>Microphone access was denied. Please allow access in your browser settings, or type your question below.</span>
            </div>
          )}

          {/* Voice + text prompt input */}
          <div
            className="flex items-center gap-3 rounded-2xl border p-3 mb-4 max-w-lg"
            style={{ backgroundColor: 'rgb(var(--card))', borderColor: micState === 'active' ? 'rgb(var(--primary))' : 'rgb(var(--border))', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', transition: 'border-color 0.3s' }}>
            
            <button
              className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 relative"
              style={{ backgroundColor: micBg }}
              aria-label={micLabel}
              onClick={handleMicClick}
              disabled={micState === 'requesting'}>
              
              {micState === 'requesting' ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : micState === 'active' ? (
                <Icon name="StopIcon" size={18} className="text-white" />
              ) : (
                <Icon name="MicrophoneIcon" size={20} className="text-white" />
              )}
              {micState === 'active' && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              )}
            </button>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about a dish, ingredient, technique, substitution, or meal plan..."
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: 'rgb(var(--foreground))' }}
              aria-label="Type a question for Chef Pepe" />
            
            {inputValue &&
              <button
                className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                style={{ backgroundColor: 'rgb(var(--primary))' }}
                aria-label="Send question">
                <Icon name="ArrowRightIcon" size={16} className="text-white" />
              </button>
            }
          </div>

          {/* Example prompt chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            {examplePrompts.map((prompt) =>
              <button
                key={prompt}
                onClick={() => { setInputValue(prompt); inputRef.current?.focus(); }}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 hover:border-accent"
                style={{ backgroundColor: 'rgb(var(--muted))', borderColor: 'rgb(var(--border))', color: 'rgb(var(--primary))' }}>
                {prompt}
              </button>
            )}
          </div>

          {/* Primary CTAs */}
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={handleMicClick}
              className="btn-accent px-6 py-3 text-sm inline-flex items-center gap-2">
              <Icon name="MicrophoneIcon" size={18} />
              Talk to Chef Pepe
            </button>
            <button
              onClick={focusInput}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border-2 transition-all duration-300"
              style={{ borderColor: 'rgb(var(--accent))', color: 'rgb(var(--accent))', backgroundColor: 'transparent' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgb(var(--accent))'; (e.currentTarget as HTMLButtonElement).style.color = 'rgb(var(--accent-foreground))'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'rgb(var(--accent))'; }}>
              <Icon name="ChatBubbleLeftRightIcon" size={18} />
              Type a Question
            </button>
          </div>

          {/* Secondary CTAs */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/see-it-cook-it"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm border transition-all duration-300 hover:bg-muted"
              style={{ borderColor: 'rgb(var(--border))', color: 'rgb(var(--foreground))' }}>
              <Icon name="CameraIcon" size={16} />
              Show Chef Pepe a Meal
            </Link>
            <Link
              href="/recipes"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm border transition-all duration-300 hover:bg-muted"
              style={{ borderColor: 'rgb(var(--border))', color: 'rgb(var(--foreground))' }}>
              <Icon name="BookOpenIcon" size={16} />
              Start Cooking
            </Link>
            <Link
              href="/join?interest=chef-pepe"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300"
              style={{ backgroundColor: 'rgb(var(--muted))', color: 'rgb(var(--primary))' }}>
              <Icon name="UserPlusIcon" size={16} />
              Join Chew
            </Link>
          </div>
        </div>

        {/* Right: Chef Pepe character */}
        <div className="flex justify-center items-center">
          <div className="relative">
            {/* Outer glow ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-80 h-80 rounded-full border-2 animate-pulse"
                style={{ borderColor: 'rgba(191,89,37,0.2)' }} />
            </div>
            {/* Inner glow ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-64 h-64 rounded-full border animate-pulse"
                style={{ borderColor: 'rgba(31,122,90,0.2)', animationDelay: '0.7s' }} />
            </div>

            {/* Avatar circle */}
            <div
              className="relative w-72 h-72 rounded-full border-4 overflow-hidden shadow-2xl"
              style={{ borderColor: 'rgba(191,89,37,0.3)', background: 'linear-gradient(135deg, rgba(191,89,37,0.15) 0%, rgba(31,122,90,0.1) 100%)' }}>
              <AppImage
                src="https://images.unsplash.com/photo-1707501766995-b7f6dc263ba1"
                alt="Friendly professional chef smiling warmly in a clean white chef's coat, arms crossed, inviting expression"
                fill
                priority
                className="object-cover object-top"
                sizes="288px" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(37,37,37,0.55) 0%, transparent 55%)' }} />
              <div className="absolute bottom-5 left-0 right-0 text-center">
                <span className="font-extrabold text-lg text-white">Chef Pepe</span>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <span className={`w-2 h-2 rounded-full ${micState === 'active' ? 'bg-green-400' : 'bg-green-400 animate-pulse'}`} />
                  <span className="text-xs text-white/70">
                    {micState === 'active' ? 'Listening…' : 'Online · Ready to cook'}
                  </span>
                </div>
              </div>
            </div>

            {/* Capability chips */}
            <div
              className="absolute -top-3 -right-6 rounded-2xl shadow-lg px-4 py-2 border"
              style={{ backgroundColor: 'rgb(var(--card))', borderColor: 'rgb(var(--border))' }}>
              <span className="text-xs font-bold" style={{ color: 'rgb(var(--foreground))' }}>🥩 Steak tips</span>
            </div>
            <div
              className="absolute -bottom-3 -left-6 rounded-2xl shadow-lg px-4 py-2 border"
              style={{ backgroundColor: 'rgb(var(--card))', borderColor: 'rgb(var(--border))' }}>
              <span className="text-xs font-bold" style={{ color: 'rgb(var(--foreground))' }}>🥗 Meal plans</span>
            </div>
            <div
              className="absolute top-1/2 -right-14 rounded-2xl shadow-lg px-4 py-2 -translate-y-1/2"
              style={{ backgroundColor: 'rgb(var(--accent))' }}>
              <span className="text-xs font-bold text-white">🔊 Voice guide</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-xs uppercase tracking-widest font-mono" style={{ color: 'rgba(74,107,90,0.5)' }}>Explore</span>
        <div className="w-px h-10" style={{ background: 'linear-gradient(to bottom, rgba(74,107,90,0.4), transparent)' }} />
      </div>
    </section>
  );
}