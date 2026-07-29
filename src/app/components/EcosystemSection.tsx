'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

// BENTO GRID AUDIT
// Array has 4 cards: [Cook, Connect, Create, Discover]
// Row 1: [col-1: Cook cs-1 rs-2] [col-2: Connect cs-1] [col-3: Create cs-1]
// Row 2: [col-1: Cook (cont)] [col-2: Discover cs-2]
// Placed 4/4 cards ✓

const ecosystemCards = [
{
  id: 'cook',
  emoji: '🍳',
  label: 'Cook',
  heading: 'Learn to cook anything.',
  text: 'Learn techniques, follow recipes, and cook with voice guidance from Chef Pepe.',
  href: '/recipes',
  colSpan: 'lg:col-span-1',
  rowSpan: 'lg:row-span-2',
  imgSrc: "https://img.rocket.new/generatedImages/rocket_gen_img_1c3e1bf4b-1773059818986.png",
  imgAlt: 'Home cook in warm kitchen stirring a pot with steam rising, focused expression, natural light from window',
  bg: 'bg-primary',
  tall: true
},
{
  id: 'connect',
  emoji: '🤝',
  label: 'Connect',
  heading: 'Join the community.',
  text: 'Share food, follow creators, join challenges, and build community around what you love.',
  href: '/community',
  colSpan: 'lg:col-span-1',
  rowSpan: '',
  imgSrc: "https://img.rocket.new/generatedImages/rocket_gen_img_1362d8006-1777732083001.png",
  imgAlt: 'Friends laughing around a table full of colorful dishes, warm evening light, genuine joy',
  bg: 'bg-secondary',
  tall: false
},
{
  id: 'create',
  emoji: '🎬',
  label: 'Create',
  heading: 'Build your food brand.',
  text: 'Publish recipes, grow an audience, and turn food knowledge into a real brand.',
  href: '/creators',
  colSpan: 'lg:col-span-1',
  rowSpan: '',
  imgSrc: "https://images.unsplash.com/photo-1707825982640-61e75a225630",
  imgAlt: 'Food creator filming a recipe video with professional camera setup, bright studio kitchen',
  bg: 'bg-accent',
  tall: false
},
{
  id: 'discover',
  emoji: '🗺️',
  label: 'Discover',
  heading: 'Find food worth talking about.',
  text: 'Find restaurants, dishes, creators, products, and new ideas — then ask Chef Pepe how to recreate what inspires you.',
  href: '/restaurants',
  colSpan: 'lg:col-span-2',
  rowSpan: '',
  imgSrc: "https://img.rocket.new/generatedImages/rocket_gen_img_17b8d92b2-1765460593669.png",
  imgAlt: 'Aerial view of a vibrant restaurant table with multiple colorful dishes from different cuisines, warm overhead lighting',
  bg: 'bg-muted',
  tall: false,
  wide: true
}];


