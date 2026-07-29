import React from 'react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Copyright & DMCA | Chew Network',
  description: 'Copyright policy and DMCA takedown process for Chew Network.',
};

const steps = [
  {
    step: 1,
    title: 'Identify the infringing content',
    description: 'Note the exact URL(s) of the content you believe infringes your copyright on Chew Network.',
  },
  {
    step: 2,
    title: 'Prepare your notice',
    description: 'Your DMCA notice must include: your contact information, identification of the copyrighted work, identification of the infringing material, a statement of good faith belief, a statement of accuracy under penalty of perjury, and your signature.',
  },
  {
    step: 3,
    title: 'Submit your notice',
    description: 'Send your completed DMCA notice to legal@chewnetwork.com with the subject line "DMCA Takedown Notice." We will acknowledge receipt within 2 business days.',
  },
  {
    step: 4,
    title: 'We review and act',
    description: 'We review all valid DMCA notices and remove infringing content promptly. We notify the user who posted the content and provide information about filing a counter-notice.',
  },
];

export default function CopyrightPage() {
  return (
    <main className="bg-background min-h-screen">
      <Header />
      <div className="pt-28 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Legal</p>
          <h1 className="text-4xl font-extrabold text-foreground mb-3">Copyright & DMCA</h1>
          <p className="text-muted-foreground">Last updated: January 1, 2026</p>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Chew Network respects intellectual property rights and expects our users to do the same. This page explains our copyright policy and how to submit a DMCA takedown notice.
          </p>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-extrabold text-foreground mb-4">Our Copyright Policy</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Users may only post content they own or have the right to share. Posting copyrighted content without permission — including recipes, photos, videos, and written content — violates our Terms of Use and may violate copyright law.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We respond to valid DMCA takedown notices and have a repeat infringer policy. Users who repeatedly infringe copyright may have their accounts terminated.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-extrabold text-foreground mb-6">How to File a DMCA Notice</h2>
          <div className="space-y-4">
            {steps?.map((step) => (
              <div key={step?.step} className="flex gap-4">
                <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-extrabold text-sm shrink-0">
                  {step?.step}
                </div>
                <div className="bg-card border border-border rounded-2xl p-4 flex-1">
                  <h3 className="font-bold text-foreground mb-1">{step?.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step?.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-extrabold text-foreground mb-4">Counter-Notices</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you believe your content was removed in error, you may file a counter-notice. Counter-notices must include your contact information, identification of the removed content, a statement under penalty of perjury that the content was removed by mistake or misidentification, and your consent to jurisdiction. Send counter-notices to legal@chewnetwork.com.
          </p>
        </section>

        <div className="bg-muted rounded-2xl p-6">
          <h2 className="font-bold text-foreground mb-2">Designated Copyright Agent</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Chew Network, Inc.<br />
            Attn: Copyright Agent<br />
            Los Angeles, CA<br />
            <a href="mailto:legal@chewnetwork.com" className="text-primary hover:underline">legal@chewnetwork.com</a>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
