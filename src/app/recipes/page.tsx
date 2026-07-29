import type { Metadata } from 'next';
import React from 'react';


import RecipesPageClient from './RecipesPageClient';

export const metadata: Metadata = {
  title: 'Recipes — Discover What to Cook | ChewNetwork',
  description: 'Browse thousands of recipes by cuisine, meal type, dietary preference, cooking time, and difficulty. Find trending dishes, quick weeknight meals, and family favorites.',
  openGraph: {
    title: 'Recipes — Discover What to Cook | ChewNetwork',
    description: 'Browse recipes by cuisine, meal type, dietary preference, and more.',
    url: 'https://chewnetwor2552.builtwithrocket.new/recipes',
    siteName: 'ChewNetwork',
    images: [{ url: "https://img.rocket.new/generatedImages/rocket_gen_img_1885f0a78-1767146675664.png", width: 1200, height: 630, alt: 'ChewNetwork Recipes' }],
    type: 'website'
  },
  twitter: { card: 'summary_large_image', title: 'Recipes | ChewNetwork', description: 'Discover what to cook today.' }
};

export default function RecipesPage() {
  return <RecipesPageClient />;
}