'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const tracks = [
  { number: '01', title: 'Food Creator Foundations', description: 'Choose your focus, define your audience, and build a repeatable content plan.', lessons: 8, duration: '3h 20m', level: 'Beginner', color: 'bg-primary' },
  { number: '02', title: 'Recipe Development & Publishing', description: 'Test, write, photograph, structure, and publish recipes people can actually follow.', lessons: 12, duration: '5h 10m', level: 'Beginner', color: 'bg-accent' },
  { number: '03', title: 'Short-Form Food Video', description: 'Plan, film, edit, caption, and package food videos for discovery.', lessons: 10, duration: '4h 45m', level: 'Intermediate', color: 'bg-foreground' },
  { number: '04', title: 'Audience Growth', description: 'Build trust, use platforms intentionally, and turn viewers into a community.', lessons: 9, duration: '3h 55m', level: 'Intermediate', color: 'bg-primary' },
  { number: '05', title: 'Affiliate & Product Reviews', description: 'Create useful product content, disclose relationships, and build ethical recommendations.', lessons: 7, duration: '2h 40m', level: 'Intermediate', color: 'bg-accent' },
  { number: '06', title: 'Cookbooks & Digital Products', description: 'Organize expertise into guides, classes, collections, and sellable products.', lessons: 11, duration: '4h 30m', level: 'Advanced', color: 'bg-foreground' },
  { number: '07', title: 'Restaurant & Local Food Content', description: 'Tell stronger food stories and build respectful restaurant partnerships.', lessons: 6, duration: '2h 15m', level: 'Intermediate', color: 'bg-primary' },
];

