'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const cookieTypes = [
  {
    id: 'essential',
    name: 'Essential Cookies',
    description: 'Required for the platform to function. These cannot be disabled.',
    required: true,
    examples: ['Session authentication', 'Security tokens', 'Load balancing'],
  },
  {
    id: 'functional',
    name: 'Functional Cookies',
    description: 'Remember your preferences and settings to improve your experience.',
    required: false,
    examples: ['Language preferences', 'Saved filters', 'Theme settings'],
  },
  {
    id: 'analytics',
    name: 'Analytics Cookies',
    description: 'Help us understand how you use Chew Network so we can improve it.',
    required: false,
    examples: ['Page views', 'Feature usage', 'Error tracking'],
  },
  {
    id: 'marketing',
    name: 'Marketing Cookies',
    description: 'Used to show you relevant ads and measure advertising effectiveness.',
    required: false,
    examples: ['Ad targeting', 'Campaign measurement', 'Retargeting'],
  },
];

export default function CookiesPage() {
  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    essential: true,
    functional: true,
    analytics: true,
    marketing: false,
  });
  const [saved, setSaved] = useState(false);

  const toggle = (id: string) => {
    if (id === 'essential') return;
    setPreferences((prev) => ({ ...prev, [id]: !prev[id] }));
    setSaved(false);
  };

  const handleSave = () => setSaved(true);

  return (
    <main className="bg-background min-h-screen">
      <Header />

      <div className="pt-28 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Legal</p>
          <h1 className="text-4xl font-extrabold text-foreground mb-3">Cookie Settings</h1>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            We use cookies and similar technologies to provide our services, remember your preferences, and understand how you use Chew Network. You can manage your cookie preferences below.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {cookieTypes.map((cookie) => (
            <div key={cookie.id} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-bold text-foreground">{cookie.name}</h2>
                    {cookie.required && (
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                        Always on
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{cookie.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {cookie.examples.map((ex) => (
                      <span key={ex} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-lg">
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => toggle(cookie.id)}
                  disabled={cookie.required}
                  className={`relative w-12 h-6 rounded-full transition-colors shrink-0 mt-1 ${
                    preferences[cookie.id] ? 'bg-primary' : 'bg-muted'
                  } ${cookie.required ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                  aria-label={`${preferences[cookie.id] ? 'Disable' : 'Enable'} ${cookie.name}`}
                  role="switch"
                  aria-checked={preferences[cookie.id]}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      preferences[cookie.id] ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <button onClick={handleSave} className="btn-primary">
            {saved ? '✓ Preferences Saved' : 'Save Preferences'}
          </button>
          <button
            onClick={() => {
              setPreferences({ essential: true, functional: false, analytics: false, marketing: false });
              setSaved(false);
            }}
            className="btn-secondary"
          >
            Reject All Optional
          </button>
          <button
            onClick={() => {
              setPreferences({ essential: true, functional: true, analytics: true, marketing: true });
              setSaved(false);
            }}
            className="btn-secondary"
          >
            Accept All
          </button>
        </div>

        <div className="border-t border-border pt-8">
          <h2 className="text-xl font-extrabold text-foreground mb-3">About Our Cookies</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            Cookies are small text files stored on your device that help us provide and improve our services. We use both first-party cookies (set by Chew Network) and third-party cookies (set by our partners).
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            For more information about how we use your data, see our{' '}
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
