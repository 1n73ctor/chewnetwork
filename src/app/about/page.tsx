import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const products = [
{
  icon: '📱',
  name: 'See It. Cook It.',
  description: 'Point your camera at any meal and get a recipe. Scan ingredients and discover what to cook. Follow step-by-step voice guidance from Chef Pepe.',
  href: '/see-it-cook-it',
  color: 'bg-primary'
},
{
  icon: '🍳',
  name: 'Chew Network',
  description: 'A community and daily destination for food lovers. Share what you cook, follow creators, join challenges, and discover recipes worth making.',
  href: '/community',
  color: 'bg-accent'
},
{
  icon: '🎓',
  name: 'Creator Academy',
  description: 'Practical education for food creators. From your first recipe post to a complete creator business — learn the craft behind the content.',
  href: '/creator-academy',
  color: 'bg-dark-panel'
}];


const whatWeCanBuild = [
'AI cooking applications',
'Creator tools',
'Restaurant products',
'Food communities',
'Education',
'Smart kitchen experiences',
'Discovery products',
'Commerce and partnerships'];


const principles = [
{ text: 'Useful before flashy.' },
{ text: 'Food-first, technology-second.' },
{ text: 'Welcoming to beginners.' },
{ text: 'Respectful of cultures and creators.' },
{ text: 'Honest about AI limitations.' },
{ text: 'Designed for participation, not passive scrolling.' }];


const roadmapStages = [
{
  stage: '01',
  title: 'Build the front door.',
  description: 'Launch ChewNetwork.com with See It. Cook It., Chef Pepe, and the core recipe and community experience.',
  status: 'In progress',
  statusColor: 'bg-primary'
},
{
  stage: '02',
  title: 'Grow the network.',
  description: 'Expand creator tools, community features, restaurant discovery, and the Creator Academy.',
  status: 'Coming next',
  statusColor: 'bg-accent'
},
{
  stage: '03',
  title: 'Expand the products.',
  description: 'Voice cooking, smart kitchen integrations, commerce, brand partnerships, and new food experiences.',
  status: 'Future',
  statusColor: 'bg-muted-foreground'
}];


