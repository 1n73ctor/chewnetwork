import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Community Guidelines | Chew Network',
  description: 'The rules and values that make Chew Network a welcoming place for food lovers.',
};

const guidelines = [
  {
    icon: '🤝',
    title: 'Be kind and respectful',
    description: 'Chew Network is a place for food lovers of all skill levels, backgrounds, and tastes. Treat every member with respect. Constructive feedback is welcome; personal attacks, harassment, and hate speech are not.',
  },
  {
    icon: '🍳',
    title: 'Share authentic content',
    description: 'Post recipes, photos, and videos that are genuinely yours or that you have the right to share. Credit original creators when you adapt their work. Do not post misleading, plagiarized, or AI-generated content without disclosure.',
  },
  {
    icon: '🌍',
    title: 'Celebrate food culture',
    description: 'Food is one of humanity\'s most powerful connectors. Approach cuisines from other cultures with curiosity and respect. Avoid cultural appropriation and stereotyping. Learn, share, and celebrate — don\'t mock or diminish.',
  },
  {
    icon: '🔒',
    title: 'Protect privacy',
    description: 'Do not share personal information about other users without their consent. Do not post photos or videos of people without their permission. Respect the privacy of children especially.',
  },
  {
    icon: '⚠️',
    title: 'Food safety first',
    description: 'When sharing recipes, be accurate about allergens, dietary restrictions, and food safety practices. Do not share recipes that could cause harm. Always note if a dish contains common allergens.',
  },
  {
    icon: '🚫',
    title: 'No spam or self-promotion abuse',
    description: 'Organic sharing of your work is welcome. Spam, excessive self-promotion, fake engagement, and coordinated inauthentic behavior are not. Do not use Chew Network to promote unrelated products or services.',
  },
  {
    icon: '🤖',
    title: 'AI content disclosure',
    description: 'If you use AI tools to generate recipes, images, or other content, disclose this clearly. Chew Network values authentic human creativity. AI-assisted content is welcome when properly labeled.',
  },
  {
    icon: '📣',
    title: 'Report problems',
    description: 'If you see content that violates these guidelines, use the report button or contact us. We review all reports and take action when guidelines are violated. Do not engage with or amplify harmful content.',
  },
];

export default function CommunityGuidelinesPage() {
  return (
    <main className="bg-background min-h-screen">
      <Header />
      <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Community</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4">Community Guidelines</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Chew Network is built on a simple belief: food is better when it&apos;s shared. These guidelines exist to keep our community a welcoming, inspiring, and safe place for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          {guidelines?.map((g) => (
            <div key={g?.title} className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{g?.icon}</span>
                <h2 className="font-extrabold text-foreground">{g?.title}</h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{g?.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-dark-panel rounded-3xl p-8 sm:p-10 text-center">
          <h2 className="text-2xl font-extrabold text-white mb-3">Violations & Enforcement</h2>
          <p className="text-white/70 mb-6 max-w-xl mx-auto text-sm leading-relaxed">
            Violations of these guidelines may result in content removal, account suspension, or permanent ban depending on severity. We take a graduated approach for first-time violations and act swiftly on serious or repeated offenses.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact?topic=report" className="btn-primary">Report a Problem</Link>
            <Link href="/help" className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm">Help Center</Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
