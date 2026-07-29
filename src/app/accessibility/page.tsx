import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Accessibility | Chew Network',
  description: 'Chew Network\'s commitment to digital accessibility for all users.',
};

const features = [
  { icon: '⌨️', title: 'Keyboard Navigation', description: 'All interactive elements are fully accessible via keyboard. Use Tab to navigate, Enter/Space to activate, and Escape to dismiss.' },
  { icon: '🔊', title: 'Screen Reader Support', description: 'We use semantic HTML and ARIA attributes throughout our platform to ensure compatibility with screen readers including NVDA, JAWS, and VoiceOver.' },
  { icon: '🎨', title: 'Color Contrast', description: 'Text and interactive elements meet WCAG 2.1 AA contrast ratios. We do not rely on color alone to convey information.' },
  { icon: '📱', title: 'Responsive Design', description: 'Chew Network is fully responsive and works across all screen sizes, from mobile phones to large desktop monitors.' },
  { icon: '🔤', title: 'Text Resizing', description: 'Our platform supports browser text resizing up to 200% without loss of content or functionality.' },
  { icon: '🎬', title: 'Media Alternatives', description: 'Images include descriptive alt text. Video content includes captions where available. We are working to expand caption coverage.' },
];

export default function AccessibilityPage() {
  return (
    <main className="bg-background min-h-screen">
      <Header />
      <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Support</p>
          <h1 className="text-4xl font-extrabold text-foreground mb-4">Accessibility Statement</h1>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            Chew Network is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-foreground mb-6">Our Commitment</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web content more accessible to people with disabilities, including visual, auditory, physical, speech, cognitive, language, learning, and neurological disabilities.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Accessibility is an ongoing effort. We regularly audit our platform, address issues as they are identified, and incorporate accessibility into our design and development processes from the start.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-foreground mb-6">Accessibility Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features?.map((f) => (
              <div key={f?.title} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{f?.icon}</span>
                  <h3 className="font-bold text-foreground">{f?.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{f?.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-foreground mb-4">Known Limitations</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            While we strive for full accessibility, some areas of our platform are still being improved:
          </p>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> Some older recipe videos may not have captions — we are working to add them.</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> The interactive map on the Restaurants page has limited screen reader support — a text-based list view is available.</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> Some third-party embedded content may not meet our accessibility standards.</li>
          </ul>
        </section>

        <section className="bg-muted rounded-2xl p-6">
          <h2 className="font-bold text-foreground mb-2">Report an Accessibility Issue</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            If you experience any accessibility barriers on Chew Network, please let us know. We take all reports seriously and aim to respond within 2 business days.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/contact?topic=general" className="btn-primary text-sm text-center">Contact Us</Link>
            <a href="mailto:accessibility@chewnetwork.com" className="btn-secondary text-sm text-center">
              accessibility@chewnetwork.com
            </a>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
