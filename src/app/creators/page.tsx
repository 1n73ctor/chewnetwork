'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const creatorTypes = [
'Recipe creators', 'Food influencers', 'Cookbook authors', 'Restaurant reviewers',
'Food photographers', 'Kitchen product reviewers', 'Affiliate marketers',
'Short-form video creators', 'Food educators'];


const benefits = [
{
  icon: '📝',
  title: 'Publish',
  description: 'Recipes, articles, photos, videos, and collections.'
},
{
  icon: '📈',
  title: 'Grow',
  description: 'Profiles, followers, discovery, collaboration, and community challenges.'
},
{
  icon: '📊',
  title: 'Understand',
  description: 'Analytics for views, saves, cooks, engagement, and audience growth.'
},
{
  icon: '💰',
  title: 'Earn',
  description: 'Future affiliate tools, brand opportunities, digital products, memberships, and storefronts.'
},
{
  icon: '🎓',
  title: 'Learn',
  description: 'Creator Academy guidance for content, marketing, production, and business.'
}];


const featuredCreators = [
{
  name: 'Maria Chen',
  handle: '@mariachencooks',
  specialty: 'Asian Fusion',
  followers: '124K',
  recipes: 89,
  views: '2.1M',
  image: "https://images.unsplash.com/photo-1677229888051-211da3f34219",
  alt: 'Food creator Maria Chen in her kitchen holding a bowl of noodles',
  quote: 'Chew gave me a home for my recipes that actually feels like mine.'
},
{
  name: 'Jake Torres',
  handle: '@jaketorrescooks',
  specialty: 'Street Food',
  followers: '98K',
  recipes: 67,
  views: '1.8M',
  image: "https://images.unsplash.com/photo-1572015837827-01671d41e102",
  alt: 'Food creator Jake Torres at a street food market',
  quote: 'The analytics showed me exactly which recipes my audience actually cooks.'
},
{
  name: 'Sofia Patel',
  handle: '@sofiapatelkitchen',
  specialty: 'Mediterranean',
  followers: '76K',
  recipes: 112,
  views: '1.2M',
  image: "https://images.unsplash.com/photo-1716947674021-1b8b696325c7",
  alt: 'Food creator Sofia Patel photographing a Mediterranean spread',
  quote: 'I went from posting on social to having a real recipe library people come back to.'
}];


const dashboardStats = [
{ label: 'Recipe Views', value: '24,891', change: '+18%', positive: true },
{ label: 'Saves This Month', value: '3,204', change: '+31%', positive: true },
{ label: 'Cooks Reported', value: '891', change: '+12%', positive: true },
{ label: 'New Followers', value: '1,102', change: '+24%', positive: true }];


