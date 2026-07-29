import type { Metadata } from 'next';
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SICHero from '@/app/see-it-cook-it/components/SICHero';
import SICInputCards from '@/app/see-it-cook-it/components/SICInputCards';
import SICHowItWorks from '@/app/see-it-cook-it/components/SICHowItWorks';
import SICVoiceSection from '@/app/see-it-cook-it/components/SICVoiceSection';
import SICBenefits from '@/app/see-it-cook-it/components/SICBenefits';
import SICFinalCTA from '@/app/see-it-cook-it/components/SICFinalCTA';
import SICUseCases from '@/app/see-it-cook-it/components/SICUseCases';
import SICSafetyNote from '@/app/see-it-cook-it/components/SICSafetyNote';

export const metadata: Metadata = {
  title: 'See It. Cook It. — AI Recipe Recognition | ChewNetwork',
  description: 'Show Chef Pepe a photo of any dish and get an instant recipe. Recreate restaurant meals, use leftover ingredients, and cook anything you can photograph.',
  openGraph: {
    title: 'See It. Cook It. — AI Recipe Recognition | ChewNetwork',
    description: 'Show Chef Pepe a photo of any dish and get an instant recipe.',
    url: 'https://chewnetwor2552.builtwithrocket.new/see-it-cook-it',
    siteName: 'ChewNetwork',
    images: [{ url: "https://img.rocket.new/generatedImages/rocket_gen_img_18bc21e44-1768051114791.png", width: 1200, height: 630, alt: 'See It. Cook It. by ChewNetwork' }],
    type: 'website'
  },
  twitter: { card: 'summary_large_image', title: 'See It. Cook It.', description: 'Photo-to-recipe AI by ChewNetwork.' }
};

export default function SeeItCookItPage() {
  return (
    <main className="bg-background overflow-x-hidden">
      <Header />
      <SICHero />
      <SICInputCards />
      <SICUseCases />
      <SICHowItWorks />
      <SICVoiceSection />
      <SICBenefits />
      <SICSafetyNote />
      <SICFinalCTA />
      <Footer />
    </main>);

}