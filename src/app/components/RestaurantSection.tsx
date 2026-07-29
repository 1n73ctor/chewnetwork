'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const restaurants = [
{
  id: 1,
  name: 'Nobu Los Angeles',
  cuisine: 'Japanese Fusion',
  neighborhood: 'West Hollywood, CA',
  priceIndicator: '$$$$',
  signatureDish: 'Black Cod Miso',
  status: 'Open Now',
  image: "https://images.unsplash.com/photo-1664642444737-24bd46367473",
  imageAlt: 'Elegant Japanese restaurant interior with dark wood, soft lighting and artistic plating of black cod on white ceramic'
},
{
  id: 2,
  name: 'Cosme',
  cuisine: 'Modern Mexican',
  neighborhood: 'Flatiron, New York',
  priceIndicator: '$$$',
  signatureDish: 'Corn Husk Meringue',
  status: 'Open Now',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c6be30ae-1776042174476.png",
  imageAlt: 'Modern Mexican restaurant with artistic food presentation, warm amber lighting and colorful ceramic tableware'
},
{
  id: 3,
  name: 'Dishoom',
  cuisine: 'Bombay Café',
  neighborhood: 'Covent Garden, London',
  priceIndicator: '$$',
  signatureDish: 'Black Daal',
  status: 'Closes at 11pm',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_10170e227-1774016128002.png",
  imageAlt: 'Bustling Bombay café with vintage decor, warm Edison bulbs, and packed tables of diners enjoying Indian food'
}];


export default function RestaurantSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate-in-view');
        });
      },
      { threshold: 0.1 }
    );
    const elements = sectionRef?.current?.querySelectorAll('.scroll-reveal');
    elements?.forEach((el) => observer?.observe(el));
    return () => observer?.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-background py-16 lg:py-24 overflow-hidden" aria-labelledby="restaurants-heading">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 gap-6 scroll-reveal opacity-1">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Discover</span>
            <h2 id="restaurants-heading" className="text-hero-md font-extrabold text-foreground">
              Discover food worth<br />leaving home for.
            </h2>
          </div>
          <div className="max-w-xs">
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Explore restaurants, signature dishes, creator visits, and local food stories — then ask Chef Pepe how to recreate what inspires you.
            </p>
            <Link href="/restaurants" className="btn-secondary text-sm px-5 py-2.5 self-start">
              Explore Restaurants
              <Icon name="ArrowRightIcon" size={16} />
            </Link>
          </div>
        </div>

        {/* Restaurant cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {restaurants?.map((rest, i) =>
          <article
            key={rest?.id}
            className="scroll-reveal opacity-1 group bg-card border border-border rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            style={{ animationDelay: `${i * 0.12}s` }}
            aria-label={`Restaurant: ${rest?.name}`}>
            
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <AppImage
                src={rest?.image}
                alt={rest?.imageAlt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 33vw" />
              
                {/* Status badge */}
                <div className="absolute top-3 left-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${rest?.status === 'Open Now' ? 'bg-primary/90 text-white' : 'bg-foreground/80 text-white'}`}>
                    {rest?.status}
                  </span>
                </div>
              </div>
              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-extrabold text-foreground text-base leading-tight">{rest?.name}</h3>
                  <span className="text-muted-foreground text-xs font-medium ml-2 shrink-0">{rest?.priceIndicator}</span>
                </div>
                <p className="text-primary text-xs font-semibold mb-1">{rest?.cuisine}</p>
                <p className="text-muted-foreground text-xs mb-3 flex items-center gap-1">
                  <Icon name="MapPinIcon" size={12} />
                  {rest?.neighborhood}
                </p>
                <div className="flex items-center gap-2 py-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">Signature dish:</span>
                  <span className="text-xs font-bold text-foreground">{rest?.signatureDish}</span>
                </div>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground rounded-xl text-xs font-semibold transition-all duration-200 mt-2">
                  <span>🍳</span>
                  Ask Chef Pepe to Recreate
                </button>
              </div>
            </article>
          )}
        </div>

        {/* Partner CTA */}
        <div className="scroll-reveal opacity-1 bg-muted rounded-3xl p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-extrabold text-foreground text-xl mb-2">Put your restaurant inside Chew Network.</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              Claim your profile, showcase signature dishes, connect with creators, and prepare for future reservations and ordering tools.
            </p>
          </div>
          <Link href="/join?type=restaurant" className="btn-primary shrink-0 px-6 py-3">
            <Icon name="BuildingStorefrontIcon" size={18} />
            Claim Your Restaurant
          </Link>
        </div>
      </div>
    </section>);

}