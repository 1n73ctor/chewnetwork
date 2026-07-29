import type { Metadata } from 'next';
import JoinPageClient from './JoinPageClient';

export const metadata: Metadata = {
  title: 'Join ChewNetwork — Create Your Free Account',
  description: 'Join ChewNetwork to save recipes, cook with Chef Pepe, follow creators, find restaurants, and build your food brand. Free to join.',
  openGraph: {
    title: 'Join ChewNetwork',
    description: 'Create your free account and start cooking with Chef Pepe.',
    url: 'https://chewnetwor2552.builtwithrocket.new/join',
    siteName: 'ChewNetwork',
    images: [{ url: "https://img.rocket.new/generatedImages/rocket_gen_img_144f6c0a5-1770870738147.png", width: 1200, height: 630, alt: 'Join ChewNetwork' }],
    type: 'website'
  }
};

export default function JoinPage() {
  return <JoinPageClient />;
}