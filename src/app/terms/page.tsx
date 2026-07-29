import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Terms of Use | Chew Network',
  description: 'The terms and conditions governing your use of Chew Network.',
};

const sections = [
  {
    title: 'Acceptance of Terms',
    content: `By accessing or using Chew Network, you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, please do not use our platform. We reserve the right to update these terms at any time, and your continued use constitutes acceptance of any changes.`,
  },
  {
    title: 'Your Account',
    content: `You must be at least 13 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information and to update it as necessary.\n\nYou may not use another person's account without permission, create accounts for the purpose of violating these terms, or transfer your account to another person.`,
  },
  {
    title: 'Content You Post',
    content: `You retain ownership of content you post on Chew Network. By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, reproduce, and distribute your content in connection with our services.\n\nYou are solely responsible for your content. You agree not to post content that is illegal, harmful, threatening, abusive, harassing, defamatory, or that infringes on intellectual property rights. We reserve the right to remove content that violates these terms.`,
  },
  {
    title: 'AI Features and Chef Pepe',
    content: `Chef Pepe and our AI-powered features are provided for informational and entertainment purposes. AI-generated recipe suggestions, cooking instructions, and nutritional information may contain errors. Always use your judgment when following cooking instructions, particularly regarding food safety, allergens, and dietary restrictions.\n\nWe do not guarantee the accuracy of AI-generated content. See our AI Disclosure for more information.`,
  },
  {
    title: 'Prohibited Uses',
    content: `You agree not to: scrape, crawl, or use automated means to access our platform; reverse engineer or attempt to extract our source code; use our platform to send spam or unsolicited communications; impersonate any person or entity; engage in any activity that disrupts or interferes with our services; or use our platform for any illegal purpose.`,
  },
  {
    title: 'Intellectual Property',
    content: `Chew Network and its licensors own all intellectual property rights in the platform, including our software, design, logos, and original content. You may not copy, modify, distribute, or create derivative works from our proprietary content without express written permission.`,
  },
  {
    title: 'Disclaimers and Limitation of Liability',
    content: `Chew Network is provided "as is" without warranties of any kind. We do not warrant that our services will be uninterrupted, error-free, or free of viruses. To the maximum extent permitted by law, we disclaim all warranties and limit our liability for any damages arising from your use of our platform.`,
  },
  {
    title: 'Termination',
    content: `We may suspend or terminate your account at any time for violation of these terms or for any other reason at our discretion. You may delete your account at any time. Upon termination, your right to use the platform ceases immediately.`,
  },
  {
    title: 'Governing Law',
    content: `These Terms are governed by the laws of the State of California, without regard to conflict of law principles. Any disputes shall be resolved in the courts of Los Angeles County, California.`,
  },
];

export default function TermsPage() {
  return (
    <main className="bg-background min-h-screen">
      <Header />
      <div className="pt-28 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Legal</p>
          <h1 className="text-4xl font-extrabold text-foreground mb-3">Terms of Use</h1>
          <p className="text-muted-foreground">Last updated: January 1, 2026</p>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            These Terms of Use govern your access to and use of Chew Network&apos;s website, mobile applications, and services. Please read them carefully.
          </p>
        </div>

        <div className="space-y-8">
          {sections?.map((section, i) => (
            <section key={i} className="border-b border-border pb-8 last:border-0">
              <h2 className="text-xl font-extrabold text-foreground mb-3">{section?.title}</h2>
              {section?.content?.split('\n\n')?.map((para, j) => (
                <p key={j} className="text-muted-foreground leading-relaxed mb-3 last:mb-0">{para}</p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link href="/privacy" className="btn-secondary text-sm text-center">Privacy Policy</Link>
          <Link href="/contact" className="btn-secondary text-sm text-center">Contact Us</Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
