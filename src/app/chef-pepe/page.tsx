import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChefPepeHero from '@/app/chef-pepe/components/ChefPepeHero';
import ChefPepeDemo from '@/app/chef-pepe/components/ChefPepeDemo';
import ChefPepeCapabilities from '@/app/chef-pepe/components/ChefPepeCapabilities';
import ChefPepePersonality from '@/app/chef-pepe/components/ChefPepePersonality';
import ChefPepeModes from '@/app/chef-pepe/components/ChefPepeModes';
import ChefPepeSafety from '@/app/chef-pepe/components/ChefPepeSafety';
import ChefPepeCTA from '@/app/chef-pepe/components/ChefPepeCTA';
import ChefPepeConversations from '@/app/chef-pepe/components/ChefPepeConversations';
import ChefPepeFeedback from '@/app/chef-pepe/components/ChefPepeFeedback';

export const metadata: Metadata = {
  title: 'Chef Pepe — Your AI Cooking Companion | ChewNetwork',
  description: 'Meet Chef Pepe, your AI-powered cooking companion. Get step-by-step guidance, recipe help, ingredient substitutions, and meal planning — by voice or text.',
  openGraph: {
    title: 'Chef Pepe — Your AI Cooking Companion | ChewNetwork',
    description: 'Meet Chef Pepe, your AI-powered cooking companion. Get step-by-step guidance, recipe help, and meal planning — by voice or text.',
    url: 'https://chewnetwor2552.builtwithrocket.new/chef-pepe',
    siteName: 'ChewNetwork',
    images: [{ url: "https://img.rocket.new/generatedImages/rocket_gen_img_11f658fde-1773070258668.png", width: 1200, height: 630, alt: 'Chef Pepe AI Cooking Companion' }],
    type: 'website'
  },
  twitter: { card: 'summary_large_image', title: 'Chef Pepe — Your AI Cooking Companion', description: 'AI-powered cooking help by voice or text.' }
};

export default function ChefPepePage() {
  return (
    <main className="bg-background overflow-x-hidden">
      <Header />
      <ChefPepeHero />
      <ChefPepeDemo />
      <ChefPepeConversations />
      <ChefPepeCapabilities />
      <ChefPepePersonality />
      <ChefPepeModes />
      <ChefPepeSafety />
      <ChefPepeFeedback />
      <ChefPepeCTA />
      <Footer />
    </main>);

}