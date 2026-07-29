import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy | Chew Network',
  description: 'How Chew Network collects, uses, and protects your personal information.',
};

const sections = [
  {
    title: 'Information We Collect',
    content: `We collect information you provide directly to us when you create an account, submit recipes, post in the community, or contact us. This includes your name, email address, password, profile photo, and any content you choose to share on the platform.\n\nWe also collect information automatically when you use our services, including log data (IP address, browser type, pages visited), device information, and usage data. We use cookies and similar tracking technologies to enhance your experience — see our Cookie Policy for details.`,
  },
  {
    title: 'How We Use Your Information',
    content: `We use the information we collect to provide, maintain, and improve our services; personalize your experience and surface relevant recipes, creators, and restaurants; send you updates, newsletters, and promotional communications (with your consent); respond to your comments and questions; and monitor and analyze trends and usage.\n\nWe use AI systems including Chef Pepe to provide personalized cooking assistance. Queries you submit to Chef Pepe may be used to improve our AI models, but are never sold to third parties.`,
  },
  {
    title: 'Information Sharing',
    content: `We do not sell your personal information. We may share your information with service providers who assist us in operating our platform, conducting our business, or serving our users — provided those parties agree to keep this information confidential.\n\nWe may disclose your information if required by law, to protect the rights and safety of Chew Network and our users, or in connection with a merger, acquisition, or sale of assets.`,
  },
  {
    title: 'Data Retention',
    content: `We retain your personal information for as long as your account is active or as needed to provide you services. You may request deletion of your account and associated data at any time by contacting us at privacy@chewnetwork.com. Some information may be retained for legal compliance purposes.`,
  },
  {
    title: 'Your Rights',
    content: `Depending on your location, you may have the right to access, correct, or delete your personal information; object to or restrict certain processing; data portability; and withdraw consent at any time. To exercise these rights, contact us at privacy@chewnetwork.com. California residents have additional rights under CCPA.`,
  },
  {
    title: 'Children\'s Privacy',
    content: `Chew Network is not directed to children under 13. We do not knowingly collect personal information from children under 13. If we learn we have collected such information, we will delete it promptly. If you believe we have collected information from a child under 13, please contact us immediately.`,
  },
  {
    title: 'Security',
    content: `We implement industry-standard security measures to protect your information, including encryption in transit and at rest, access controls, and regular security audits. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: 'Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by posting a notice on our platform. Your continued use of Chew Network after changes take effect constitutes your acceptance of the updated policy.`,
  },
];

export default function PrivacyPage() {
  return (
    <main className="bg-background min-h-screen">
      <Header />
      <div className="pt-28 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Legal</p>
          <h1 className="text-4xl font-extrabold text-foreground mb-3">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: January 1, 2026</p>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Chew Network, Inc. (&ldquo;Chew Network,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
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

        <div className="mt-10 bg-muted rounded-2xl p-6">
          <h2 className="font-bold text-foreground mb-2">Contact Us</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            If you have questions about this Privacy Policy or our privacy practices, please contact us at{' '}
            <a href="mailto:privacy@chewnetwork.com" className="text-primary font-medium hover:underline">
              privacy@chewnetwork.com
            </a>{' '}
            or visit our{' '}
            <Link href="/contact" className="text-primary font-medium hover:underline">
              Contact page
            </Link>.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
