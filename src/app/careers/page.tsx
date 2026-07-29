import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Careers | Chew Network',
  description: 'Join the team building the future home of food.',
};

const openRoles = [
  { title: 'Senior Full-Stack Engineer', team: 'Engineering', location: 'Los Angeles / Remote', type: 'Full-time' },
  { title: 'AI/ML Engineer', team: 'Engineering', location: 'Los Angeles / Remote', type: 'Full-time' },
  { title: 'Product Designer', team: 'Design', location: 'Los Angeles / Remote', type: 'Full-time' },
  { title: 'Content & Community Manager', team: 'Community', location: 'Los Angeles', type: 'Full-time' },
  { title: 'Creator Partnerships Manager', team: 'Partnerships', location: 'Los Angeles / Remote', type: 'Full-time' },
  { title: 'Restaurant Partnerships Lead', team: 'Partnerships', location: 'Los Angeles', type: 'Full-time' },
];

const values = [
  { icon: '🍳', title: 'Food first', description: 'We are obsessed with food — its culture, its science, its power to connect people.' },
  { icon: '🤝', title: 'Build together', description: 'We move fast, but we move together. Every voice matters, every idea gets heard.' },
  { icon: '🌍', title: 'Think global', description: 'Food is universal. We build for every cuisine, every culture, every kitchen.' },
  { icon: '🔬', title: 'Experiment boldly', description: 'We are building something new. That means trying things that have never been tried.' },
];

export default function CareersPage() {
  return (
    <main className="bg-background min-h-screen">
      <Header />
      <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Careers</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4">
            Help us build the future home of food.
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Chew Network is a food-technology company at the intersection of AI, community, and culture. We are a small, ambitious team building something genuinely new.
          </p>
        </div>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-2xl font-extrabold text-foreground mb-6 text-center">How we work</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values?.map((v) => (
              <div key={v?.title} className="bg-card border border-border rounded-2xl p-5 text-center">
                <div className="text-3xl mb-3">{v?.icon}</div>
                <h3 className="font-bold text-foreground mb-2">{v?.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v?.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Open roles */}
        <section className="mb-16">
          <h2 className="text-2xl font-extrabold text-foreground mb-6">Open Roles</h2>
          <div className="space-y-3">
            {openRoles?.map((role) => (
              <div
                key={role?.title}
                className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary transition-colors"
              >
                <div>
                  <h3 className="font-bold text-foreground">{role?.title}</h3>
                  <div className="flex flex-wrap gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">{role?.team}</span>
                    <span className="text-xs text-muted-foreground">📍 {role?.location}</span>
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{role?.type}</span>
                  </div>
                </div>
                <Link href="/contact?topic=general" className="btn-secondary text-sm shrink-0">
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* General application */}
        <div className="bg-foreground rounded-3xl p-8 sm:p-10 text-center">
          <h2 className="text-2xl font-extrabold text-white mb-3">Don&apos;t see your role?</h2>
          <p className="text-white/70 mb-6 max-w-md mx-auto text-sm leading-relaxed">
            We are always looking for exceptional people. Send us your resume and tell us how you would contribute to Chew Network.
          </p>
          <a
            href="mailto:careers@chewnetwork.com"
            className="btn-primary"
          >
            Send a General Application
          </a>
        </div>
      </div>
      <Footer />
    </main>
  );
}
