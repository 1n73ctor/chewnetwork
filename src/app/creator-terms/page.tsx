import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Creator Terms | Chew Network',
  description: 'Terms and conditions for creators on Chew Network.',
};

const sections = [
  {
    title: 'Eligibility',
    content: 'To become a creator on Chew Network, you must be at least 18 years old, have a verified Chew Network account in good standing, and agree to these Creator Terms in addition to our general Terms of Use.',
  },
  {
    title: 'Content Ownership and License',
    content: 'You retain full ownership of all content you create and publish on Chew Network. By publishing content, you grant Chew Network a non-exclusive, worldwide, royalty-free license to display, distribute, and promote your content on our platform and in marketing materials. We will always credit you as the creator.',
  },
  {
    title: 'Content Standards',
    content: 'All creator content must comply with our Community Guidelines and Terms of Use. Content must be original or properly licensed. Recipes must be accurate and safe. Nutritional information, if provided, must be clearly labeled as approximate. AI-generated content must be disclosed.',
  },
  {
    title: 'Monetization',
    content: 'Creators may be eligible for monetization programs including ad revenue sharing, brand partnerships facilitated through Chew Network, and paid content features. Monetization eligibility, rates, and payment terms are governed by separate monetization agreements. Chew Network reserves the right to modify monetization programs with 30 days notice.',
  },
  {
    title: 'Creator Academy',
    content: 'Creators who contribute courses or content to Creator Academy agree to additional terms outlined in the Creator Academy Contributor Agreement. Revenue sharing for Academy content is governed by that agreement.',
  },
  {
    title: 'Account Suspension and Termination',
    content: 'Chew Network may suspend or terminate creator status for violations of these terms, Community Guidelines, or Terms of Use. Creators will be notified of the reason for suspension and may appeal within 14 days. Termination of creator status does not delete your general account.',
  },
  {
    title: 'Indemnification',
    content: 'You agree to indemnify and hold harmless Chew Network from any claims arising from your content, including claims of copyright infringement, defamation, or food safety issues caused by inaccurate recipes.',
  },
];

export default function CreatorTermsPage() {
  return (
    <main className="bg-background min-h-screen">
      <Header />
      <div className="pt-28 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Legal</p>
          <h1 className="text-4xl font-extrabold text-foreground mb-3">Creator Terms</h1>
          <p className="text-muted-foreground">Last updated: January 1, 2026</p>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            These Creator Terms govern your participation as a creator on Chew Network and supplement our general Terms of Use. By applying to become a creator, you agree to these terms.
          </p>
        </div>

        <div className="space-y-8 mb-10">
          {sections?.map((section, i) => (
            <section key={i} className="border-b border-border pb-8 last:border-0">
              <h2 className="text-xl font-extrabold text-foreground mb-3">{section?.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{section?.content}</p>
            </section>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/terms" className="btn-secondary text-sm text-center">General Terms of Use</Link>
          <Link href="/creators" className="btn-primary text-sm text-center">Become a Creator</Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
