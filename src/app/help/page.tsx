'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const faqs = [
  {
    q: 'How do I create an account?',
    a: 'Visit /join and select your account type. You can sign up with your email or use Google/Apple sign-in. The process takes about 2 minutes.',
  },
  {
    q: 'How does Chef Pepe work?',
    a: 'Chef Pepe is our AI cooking companion. You can ask it questions, show it photos of dishes or ingredients, and get step-by-step cooking guidance. Access Chef Pepe from any page using the "Ask Chef Pepe" button.',
  },
  {
    q: 'How do I save a recipe?',
    a: 'Click the bookmark icon on any recipe card or recipe page. Saved recipes appear in your profile under "Saved." You need a free account to save recipes.',
  },
  {
    q: 'How do I become a creator?',
    a: 'Visit the Creators page and fill out the application form. We review all applications and typically respond within 5–7 business days.',
  },
  {
    q: 'How do I claim my restaurant?',
    a: 'Visit the Restaurants page, find your restaurant, and click "Claim this restaurant." You\'ll need to verify ownership. Contact restaurants@chewnetwork.com for help.',
  },
  {
    q: 'Is Chew Network free to use?',
    a: 'Yes, Chew Network is free to join and use. Some premium features may be available in the future, but the core experience — recipes, community, Chef Pepe — will always be free.',
  },
  {
    q: 'How do I delete my account?',
    a: 'Go to Account Settings > Privacy > Delete Account. This action is permanent and will remove all your content and data. Contact privacy@chewnetwork.com if you need help.',
  },
  {
    q: 'How do I report inappropriate content?',
    a: 'Use the "..." menu on any post, recipe, or profile to report it. You can also contact us directly at the Contact page. We review all reports within 24 hours.',
  },
];

const categories = [
  { icon: '👤', label: 'Account', href: '#account' },
  { icon: '🍳', label: 'Chef Pepe', href: '#chef-pepe' },
  { icon: '📖', label: 'Recipes', href: '#recipes' },
  { icon: '🎥', label: 'Creators', href: '#creators' },
  { icon: '🍽️', label: 'Restaurants', href: '#restaurants' },
  { icon: '🔒', label: 'Privacy', href: '/privacy' },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="bg-background min-h-screen">
      <Header />
      <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Support</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4">Help Center</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Find answers to common questions or get in touch with our support team.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xl mx-auto mb-12">
          <input
            type="search"
            placeholder="Search for help..."
            className="w-full pl-5 pr-14 py-4 rounded-2xl border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm shadow-sm"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 btn-primary py-2 px-4 text-xs">
            Search
          </button>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-12">
          {categories?.map((cat) => (
            <Link
              key={cat?.label}
              href={cat?.href}
              className="bg-card border border-border rounded-2xl p-4 text-center hover:border-primary hover:shadow-sm transition-all"
            >
              <div className="text-2xl mb-1">{cat?.icon}</div>
              <p className="text-xs font-semibold text-foreground">{cat?.label}</p>
            </Link>
          ))}
        </div>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-foreground mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs?.map((faq, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                  aria-expanded={openFaq === i}
                >
                  <span className="font-semibold text-foreground text-sm">{faq?.q}</span>
                  <svg
                    className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-muted-foreground text-sm leading-relaxed">{faq?.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <div className="bg-dark-panel rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-extrabold text-white mb-2">Still need help?</h2>
          <p className="text-white/70 mb-6 text-sm">Our support team typically responds within 1–2 business days.</p>
          <Link href="/contact" className="btn-primary">Contact Support</Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
