'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const creators = [
{
  name: 'Priya Sharma',
  handle: '@priyacooks',
  cuisine: 'Indian & Fusion',
  followers: '48k',
  recipes: 127,
  flag: '🇮🇳',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_178bba9c8-1763299141008.png",
  imageAlt: 'Smiling South Asian woman food creator in a bright home kitchen, warm natural light'
},
{
  name: 'Marco Hernández',
  handle: '@marcoeats',
  cuisine: 'Mexican Street Food',
  followers: '62k',
  recipes: 89,
  flag: '🇲🇽',
  image: "https://images.unsplash.com/photo-1703762484614-1280f5118323",
  imageAlt: 'Latino man smiling in outdoor market surrounded by colorful peppers and spices'
},
{
  name: 'Yuki Tanaka',
  handle: '@yukikitchen',
  cuisine: 'Japanese Home Cooking',
  followers: '35k',
  recipes: 204,
  flag: '🇯🇵',
  image: "https://images.unsplash.com/photo-1691437690886-cb73f6f807ec",
  imageAlt: 'Japanese woman food creator smiling at camera in a clean minimalist kitchen'
},
{
  name: 'Layla Hassan',
  handle: '@laylaseats',
  cuisine: 'Middle Eastern',
  followers: '29k',
  recipes: 156,
  flag: '🇱🇧',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_13178a167-1768283813880.png",
  imageAlt: 'Lebanese woman food creator laughing in a warm kitchen with herbs and spices visible'
}];


const benefits = [
{ icon: '📝', label: 'Publish', desc: 'Recipes, articles, photos, videos, and collections.' },
{ icon: '📈', label: 'Grow', desc: 'Profiles, followers, discovery, and community challenges.' },
{ icon: '📊', label: 'Understand', desc: 'Analytics for views, saves, cooks, and engagement.' },
{ icon: '💰', label: 'Earn', desc: 'Future affiliate tools, brand opportunities, and storefronts.' }];


export default function CreatorSection() {
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
    <section ref={sectionRef} className="bg-[#1a1f1b] py-16 lg:py-24 overflow-hidden" aria-labelledby="creator-heading">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-14">
          <div className="scroll-reveal opacity-1">
            <span className="text-xs font-bold uppercase tracking-widest text-accent mb-3 block">Build Your Food Brand</span>
            <h2 id="creator-heading" className="text-hero-lg font-extrabold text-white mb-4">
              Create more than content.<br />Build something you own.
            </h2>
            <p className="text-white/70 text-base leading-relaxed mb-6 max-w-md">
              Publish recipes, share videos, grow followers, organize your work, understand your audience, and prepare to earn through the Chew ecosystem.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/creators" className="btn-primary">
                <Icon name="SparklesIcon" size={18} />
                Become a Creator
              </Link>
              <Link href="/creator-academy" className="inline-flex items-center gap-2 border border-white/20 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/10 transition-all duration-200">
                Explore Creator Academy
              </Link>
            </div>
          </div>

          {/* Benefits grid */}
          <div className="grid grid-cols-2 gap-4 scroll-reveal opacity-1">
            {benefits?.map((b, i) =>
            <div
              key={b?.label}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all duration-300"
              style={{ animationDelay: `${i * 0.1}s` }}>
              
                <div className="text-2xl mb-3">{b?.icon}</div>
                <p className="text-white font-bold text-sm mb-1">{b?.label}</p>
                <p className="text-white/60 text-xs leading-relaxed">{b?.desc}</p>
              </div>
            )}
          </div>
        </div>

        {/* Creator cards */}
        <div>
          <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-6 scroll-reveal opacity-1">Featured Creators</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {creators?.map((creator, i) =>
            <div
              key={creator?.name}
              className="scroll-reveal opacity-1 group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              style={{ animationDelay: `${i * 0.1}s` }}>
              
                <div className="relative h-36 overflow-hidden">
                  <AppImage
                  src={creator?.image}
                  alt={creator?.imageAlt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw" />
                
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-2 left-2 text-2xl">{creator?.flag}</span>
                </div>
                <div className="p-4">
                  <p className="text-white font-bold text-sm mb-0.5">{creator?.name}</p>
                  <p className="text-primary text-xs font-medium mb-1">{creator?.handle}</p>
                  <p className="text-white/50 text-xs mb-3">{creator?.cuisine}</p>
                  <div className="flex justify-between text-xs text-white/60">
                    <span><span className="text-white font-bold">{creator?.followers}</span> followers</span>
                    <span><span className="text-white font-bold">{creator?.recipes}</span> recipes</span>
                  </div>
                  <button className="mt-3 w-full py-2 bg-white/10 hover:bg-primary text-white rounded-xl text-xs font-semibold transition-all duration-200">
                    Follow
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

}