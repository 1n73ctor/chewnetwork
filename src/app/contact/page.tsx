'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const topics = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'restaurant', label: 'Restaurant Partner' },
  { value: 'creator', label: 'Creator Support' },
  { value: 'report', label: 'Report a Problem' },
  { value: 'press', label: 'Press & Media' },
  { value: 'legal', label: 'Legal' },
];

const contactCards = [
  {
    icon: '🤝',
    title: 'Partnerships',
    description: 'Interested in partnering with Chew Network? We\'d love to hear from you.',
    email: 'partnerships@chewnetwork.com',
  },
  {
    icon: '🍽️',
    title: 'Restaurant Partners',
    description: 'Claim your restaurant profile or explore our restaurant partner program.',
    email: 'restaurants@chewnetwork.com',
  },
  {
    icon: '📰',
    title: 'Press & Media',
    description: 'Media inquiries, interview requests, and press kit access.',
    email: 'press@chewnetwork.com',
  },
  {
    icon: '⚖️',
    title: 'Legal',
    description: 'Legal notices, copyright claims, and compliance inquiries.',
    email: 'legal@chewnetwork.com',
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', topic: 'general', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="bg-background min-h-screen">
      <Header />

      <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Get in Touch</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4">We&apos;d love to hear from you.</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Whether you have a question, a partnership idea, or just want to say hello — we&apos;re here.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Form */}
          <div>
            {submitted ? (
              <div className="bg-muted rounded-3xl p-10 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-2xl font-extrabold text-foreground mb-2">Message sent!</h2>
                <p className="text-muted-foreground">
                  Thanks for reaching out. We typically respond within 1–2 business days.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', topic: 'general', message: '' }); }}
                  className="mt-6 btn-secondary text-sm"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-1.5">Your name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                    placeholder="Jane Smith"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-1.5">Email address</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                    placeholder="jane@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="topic" className="block text-sm font-semibold text-foreground mb-1.5">Topic</label>
                  <select
                    id="topic"
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                  >
                    {topics.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-1.5">Message</label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>
                <button type="submit" className="w-full btn-primary">Send Message</button>
              </form>
            )}
          </div>

          {/* Contact cards */}
          <div className="space-y-4">
            {contactCards.map((card) => (
              <div key={card.title} className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4">
                <span className="text-2xl shrink-0">{card.icon}</span>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{card.title}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{card.description}</p>
                  <a href={`mailto:${card.email}`} className="text-primary text-sm font-medium hover:underline">
                    {card.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
