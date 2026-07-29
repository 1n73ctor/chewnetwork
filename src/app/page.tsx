import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/app/components/HeroSection';
import SearchSection from '@/app/components/SearchSection';
import SeeItCookItDemo from '@/app/components/SeeItCookItDemo';
import EcosystemSection from '@/app/components/EcosystemSection';
import RecipesSection from '@/app/components/RecipesSection';
import ChallengeSection from '@/app/components/ChallengeSection';
import CreatorSection from '@/app/components/CreatorSection';
import RestaurantSection from '@/app/components/RestaurantSection';
import AcademySection from '@/app/components/AcademySection';
import SignupCTA from '@/app/components/SignupCTA';

export const metadata: Metadata = {
  title: 'ChewNetwork — The Future Home of Food',
  description: 'Discover what to cook, learn with Chef Pepe, share recipes, find restaurants, and build a food brand — all inside one connected network.',
  openGraph: {
    title: 'ChewNetwork — The Future Home of Food',
    description: 'See It. Cook It. Chef Pepe is your AI cooking companion.',
    url: 'https://chewnetwor2552.builtwithrocket.new',
    siteName: 'ChewNetwork',
    images: [{ url: "https://img.rocket.new/generatedImages/rocket_gen_img_144f6c0a5-1770870738147.png", width: 1200, height: 630, alt: 'ChewNetwork' }],
    type: 'website'
  },
  twitter: { card: 'summary_large_image', title: 'ChewNetwork', description: 'The future home of food.' }
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ChewNetwork',
  url: 'https://chewnetwor2552.builtwithrocket.new',
  logo: "https://img.rocket.new/generatedImages/rocket_gen_img_10f1b1f87-1765637875998.png",
  description: 'ChewNetwork is the future home of food — recipes, AI cooking companion, creator tools, and restaurant discovery.',
  sameAs: []
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ChewNetwork',
  url: 'https://chewnetwor2552.builtwithrocket.new',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://chewnetwor2552.builtwithrocket.new/recipes?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <main className="bg-background overflow-x-hidden">
        <Header />
        <HeroSection />
        <SearchSection />
        <SeeItCookItDemo />
        <EcosystemSection />
        <RecipesSection />
        <ChallengeSection />
        <CreatorSection />
        <RestaurantSection />
        <AcademySection />
        <SignupCTA />
        <Footer />
      </main>
    </>);

}