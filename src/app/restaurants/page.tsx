import type { Metadata } from 'next';
import RestaurantsPageClient from './RestaurantsPageClient';

export const metadata: Metadata = {
  title: 'Restaurants — Find Food Worth Leaving Home For | ChewNetwork',
  description: 'Discover restaurants, signature dishes, creator recommendations, and neighborhood guides. Find the best local food near you.',
  openGraph: {
    title: 'Restaurants | ChewNetwork',
    description: 'Find restaurants, signature dishes, and creator recommendations.',
    url: 'https://chewnetwor2552.builtwithrocket.new/restaurants',
    siteName: 'ChewNetwork',
    images: [{ url: "https://img.rocket.new/generatedImages/rocket_gen_img_172beaf75-1785320436347.png", width: 1200, height: 630, alt: 'ChewNetwork Restaurants' }],
    type: 'website'
  }
};

export default function RestaurantsPage() {
  return <RestaurantsPageClient />;
}