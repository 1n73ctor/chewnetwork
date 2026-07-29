'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

// BENTO GRID AUDIT
// Array has 6 cards: [Recipe1, Recipe2, Recipe3, Recipe4, Recipe5, Recipe6]
// Mobile: grid-cols-1 (all stacked)
// Desktop: grid-cols-3
// Row 1: [col-1: Recipe1 cs-1] [col-2: Recipe2 cs-1] [col-3: Recipe3 cs-1]
// Row 2: [col-1: Recipe4 cs-1] [col-2: Recipe5 cs-1] [col-3: Recipe6 cs-1]
// Placed 6/6 cards ✓

const trendingRecipes = [
{
  id: 1,
  title: 'Miso Glazed Salmon',
  creator: 'Yuki Tanaka',
  time: '25 min',
  difficulty: 'Easy',
  tag: 'Healthy',
  tagColor: 'bg-primary',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_185162b1d-1772289647722.png",
  imageAlt: 'Golden miso-glazed salmon fillet on a dark plate with sesame seeds and green onions, Japanese restaurant style plating',
  saves: '2.4k',
  made: '891'
},
{
  id: 2,
  title: 'Birria Tacos',
  creator: 'Marco Hernández',
  time: '3 hrs',
  difficulty: 'Medium',
  tag: 'Popular',
  tagColor: 'bg-accent',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_10219b7a4-1772055932983.png",
  imageAlt: 'Crispy birria tacos with red consommé dipping broth, melted cheese, cilantro and diced onion on wooden board',
  saves: '5.1k',
  made: '1.2k'
},
{
  id: 3,
  title: 'Butter Chicken',
  creator: 'Priya Sharma',
  time: '45 min',
  difficulty: 'Medium',
  tag: 'Fan Favorite',
  tagColor: 'bg-foreground',
  image: "https://images.unsplash.com/photo-1613385109438-668d376fa611",
  imageAlt: 'Creamy orange butter chicken in a dark bowl with fresh naan bread and cilantro garnish, warm Indian kitchen setting',
  saves: '8.7k',
  made: '3.4k'
},
{
  id: 4,
  title: 'Shakshuka',
  creator: 'Layla Hassan',
  time: '20 min',
  difficulty: 'Easy',
  tag: 'Quick',
  tagColor: 'bg-primary',
  image: "https://images.unsplash.com/photo-1611962424660-201a4af8f496",
  imageAlt: 'Shakshuka eggs poached in spiced tomato sauce in a cast iron pan, feta crumbles and fresh herbs, overhead shot',
  saves: '3.2k',
  made: '1.5k'
},
{
  id: 5,
  title: 'Pasta Carbonara',
  creator: 'Sofia Romano',
  time: '20 min',
  difficulty: 'Medium',
  tag: 'Classic',
  tagColor: 'bg-accent',
  image: "https://images.unsplash.com/photo-1663721605989-3bdd2c994190",
  imageAlt: 'Creamy spaghetti carbonara with pancetta, black pepper, and parmesan cheese, twirled on a fork, Italian kitchen',
  saves: '6.3k',
  made: '2.8k'
},
{
  id: 6,
  title: 'Korean Fried Chicken',
  creator: 'Min-Jun Oh',
  time: '40 min',
  difficulty: 'Medium',
  tag: 'Trending',
  tagColor: 'bg-accent',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_123eb88d3-1783610009334.png",
  imageAlt: 'Crispy Korean fried chicken glazed with sweet gochujang sauce, sesame seeds, served in a red basket with pickled radish',
  saves: '4.8k',
  made: '1.9k'
}];


function RecipeCard({ recipe, delay }: {recipe: typeof trendingRecipes[0];delay: number;}) {
  return (
    <article
      className="card-recipe group scroll-reveal opacity-1"
      style={{ animationDelay: `${delay}s` }}
      aria-label={`Recipe: ${recipe.title}`}>
      
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <AppImage
          src={recipe.image}
          alt={recipe.imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        
        {/* Tag */}
        <div className="absolute top-3 left-3">
          <span className={`${recipe.tagColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
            {recipe.tag}
          </span>
        </div>
        {/* Save button */}
        <button
          className="absolute top-3 right-3 w-8 h-8 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-card hover:text-primary transition-all"
          aria-label={`Save ${recipe.title}`}>
          
          <Icon name="BookmarkIcon" size={14} />
        </button>
      </div>
      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">👤</div>
          <span className="text-muted-foreground text-xs font-medium">{recipe.creator}</span>
        </div>
        <h3 className="font-bold text-foreground text-base mb-3 leading-tight">{recipe.title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Icon name="ClockIcon" size={12} />
              {recipe.time}
            </span>
            <span className="flex items-center gap-1">
              <Icon name="SignalIcon" size={12} />
              {recipe.difficulty}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Icon name="FireIcon" size={12} className="text-accent" />
            <span>{recipe.made} made</span>
          </div>
        </div>
        {/* Chef Pepe button */}
        <button className="mt-3 w-full flex items-center justify-center gap-2 py-2 bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground rounded-xl text-xs font-semibold transition-all duration-200 border border-transparent hover:border-primary/20">
          <span>🍳</span>
          Ask Chef Pepe
        </button>
      </div>
    </article>);

}

export default function RecipesSection() {
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
    const elements = sectionRef.current?.querySelectorAll('.scroll-reveal');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-background py-16 lg:py-24" aria-labelledby="recipes-heading">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4 scroll-reveal opacity-1">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Trending</span>
            <h2 id="recipes-heading" className="text-hero-md font-extrabold text-foreground">Trending on Chew</h2>
          </div>
          <Link href="/recipes" className="btn-secondary text-sm px-5 py-2.5 self-start sm:self-auto">
            Explore All Recipes
            <Icon name="ArrowRightIcon" size={16} />
          </Link>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-8 scroll-reveal opacity-1" role="list" aria-label="Recipe categories">
          {['All', 'Quick & Easy', 'Dinner', 'Breakfast', 'Baking', 'Healthy', 'BBQ', 'Desserts', 'Global Flavors'].map((cat, i) =>
          <button
            key={cat}
            role="listitem"
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            i === 0 ?
            'bg-primary text-white' : 'bg-muted text-foreground hover:bg-primary/10 hover:text-primary'}`
            }
            aria-pressed={i === 0}>
            
              {cat}
            </button>
          )}
        </div>

        {/* Recipe grid */}
        {/* Desktop: 3 cols, 2 rows = 6 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingRecipes.map((recipe, i) =>
          <RecipeCard key={recipe.id} recipe={recipe} delay={i * 0.08} />
          )}
        </div>

        <div className="text-center mt-10 scroll-reveal opacity-1">
          <Link href="/recipes" className="btn-primary px-8 py-4">
            View All Recipes
            <Icon name="ArrowRightIcon" size={18} />
          </Link>
        </div>
      </div>
    </section>);

}