export default function CreatorsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    creatorType: '',
    platforms: '',
    profileLinks: '',
    cuisineTopics: '',
    goals: '',
    audienceSize: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="bg-background min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-28 pb-20 px-4 relative overflow-hidden bg-foreground text-white">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://img.rocket.new/generatedImages/rocket_gen_img_1d40c8c94-1772826969087.png"
            alt="Food creator filming a cooking video in a bright kitchen"
            className="w-full h-full object-cover" />
          
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 blob-green opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-block text-accent text-xs font-bold uppercase tracking-widest mb-4">
            BUILD YOUR FOOD BRAND
          </span>
          <h1 className="text-hero-lg font-extrabold mb-6 tracking-tight">
            Create more than content.<br />
            <span className="text-primary">Build something you own.</span>
          </h1>
          <p className="text-white/80 text-xl max-w-2xl mb-10">
            Publish recipes, share videos, grow followers, organize your work, understand your audience, and prepare to earn through the Chew ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/join?type=creator" className="btn-primary text-base px-8 py-4">Apply as a Creator</Link>
            <Link href="#tools" className="btn-secondary border-white/30 text-white hover:bg-white hover:text-foreground text-base px-8 py-4">See Creator Tools</Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">

        {/* Who it's for */}
        <section aria-labelledby="who-heading">
          <div className="text-center mb-12">
            <h2 id="who-heading" className="text-3xl font-extrabold text-foreground mb-4">
              Built for every kind of food creator.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {creatorTypes.map((type) =>
            <span
              key={type}
              className="px-5 py-2.5 bg-muted text-foreground rounded-full text-sm font-medium border border-border hover:border-primary hover:text-primary transition-colors cursor-default">
              
                {type}
              </span>
            )}
          </div>
        </section>

        {/* Benefits */}
        <section id="tools" aria-labelledby="benefits-heading">
          <div className="text-center mb-12">
            <h2 id="benefits-heading" className="text-3xl font-extrabold text-foreground mb-4">
              One home for your food business.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {benefits.map((benefit, i) =>
            <div
              key={benefit.title}
              className={`rounded-2xl p-6 border border-border hover:shadow-card-hover transition-all duration-300 ${
              i === 0 ? 'lg:col-span-2 bg-primary text-white' :
              i === 3 ? 'lg:col-span-2 bg-foreground text-white' : 'bg-card'}`
              }>
              
                <span className="text-3xl mb-4 block">{benefit.icon}</span>
                <h3 className={`text-lg font-extrabold mb-2 ${i === 0 || i === 3 ? 'text-white' : 'text-foreground'}`}>
                  {benefit.title}
                </h3>
                <p className={`text-sm leading-relaxed ${i === 0 || i === 3 ? 'text-white/80' : 'text-muted-foreground'}`}>
                  {benefit.description}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Creator Profiles */}
        <section aria-labelledby="profiles-heading">
          <div className="text-center mb-12">
            <h2 id="profiles-heading" className="text-3xl font-extrabold text-foreground mb-4">
              Creators already building on Chew
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredCreators.map((creator) =>
            <div key={creator.handle} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-card-hover transition-all duration-300 group">
                <div className="h-56 overflow-hidden">
                  <img src={creator.image} alt={creator.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-extrabold text-foreground">{creator.name}</p>
                      <p className="text-muted-foreground text-sm">{creator.handle}</p>
                      <p className="text-accent text-xs font-semibold mt-0.5">{creator.specialty}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center bg-muted rounded-xl p-2">
                      <p className="font-bold text-foreground text-sm">{creator.followers}</p>
                      <p className="text-muted-foreground text-xs">followers</p>
                    </div>
                    <div className="text-center bg-muted rounded-xl p-2">
                      <p className="font-bold text-foreground text-sm">{creator.recipes}</p>
                      <p className="text-muted-foreground text-xs">recipes</p>
                    </div>
                    <div className="text-center bg-muted rounded-xl p-2">
                      <p className="font-bold text-foreground text-sm">{creator.views}</p>
                      <p className="text-muted-foreground text-xs">views</p>
                    </div>
                  </div>
                  <blockquote className="text-muted-foreground text-sm italic border-l-2 border-primary pl-3">
                    &ldquo;{creator.quote}&rdquo;
                  </blockquote>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Dashboard Preview */}
        <section aria-labelledby="dashboard-heading" className="section-cream rounded-3xl p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 id="dashboard-heading" className="text-3xl font-extrabold text-foreground">
                  Your creator command center.
                </h2>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                See what people are viewing, saving, cooking, and sharing — then use that insight to decide what to create next.
              </p>
              <div className="bg-white border border-primary/20 rounded-xl p-3 mb-4 flex items-start gap-2">
                <span className="text-primary text-sm shrink-0">🚀</span>
                <p className="text-sm text-foreground">
                  <strong>Coming in Phase 5:</strong> Publishing dashboard, analytics, newsletters, affiliate tools, and Academy LMS.{' '}
                  <a href="#apply" className="text-primary font-semibold hover:underline">Apply for early access →</a>
                </p>
              </div>
              <p className="text-xs text-muted-foreground bg-white border border-border rounded-xl p-3">
                ⚠️ Monetization features will launch in stages and may require eligibility, verification, and additional terms.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <p className="font-bold text-foreground">Creator Dashboard</p>
                <span className="text-xs bg-accent/20 text-accent font-bold px-2 py-1 rounded-full">Phase 5 — Coming Soon</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {dashboardStats.map((stat) =>
                <div key={stat.label} className="bg-muted rounded-xl p-4">
                    <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{stat.label}</p>
                    <p className={`text-xs font-semibold mt-1 ${stat.positive ? 'text-primary' : 'text-accent'}`}>{stat.change} this month</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-4 italic">Example data — not real. Dashboard launches in Phase 5.</p>
            </div>
          </div>
        </section>

        {/* Creator Academy Preview */}
        <section className="bg-foreground rounded-3xl p-8 sm:p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-accent text-xs font-bold uppercase tracking-widest">Creator Academy</span>
              <h2 className="text-3xl font-extrabold mt-2 mb-4">Learn the craft behind the content.</h2>
              <p className="text-white/80 leading-relaxed mb-6">
                From your first recipe post to a complete creator business — Creator Academy teaches the practical work behind food content.
              </p>
              <Link href="/creator-academy" className="btn-primary">Explore Creator Academy</Link>
            </div>
            <div className="space-y-3">
              {['Food Creator Foundations', 'Recipe Development & Publishing', 'Short-Form Food Video', 'Audience Growth'].map((track) =>
              <div key={track} className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <p className="text-white/90 text-sm font-medium">{track}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section id="apply" aria-labelledby="apply-heading">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 id="apply-heading" className="text-3xl font-extrabold text-foreground mb-3">
                Your next recipe could become your next audience.
              </h2>
              <p className="text-muted-foreground">Join the early creator group and help shape the platform.</p>
            </div>

            {submitted ?
            <div className="bg-muted rounded-2xl p-10 text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-xl font-extrabold text-foreground mb-2">Application received!</h3>
                <p className="text-muted-foreground">We&apos;ll be in touch soon. Welcome to the early creator group.</p>
              </div> :

            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="creator-name" className="block text-sm font-semibold text-foreground mb-1.5">Full Name *</label>
                    <input
                    id="creator-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground focus:outline-none focus:border-primary text-sm"
                    placeholder="Your name" />
                  
                  </div>
                  <div>
                    <label htmlFor="creator-email" className="block text-sm font-semibold text-foreground mb-1.5">Email Address *</label>
                    <input
                    id="creator-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground focus:outline-none focus:border-primary text-sm"
                    placeholder="you@example.com" />
                  
                  </div>
                </div>
                <div>
                  <label htmlFor="creator-type" className="block text-sm font-semibold text-foreground mb-1.5">Creator Type *</label>
                  <select
                  id="creator-type"
                  required
                  value={formData.creatorType}
                  onChange={(e) => setFormData({ ...formData, creatorType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground focus:outline-none focus:border-primary text-sm">
                  
                    <option value="">Select your creator type</option>
                    {creatorTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="creator-platforms" className="block text-sm font-semibold text-foreground mb-1.5">Platforms you currently use</label>
                  <input
                  id="creator-platforms"
                  type="text"
                  value={formData.platforms}
                  onChange={(e) => setFormData({ ...formData, platforms: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground focus:outline-none focus:border-primary text-sm"
                  placeholder="Instagram, TikTok, YouTube, blog..." />
                
                </div>
                <div>
                  <label htmlFor="creator-links" className="block text-sm font-semibold text-foreground mb-1.5">Profile links</label>
                  <input
                  id="creator-links"
                  type="text"
                  value={formData.profileLinks}
                  onChange={(e) => setFormData({ ...formData, profileLinks: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground focus:outline-none focus:border-primary text-sm"
                  placeholder="https://instagram.com/yourhandle" />
                
                </div>
                <div>
                  <label htmlFor="creator-cuisine" className="block text-sm font-semibold text-foreground mb-1.5">Cuisine or food topics *</label>
                  <input
                  id="creator-cuisine"
                  type="text"
                  required
                  value={formData.cuisineTopics}
                  onChange={(e) => setFormData({ ...formData, cuisineTopics: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground focus:outline-none focus:border-primary text-sm"
                  placeholder="Italian, baking, street food, healthy eating..." />
                
                </div>
                <div>
                  <label htmlFor="creator-goals" className="block text-sm font-semibold text-foreground mb-1.5">What are your goals? *</label>
                  <textarea
                  id="creator-goals"
                  required
                  rows={3}
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground focus:outline-none focus:border-primary text-sm resize-none"
                  placeholder="Tell us what you want to build..." />
                
                </div>
                <div>
                  <label htmlFor="creator-audience" className="block text-sm font-semibold text-foreground mb-1.5">Audience size (optional)</label>
                  <input
                  id="creator-audience"
                  type="text"
                  value={formData.audienceSize}
                  onChange={(e) => setFormData({ ...formData, audienceSize: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground focus:outline-none focus:border-primary text-sm"
                  placeholder="e.g. 5K followers across platforms" />
                
                </div>
                <button type="submit" className="btn-primary w-full justify-center text-base py-4">
                  Join the Early Creator Group
                </button>
                <p className="text-xs text-muted-foreground text-center">
                  By applying you agree to our Terms of Use and Privacy Policy. We do not guarantee income or audience growth.
                </p>
              </form>
            }
          </div>
        </section>

      </div>

      <Footer />
    </main>);

}