const featuredLessons = [
  { title: 'How to Write a Recipe Anyone Can Follow', track: 'Recipe Development', duration: '28 min', instructor: 'Sofia Patel', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b7a1f0fc-1766862132058.png", alt: 'Food creator writing recipe notes in a bright kitchen with ingredients laid out', free: true },
  { title: 'Your First 30 Days as a Food Creator', track: 'Foundations', duration: '42 min', instructor: 'Maria Chen', image: "https://img.rocket.new/generatedImages/rocket_gen_img_11f551d1b-1772092792528.png", alt: 'Food creator filming a cooking video on a smartphone with ring light', free: true },
  { title: 'Filming Food with Just Your Phone', track: 'Short-Form Video', duration: '35 min', instructor: 'Jake Torres', image: "https://images.unsplash.com/photo-1705917893140-70f8fdd085fb", alt: 'Overhead shot of a phone filming a beautifully plated dish on a marble surface', free: false },
];

const outcomes = [
  'Publish your first recipe with proper structure and photos',
  'Film and edit a short food video ready to share',
  'Build a content calendar you can actually stick to',
  'Improve your profile to attract the right audience',
  'Pitch a brand partnership with a professional media kit',
  'Launch a small digital product or recipe collection',
];

const instructors = [
  { name: 'Sofia Patel', role: 'Recipe Developer & Food Stylist', bio: '10 years developing recipes for brands and publications. Now teaching the craft to the next generation.', image: "https://images.unsplash.com/photo-1734006827073-6ab36c31daca", alt: 'Instructor Sofia Patel in her kitchen surrounded by fresh ingredients', courses: 3 },
  { name: 'Maria Chen', role: 'Food Creator & Educator', bio: 'Built a 124K following from scratch. Teaches the real strategy behind sustainable creator growth.', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ae075983-1772763507250.png", alt: 'Instructor Maria Chen smiling in a professional kitchen setting', courses: 4 },
  { name: 'Jake Torres', role: 'Video Creator & Director', bio: 'Former film school dropout turned food video creator. Specializes in mobile-first production.', image: "https://images.unsplash.com/photo-1668944178058-aac5e7c192c1", alt: 'Instructor Jake Torres holding a camera at a food market', courses: 2 },
];

const faqs = [
  { q: 'Is Creator Academy free?', a: 'Some introductory lessons are free. Full access to all tracks and downloadable materials will be available through Chew membership or as individual purchases.' },
  { q: 'Do I need professional equipment?', a: 'No. Many lessons are specifically designed for creators working with a phone, a home kitchen, and natural light.' },
  { q: 'Will I get a certificate?', a: 'Completion certificates are planned for future tracks. Early access members will receive recognition when the system launches.' },
  { q: 'Can I apply to teach?', a: 'Yes. If you have expertise in food content, recipe development, video production, or food business, we want to hear from you.' },
];

export default function CreatorAcademyClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openTrack, setOpenTrack] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [waitlisted, setWaitlisted] = useState(false);

  return (
    <main className="bg-background min-h-screen">
      <Header />
      {/* Hero */}
      <section className="pt-28 pb-20 px-4 bg-gradient-to-b from-foreground to-foreground/90 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img src="https://img.rocket.new/generatedImages/rocket_gen_img_1e0df319d-1784100421499.png" alt="Food creator working in a professional kitchen" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-0 left-0 w-96 h-96 blob-green opacity-20" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-block text-accent text-xs font-bold uppercase tracking-widest mb-4">LEARN. CREATE. GROW.</span>
          <h1 className="text-hero-lg font-extrabold mb-6 tracking-tight">Turn your love of food into useful skills and a real brand.</h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto mb-10">Creator Academy teaches the practical work behind food content — from your first recipe post to a complete creator business.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#tracks" className="btn-primary text-base px-8 py-4">View Learning Tracks</Link>
            <Link href="#waitlist" className="btn-secondary border-white/30 text-white hover:bg-white hover:text-foreground text-base px-8 py-4">Join the Waitlist</Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">

        {/* Learning Tracks */}
        <section id="tracks" aria-labelledby="tracks-heading">
          <div className="text-center mb-12">
            <h2 id="tracks-heading" className="text-3xl font-extrabold text-foreground mb-4">Choose the path that matches your goal.</h2>
          </div>
          {/* Desktop grid */}
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-5">
            {tracks?.map((track) => (
              <div key={track?.number} className="bg-card border border-border rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300 group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <span className={`${track?.color} text-white text-xs font-bold px-3 py-1 rounded-full`}>{track?.level}</span>
                  <span className="text-3xl font-extrabold text-border">{track?.number}</span>
                </div>
                <h3 className="font-extrabold text-foreground text-lg mb-2 group-hover:text-primary transition-colors">{track?.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{track?.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-4">
                  <span>{track?.lessons} lessons</span><span>·</span><span>{track?.duration}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Mobile accordion */}
          <div className="sm:hidden space-y-3">
            {tracks?.map((track, i) => (
              <div key={track?.number} className="bg-card border border-border rounded-2xl overflow-hidden">
                <button onClick={() => setOpenTrack(openTrack === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left" aria-expanded={openTrack === i}>
                  <div className="flex items-center gap-3">
                    <span className={`${track?.color} text-white text-xs font-bold px-2 py-0.5 rounded-full shrink-0`}>{track?.number}</span>
                    <span className="font-bold text-foreground text-sm">{track?.title}</span>
                  </div>
                  <svg className={`w-5 h-5 text-muted-foreground transition-transform shrink-0 ml-2 ${openTrack === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openTrack === i && (
                  <div className="px-5 pb-5">
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">{track?.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-3">
                      <span className={`${track?.color} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>{track?.level}</span>
                      <span>{track?.lessons} lessons · {track?.duration}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Featured Lessons */}
        <section aria-labelledby="lessons-heading">
          <div className="flex items-center justify-between mb-8">
            <h2 id="lessons-heading" className="text-3xl font-extrabold text-foreground">Start with these lessons</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredLessons?.map((lesson) => (
              <div key={lesson?.title} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-card-hover transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <img src={lesson?.image} alt={lesson?.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                      <svg className="w-6 h-6 text-foreground ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  </div>
                  {lesson?.free && <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">Free</span>}
                </div>
                <div className="p-5">
                  <p className="text-accent text-xs font-semibold mb-1">{lesson?.track}</p>
                  <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{lesson?.title}</h3>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>with {lesson?.instructor}</span>
                    <span>{lesson?.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Outcomes */}
        <section aria-labelledby="outcomes-heading" className="section-cream rounded-3xl p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 id="outcomes-heading" className="text-3xl font-extrabold text-foreground mb-4">Learn something you can use immediately.</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">Each lesson should end with a practical action: publish a recipe, film a video, create a content calendar, improve a profile, pitch a partnership, or launch a small product.</p>
            </div>
            <div className="space-y-3">
              {outcomes?.map((outcome, i) => (
                <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-border">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <p className="text-foreground text-sm">{outcome}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Instructors */}
        <section aria-labelledby="instructors-heading">
          <div className="text-center mb-12">
            <h2 id="instructors-heading" className="text-3xl font-extrabold text-foreground mb-4">Learn from people who have done it.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {instructors?.map((instructor) => (
              <div key={instructor?.name} className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-card-hover transition-all duration-300">
                <img src={instructor?.image} alt={instructor?.alt} className="w-20 h-20 rounded-full object-cover mx-auto mb-4" />
                <h3 className="font-extrabold text-foreground">{instructor?.name}</h3>
                <p className="text-accent text-xs font-semibold mt-0.5 mb-3">{instructor?.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">{instructor?.bio}</p>
                <p className="text-xs text-muted-foreground">{instructor?.courses} courses</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/contact?topic=instructor" className="btn-secondary">Apply as an Instructor</Link>
          </div>
        </section>

        {/* Waitlist CTA */}
        <section id="waitlist" aria-labelledby="waitlist-heading" className="bg-foreground rounded-3xl p-8 sm:p-12 text-white text-center">
          <h2 id="waitlist-heading" className="text-3xl font-extrabold mb-3">Start as a food lover. Grow into a food creator.</h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">Join the Creator Academy waitlist and be first to access new tracks, free lessons, and early-member benefits.</p>
          {waitlisted ? (
            <div className="bg-white/10 rounded-2xl p-6 max-w-sm mx-auto">
              <p className="text-2xl mb-2">🎓</p>
              <p className="font-bold">You&apos;re on the list!</p>
              <p className="text-white/70 text-sm mt-1">We&apos;ll notify you when Creator Academy opens.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e?.preventDefault(); setWaitlisted(true); }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" required value={email} onChange={(e) => setEmail(e?.target?.value)} placeholder="Your email address" className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white text-sm" />
              <button type="submit" className="btn-primary shrink-0">Join the Waitlist</button>
            </form>
          )}
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-heading">
          <div className="max-w-2xl mx-auto">
            <h2 id="faq-heading" className="text-2xl font-extrabold text-foreground mb-8 text-center">Common questions</h2>
            <div className="space-y-3">
              {faqs?.map((faq, i) => (
                <div key={i} className="border border-border rounded-2xl overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-muted transition-colors" aria-expanded={openFaq === i}>
                    <span className="font-semibold text-foreground text-sm">{faq?.q}</span>
                    <svg className={`w-5 h-5 text-muted-foreground transition-transform ${openFaq === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === i && <div className="px-5 pb-5"><p className="text-muted-foreground text-sm leading-relaxed">{faq?.a}</p></div>}
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </main>
  );
}
