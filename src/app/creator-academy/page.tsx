import type { Metadata } from 'next';
import CreatorAcademyClient from './CreatorAcademyClient';

export const metadata: Metadata = {
  title: 'Creator Academy — Learn Food Content Creation | ChewNetwork',
  description: 'Turn your love of food into real skills. Creator Academy teaches recipe development, food video, audience growth, and building a food brand.',
  openGraph: {
    title: 'Creator Academy | ChewNetwork',
    description: 'Learn food content creation from recipe development to brand building.',
    url: 'https://chewnetwor2552.builtwithrocket.new/creator-academy',
    siteName: 'ChewNetwork',
    images: [{ url: "https://img.rocket.new/generatedImages/rocket_gen_img_19b187bae-1774423544344.png", width: 1200, height: 630, alt: 'ChewNetwork Creator Academy' }],
    type: 'website'
  }
};

export default function CreatorAcademyPage() {
  return <CreatorAcademyClient />;
}