export default function EcosystemSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in-view');
          }
        });
      },
      { threshold: 0.1 }
    );
    const elements = sectionRef?.current?.querySelectorAll('.scroll-reveal');
    elements?.forEach((el) => observer?.observe(el));
    return () => observer?.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="section-cream py-16 lg:py-24 overflow-hidden" aria-labelledby="ecosystem-heading">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 gap-6 scroll-reveal opacity-1">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">The Chew Ecosystem</span>
            <h2 id="ecosystem-heading" className="text-hero-lg font-extrabold text-foreground">
              One network.<br />Every side of food.
            </h2>
          </div>
          <p className="text-muted-foreground text-base max-w-sm leading-relaxed lg:text-right">
            See It. Cook It. is the front door. Chew Network is the world behind it.
          </p>
        </div>

        {/* Bento grid */}
        {/* Row 1: Cook(rs-2) | Connect | Create */}
        {/* Row 2: Cook(cont) | Discover(cs-2) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 auto-rows-[320px] lg:auto-rows-[280px]">
          {/* [col-1: Cook cs-1 rs-2] */}
          <div className={`scroll-reveal opacity-1 group relative overflow-hidden rounded-3xl lg:row-span-2 flex flex-col justify-end`} style={{ animationDelay: '0.1s' }}>
            <AppImage
              src={ecosystemCards?.[0]?.imgSrc}
              alt={ecosystemCards?.[0]?.imgAlt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 33vw" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
            <div className="relative z-10 p-7">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl mb-3">{ecosystemCards?.[0]?.emoji}</div>
              <span className="text-white/70 text-xs font-bold uppercase tracking-widest block mb-1">{ecosystemCards?.[0]?.label}</span>
              <h3 className="text-white font-extrabold text-xl mb-2">{ecosystemCards?.[0]?.heading}</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-4">{ecosystemCards?.[0]?.text}</p>
              <Link href={ecosystemCards?.[0]?.href} className="inline-flex items-center gap-2 text-white text-sm font-semibold border-b border-white/40 pb-0.5 hover:border-white transition-colors group/link">
                Explore Recipes
                <Icon name="ArrowRightIcon" size={14} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* [col-2: Connect cs-1] */}
          <div className="scroll-reveal opacity-1 group relative overflow-hidden rounded-3xl flex flex-col justify-end" style={{ animationDelay: '0.2s' }}>
            <AppImage
              src={ecosystemCards?.[1]?.imgSrc}
              alt={ecosystemCards?.[1]?.imgAlt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 33vw" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="relative z-10 p-6">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl mb-3">{ecosystemCards?.[1]?.emoji}</div>
              <span className="text-white/70 text-xs font-bold uppercase tracking-widest block mb-1">{ecosystemCards?.[1]?.label}</span>
              <h3 className="text-white font-extrabold text-lg mb-2">{ecosystemCards?.[1]?.heading}</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-3">{ecosystemCards?.[1]?.text}</p>
              <Link href={ecosystemCards?.[1]?.href} className="inline-flex items-center gap-2 text-white text-sm font-semibold border-b border-white/40 pb-0.5 hover:border-white transition-colors group/link">
                Join Community
                <Icon name="ArrowRightIcon" size={14} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* [col-3: Create cs-1] */}
          <div className="scroll-reveal opacity-1 group relative overflow-hidden rounded-3xl flex flex-col justify-end" style={{ animationDelay: '0.3s' }}>
            <AppImage
              src={ecosystemCards?.[2]?.imgSrc}
              alt={ecosystemCards?.[2]?.imgAlt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 33vw" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-accent/90 via-accent/30 to-transparent" />
            <div className="relative z-10 p-6">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl mb-3">{ecosystemCards?.[2]?.emoji}</div>
              <span className="text-white/70 text-xs font-bold uppercase tracking-widest block mb-1">{ecosystemCards?.[2]?.label}</span>
              <h3 className="text-white font-extrabold text-lg mb-2">{ecosystemCards?.[2]?.heading}</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-3">{ecosystemCards?.[2]?.text}</p>
              <Link href={ecosystemCards?.[2]?.href} className="inline-flex items-center gap-2 text-white text-sm font-semibold border-b border-white/40 pb-0.5 hover:border-white transition-colors group/link">
                Become a Creator
                <Icon name="ArrowRightIcon" size={14} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* [col-2: Discover cs-2] (col-2 to col-3) */}
          <div className="scroll-reveal opacity-1 group relative overflow-hidden rounded-3xl lg:col-span-2 flex flex-col justify-end" style={{ animationDelay: '0.4s' }}>
            <AppImage
              src={ecosystemCards?.[3]?.imgSrc}
              alt={ecosystemCards?.[3]?.imgAlt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 66vw" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative z-10 p-7 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl mb-3">{ecosystemCards?.[3]?.emoji}</div>
                <span className="text-white/70 text-xs font-bold uppercase tracking-widest block mb-1">{ecosystemCards?.[3]?.label}</span>
                <h3 className="text-white font-extrabold text-xl mb-2">{ecosystemCards?.[3]?.heading}</h3>
                <p className="text-white/80 text-sm leading-relaxed max-w-md">{ecosystemCards?.[3]?.text}</p>
              </div>
              <Link href={ecosystemCards?.[3]?.href} className="inline-flex items-center gap-2 bg-white text-foreground px-5 py-3 rounded-full text-sm font-bold hover:bg-secondary transition-colors shrink-0">
                Explore Restaurants
                <Icon name="ArrowRightIcon" size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>);

}