import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'AI Disclosure | Chew Network',
  description: 'How Chew Network uses artificial intelligence, including Chef Pepe.',
};

const aiFeatures = [
  {
    name: 'Chef Pepe',
    description: 'Our AI cooking companion that answers food questions, suggests recipes, guides you through cooking steps, and helps you identify dishes from photos.',
    capabilities: ['Recipe recommendations', 'Step-by-step cooking guidance', 'Ingredient substitutions', 'Dish identification from images', 'Nutritional estimates', 'Meal planning suggestions'],
    limitations: 'Chef Pepe can make mistakes. Nutritional information is estimated and should not replace professional dietary advice. Food safety guidance is general — always follow official food safety standards.',
  },
  {
    name: 'See It. Cook It.',
    description: 'AI-powered visual recognition that identifies dishes and ingredients from photos or videos, then generates recipes and cooking instructions.',
    capabilities: ['Dish identification from photos', 'Ingredient detection', 'Recipe generation from visual input', 'Cooking time estimation'],
    limitations: 'Visual recognition accuracy varies based on image quality, lighting, and dish complexity. Generated recipes are AI-created and may require adjustment.',
  },
  {
    name: 'Personalization',
    description: 'AI systems that learn your preferences to surface relevant recipes, creators, and restaurants.',
    capabilities: ['Personalized recipe feed', 'Creator recommendations', 'Restaurant suggestions', 'Dietary preference learning'],
    limitations: 'Personalization is based on your activity and may not always reflect your current preferences. You can reset your preferences at any time in account settings.',
  },
];

export default function AIDisclosurePage() {
  return (
    <main className="bg-background min-h-screen">
      <Header />
      <div className="pt-28 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Transparency</p>
          <h1 className="text-4xl font-extrabold text-foreground mb-3">AI Disclosure</h1>
          <p className="text-muted-foreground">Last updated: January 1, 2026</p>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Chew Network uses artificial intelligence to power several features of our platform. We believe in transparency about how AI is used, what it can do, and where its limitations lie. This page explains our AI systems and how they affect your experience.
          </p>
        </div>

        <div className="space-y-8 mb-12">
          {aiFeatures?.map((feature) => (
            <section key={feature?.name} className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🤖</span>
                <h2 className="text-xl font-extrabold text-foreground">{feature?.name}</h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{feature?.description}</p>
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-wide text-foreground mb-2">Capabilities</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {feature?.capabilities?.map((cap) => (
                    <li key={cap} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400 mb-1">Limitations</p>
                <p className="text-amber-800 dark:text-amber-300 text-sm leading-relaxed">{feature?.limitations}</p>
              </div>
            </section>
          ))}
        </div>

        <section className="space-y-6">
          <div className="border-b border-border pb-6">
            <h2 className="text-xl font-extrabold text-foreground mb-3">Data and AI Training</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Interactions with Chef Pepe and other AI features may be used to improve our models. We do not sell this data to third parties. You can opt out of AI training data collection in your account privacy settings. See our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> for full details.
            </p>
          </div>
          <div className="border-b border-border pb-6">
            <h2 className="text-xl font-extrabold text-foreground mb-3">AI-Generated Content</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Some content on Chew Network may be AI-generated or AI-assisted. We label AI-generated content where possible. If you believe AI-generated content is inaccurate or harmful, please <Link href="/contact?topic=report" className="text-primary hover:underline">report it</Link>.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-foreground mb-3">Questions</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              If you have questions about our AI systems, contact us at{' '}
              <a href="mailto:ai@chewnetwork.com" className="text-primary hover:underline">ai@chewnetwork.com</a>.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
