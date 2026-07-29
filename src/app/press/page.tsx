import React from 'react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Press | Chew Network',
  description: 'Press resources, media kit, and contact information for Chew Network.',
};

const pressItems = [
  {
    outlet: 'TechCrunch',
    headline: 'Chew Network wants to be the food internet — and it\'s starting with AI',
    date: 'March 2026',
    type: 'Feature',
  },
  {
    outlet: 'Food & Wine',
    headline: 'Meet Chef Pepe, the AI cooking companion that actually understands flavor',
    date: 'February 2026',
    type: 'Profile',
  },
  {
    outlet: 'The Verge',
    headline: 'Can a food-tech startup build the community that Instagram couldn\'t?',
    date: 'January 2026',
    type: 'Analysis',
  },
];

const assets = [
  { name: 'Brand Logo (SVG, PNG)', size: '2.4 MB' },
  { name: 'Product Screenshots', size: '18 MB' },
  { name: 'Founder Photos', size: '8 MB' },
  { name: 'Company Fact Sheet', size: '240 KB' },
];

export default function PressPage() {
  return (
    <main className="bg-background min-h-screen">
      <Header />
      <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Company</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4">Press & Media</h1>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            Resources for journalists, bloggers, and media professionals covering Chew Network.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main */}
          <div className="lg:col-span-2 space-y-10">

            {/* Boilerplate */}
            <section>
              <h2 className="text-2xl font-extrabold text-foreground mb-4">About Chew Network</h2>
              <div className="bg-muted rounded-2xl p-6">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Chew Network is a food-technology company building tools and communities that help people discover food, learn to cook, share what they create, and build food brands. Products include See It. Cook It. (AI-powered visual recipe generation), Chef Pepe (an AI cooking companion), and a creator platform for food content creators and restaurant partners. Chew Network is headquartered in Los Angeles, California.
                </p>
              </div>
            </section>

            {/* Press coverage */}
            <section>
              <h2 className="text-2xl font-extrabold text-foreground mb-4">Recent Coverage</h2>
              <div className="space-y-3">
                {pressItems?.map((item) => (
                  <div key={item?.headline} className="bg-card border border-border rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-primary uppercase tracking-wide">{item?.outlet}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{item?.date}</span>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full ml-auto">{item?.type}</span>
                    </div>
                    <p className="font-semibold text-foreground text-sm leading-snug">{item?.headline}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">

            {/* Press contact */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-bold text-foreground mb-3">Press Contact</h3>
              <p className="text-muted-foreground text-sm mb-3">For media inquiries, interview requests, and press materials:</p>
              <a href="mailto:press@chewnetwork.com" className="text-primary font-semibold text-sm hover:underline block mb-1">
                press@chewnetwork.com
              </a>
              <p className="text-muted-foreground text-xs">We respond to press inquiries within 24 hours.</p>
            </div>

            {/* Media kit */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-bold text-foreground mb-3">Media Kit</h3>
              <ul className="space-y-2 mb-4">
                {assets?.map((asset) => (
                  <li key={asset?.name} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{asset?.name}</span>
                    <span className="text-xs text-muted-foreground">{asset?.size}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full btn-primary text-sm">Download Media Kit</button>
            </div>

            {/* Quick facts */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-bold text-foreground mb-3">Quick Facts</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between"><span className="text-muted-foreground">Founded</span><span className="font-semibold text-foreground">2025</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">HQ</span><span className="font-semibold text-foreground">Los Angeles, CA</span></li>
                <li className="flex justify-between"><span className="text-muted-foreground">Stage</span><span className="font-semibold text-foreground">Early Stage</span></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </main>
  );
}