export default function AboutPage() {
  return (
    <main className="bg-background min-h-screen">
      <Header />
      {/* Vision Hero */}
      <section className="pt-28 pb-20 px-4 bg-dark-panel text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1721742603176-a0edbf7abdc8"
            alt="Modern kitchen with technology and fresh ingredients"
            className="w-full h-full object-cover" />
          
        </div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] blob-green opacity-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 blob-orange opacity-20" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-block text-accent text-xs font-bold uppercase tracking-widest mb-6">
            A FOOD TECHNOLOGY COMPANY
          </span>
          <h1 className="text-hero-lg font-extrabold mb-8 tracking-tight leading-tight">
            We are building useful technology for the way people cook, share, discover, and build around food.
          </h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/see-it-cook-it" className="btn-primary text-base px-8 py-4">Explore See It. Cook It.</Link>
            <Link href="/chef-pepe" className="btn-secondary border-white/30 text-white hover:bg-white hover:text-[#1a1f1b] text-base px-8 py-4">Meet Chef Pepe</Link>
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">

        {/* Company Story */}
        <section aria-labelledby="story-heading">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 id="story-heading" className="text-3xl font-extrabold text-foreground mb-6">
                How Chew started.
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Chew began with a simple idea: people should be able to see a meal and understand how to make it. That idea became See It. Cook It. — and then revealed a much bigger opportunity.
                </p>
                <p>
                  The real future is a connected network where cooking help, creators, communities, restaurants, education, and new food products work together.
                </p>
                <p>
                  We are building that network — one useful product at a time.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden h-80">
                <img
                  src="https://images.unsplash.com/photo-1705300397099-80ba6a1ce6d8"
                  alt="A person using a phone to scan a meal in a restaurant, discovering the recipe"
                  className="w-full h-full object-cover" />
                
              </div>
              <div className="absolute -bottom-4 -left-4 bg-primary text-white rounded-2xl p-4 shadow-green-glow">
                <p className="text-2xl font-extrabold">See It.</p>
                <p className="text-2xl font-extrabold">Cook It.</p>
                <p className="text-white/70 text-xs mt-1">The idea that started it all</p>
              </div>
            </div>
          </div>
        </section>

        {/* Ecosystem */}
        <section aria-labelledby="ecosystem-heading" className="section-cream rounded-3xl p-8 sm:p-12">
          <div className="text-center mb-12">
            <h2 id="ecosystem-heading" className="text-3xl font-extrabold text-foreground mb-4">
              See It. Cook It. is the front door.<br />
              <span className="text-primary">Chew Network is the world behind it.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {products?.map((product) =>
            <Link key={product?.name} href={product?.href} className="group block bg-card border border-border rounded-2xl p-7 hover:shadow-card-hover transition-all duration-300">
                <div className={`w-12 h-12 ${product?.color} rounded-2xl flex items-center justify-center text-2xl mb-5`}>
                  {product?.icon}
                </div>
                <h3 className="font-extrabold text-foreground text-lg mb-3 group-hover:text-primary transition-colors">{product?.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{product?.description}</p>
                <div className="flex items-center gap-1 mt-4 text-primary text-sm font-semibold">
                  Learn more
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            )}
          </div>
        </section>

        {/* What We Build */}
        <section aria-labelledby="what-heading">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 id="what-heading" className="text-3xl font-extrabold text-foreground mb-4">
                What Chew can build next.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We are not building one app. We are building a platform for what food can become next — with technology that serves people, not the other way around.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {whatWeCanBuild?.map((item) =>
              <div key={item} className="bg-muted rounded-xl p-4 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <p className="text-foreground text-sm font-medium">{item}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Principles */}
        <section aria-labelledby="principles-heading" className="bg-dark-panel rounded-3xl p-8 sm:p-12 text-white">
          <h2 id="principles-heading" className="text-3xl font-extrabold mb-10 text-center">
            How we want to build.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {principles?.map((p, i) =>
            <div key={i} className="bg-white/10 rounded-2xl p-5 border border-white/10">
                <p className="text-white font-semibold leading-relaxed">{p?.text}</p>
              </div>
            )}
          </div>
        </section>

        {/* Roadmap */}
        <section aria-labelledby="roadmap-heading">
          <div className="text-center mb-12">
            <h2 id="roadmap-heading" className="text-3xl font-extrabold text-foreground mb-4">
              Build the front door. Grow the network. Expand the products.
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Chew is building in stages. Each phase adds more value to the network.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {roadmapStages?.map((stage) =>
            <div key={stage?.stage} className="bg-card border border-border rounded-2xl p-7 relative overflow-hidden">
                <span className="absolute top-5 right-5 text-6xl font-extrabold text-border/40">{stage?.stage}</span>
                <span className={`inline-block ${stage?.statusColor} text-white text-xs font-bold px-3 py-1 rounded-full mb-4`}>
                  {stage?.status}
                </span>
                <h3 className="font-extrabold text-foreground text-xl mb-3">{stage?.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{stage?.description}</p>
              </div>
            )}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">
            Roadmap shows direction, not fixed release dates. Stages may evolve as the platform grows.
          </p>
        </section>

        {/* Final Statement */}
        <section className="text-center py-8">
          <p className="text-2xl sm:text-3xl font-extrabold text-foreground max-w-2xl mx-auto leading-tight">
            Chew is not one app. It is a platform for what food can become next.
          </p>
        </section>

        {/* CTA Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
          { label: 'Become a Creator', href: '/creators', style: 'btn-primary' },
          { label: 'Partner with Chew', href: '/contact?topic=partnership', style: 'btn-secondary' },
          { label: 'Join Chew', href: '/join', style: 'btn-accent' },
          { label: 'Meet Chef Pepe', href: '/chef-pepe', style: 'btn-secondary' }]?.
          map((cta) =>
          <Link key={cta?.label} href={cta?.href} className={`${cta?.style} justify-center`}>
              {cta?.label}
            </Link>
          )}
        </section>

      </div>
      <Footer />
    </main>);

}