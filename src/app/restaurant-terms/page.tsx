import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Restaurant Terms | Chew Network',
  description: 'Terms and conditions for restaurant partners on Chew Network.',
};

const sections = [
  {
    title: 'Restaurant Profiles',
    content: 'Chew Network may create restaurant profiles using publicly available information. Restaurant owners may claim their profile to manage their listing. Claimed profiles are subject to these Restaurant Terms. Unclaimed profiles are governed by our general Terms of Use.',
  },
  {
    title: 'Accuracy of Information',
    content: 'Restaurant partners are responsible for maintaining accurate information on their profile, including hours, menu items, pricing, and contact details. Chew Network is not liable for inaccuracies in restaurant information. We display an accuracy disclaimer on all restaurant pages.',
  },
  {
    title: 'Photos and Media',
    content: 'By uploading photos to your restaurant profile, you grant Chew Network a license to display them on our platform. You represent that you have the right to use all uploaded photos. Chew Network may also display user-submitted photos of your restaurant.',
  },
  {
    title: 'Creator Visits',
    content: 'Chew Network creators may visit and post about your restaurant. We do not control creator content about your restaurant. If you believe creator content about your restaurant is inaccurate or harmful, contact us at restaurants@chewnetwork.com.',
  },
  {
    title: 'Restaurant Partner Program',
    content: 'Restaurants that join our partner program receive enhanced profile features, analytics, and promotional opportunities. Partner program terms, pricing, and features are governed by a separate Restaurant Partner Agreement signed at enrollment.',
  },
  {
    title: 'Removal Requests',
    content: 'Restaurant owners may request removal of their restaurant from Chew Network by contacting restaurants@chewnetwork.com. We will process removal requests within 14 business days. Note that user-generated content about your restaurant (reviews, photos) may remain.',
  },
];

export default function RestaurantTermsPage() {
  return (
    <main className="bg-background min-h-screen">
      <Header />
      <div className="pt-28 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Legal</p>
          <h1 className="text-4xl font-extrabold text-foreground mb-3">Restaurant Terms</h1>
          <p className="text-muted-foreground">Last updated: January 1, 2026</p>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            These Restaurant Terms govern restaurant listings and restaurant partner participation on Chew Network. They supplement our general Terms of Use.
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
          <Link href="/contact?topic=restaurant" className="btn-primary text-sm text-center">Contact Restaurant Team</Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
