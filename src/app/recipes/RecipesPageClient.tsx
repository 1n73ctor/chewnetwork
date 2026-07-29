'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const categories = [
  'Quick & Easy', 'Dinner', 'Breakfast', 'Baking', 'Healthy',
  'Air Fryer', 'BBQ', 'Desserts', 'Global Flavors',
];

const cuisineOptions = ['Any', 'Italian', 'Mexican', 'Japanese', 'Indian', 'Chinese', 'Mediterranean', 'American', 'Thai', 'Korean', 'Middle Eastern'];
const mealTypeOptions = ['Any', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Drink'];
const timeOptions = ['Any', 'Under 15 min', 'Under 30 min', 'Under 1 hour', '1+ hours'];
const difficultyOptions = ['Any', 'Easy', 'Medium', 'Hard'];
const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo', 'Nut-Free'];

const featuredRecipe = {
  title: 'Crispy Honey Garlic Salmon',
  creator: 'Maria Chen',
  creatorHandle: '@mariachencooks',
  time: '25 min',
  difficulty: 'Easy',
  rating: 4.9,
  cooks: 3241,
  description: 'A weeknight hero — flaky salmon glazed with sticky honey garlic sauce, ready in under 30 minutes and guaranteed to impress.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_13581a46c-1772646980537.png",
  alt: 'Golden crispy salmon fillet glazed with honey garlic sauce on a white plate with herbs',
  tags: ['Seafood', 'Quick', 'Healthy'],
};

const trendingRecipes = [
  { title: 'Smash Burger Tacos', creator: 'Jake Torres', time: '20 min', difficulty: 'Easy', cooks: 8920, image: "https://img.rocket.new/generatedImages/rocket_gen_img_1acf3cb0a-1772799442431.png", alt: 'Smash burger patty folded in a crispy taco shell with cheese and toppings', slug: 'smash-burger-tacos' },
  { title: 'One-Pan Lemon Orzo', creator: 'Sofia Patel', time: '30 min', difficulty: 'Easy', cooks: 6104, image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927", alt: 'Creamy lemon orzo pasta with spinach and parmesan in a cast iron pan', slug: 'one-pan-lemon-orzo' },
  { title: 'Korean Corn Dogs', creator: 'Yuna Kim', time: '35 min', difficulty: 'Medium', cooks: 5432, image: "https://img.rocket.new/generatedImages/rocket_gen_img_1eead6026-1771887177210.png", alt: 'Korean-style corn dogs coated in crispy batter with sugar and ketchup drizzle', slug: 'korean-corn-dogs' },
  { title: 'Mango Coconut Chia Pudding', creator: 'Priya Nair', time: '10 min', difficulty: 'Easy', cooks: 4211, image: "https://images.unsplash.com/photo-1629180050285-7c56c6671f19", alt: 'Layered mango coconut chia pudding in a glass jar topped with fresh mango slices', slug: 'mango-coconut-chia-pudding' },
];

const quickRecipes = [
  { title: 'Garlic Butter Shrimp Pasta', creator: 'Marco Rossi', time: '20 min', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f19f6fbe-1775504653966.png", alt: 'Garlic butter shrimp tossed with linguine pasta and fresh parsley', slug: 'garlic-butter-shrimp-pasta' },
  { title: 'Avocado Toast with Poached Egg', creator: 'Emma Walsh', time: '15 min', image: "https://img.rocket.new/generatedImages/rocket_gen_img_18e6c1a9c-1772204197800.png", alt: 'Thick sourdough toast topped with smashed avocado and a perfectly poached egg', slug: 'avocado-toast-poached-egg' },
  { title: 'Spicy Peanut Noodles', creator: 'Lin Wei', time: '25 min', image: "https://images.unsplash.com/photo-1626066014976-cd53fe450b3e", alt: 'Cold spicy peanut noodles garnished with cucumber, scallions, and sesame seeds', slug: 'spicy-peanut-noodles' },
  { title: 'Sheet Pan Fajitas', creator: 'Carlos Mendez', time: '30 min', image: "https://images.unsplash.com/photo-1679060301613-2ff2050db858", alt: 'Colorful bell peppers and chicken strips roasted on a sheet pan for fajitas', slug: 'sheet-pan-fajitas' },
];

const globalRecipes = [
  { title: 'Chicken Tikka Masala', creator: 'Aisha Sharma', cuisine: 'Indian', image: "https://images.unsplash.com/photo-1657205937641-01d8c906274f", alt: 'Rich and creamy chicken tikka masala in a bowl with naan bread on the side', slug: 'chicken-tikka-masala' },
  { title: 'Beef Pho', creator: 'Nguyen Lan', cuisine: 'Vietnamese', image: "https://images.unsplash.com/photo-1707153438523-3d32f2bed0f3", alt: 'Steaming bowl of Vietnamese beef pho with rice noodles, herbs, and bean sprouts', slug: 'beef-pho' },
  { title: 'Shakshuka', creator: 'Leila Hassan', cuisine: 'Middle Eastern', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1e54a3842-1783627091192.png", alt: 'Eggs poached in spiced tomato and pepper sauce in a cast iron skillet', slug: 'shakshuka' },
  { title: 'Tacos al Pastor', creator: 'Rosa Gutierrez', cuisine: 'Mexican', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f6aa0250-1772893483543.png", alt: 'Authentic tacos al pastor with marinated pork, pineapple, cilantro, and onion', slug: 'tacos-al-pastor' },
];

const healthyRecipes = [
  { title: 'Rainbow Buddha Bowl', creator: 'Priya Nair', time: '20 min', image: "https://img.rocket.new/generatedImages/rocket_gen_img_13da08aa3-1772139613628.png", alt: 'Colorful buddha bowl with roasted vegetables, quinoa, and tahini dressing', slug: 'rainbow-buddha-bowl' },
  { title: 'Zucchini Noodles with Pesto', creator: 'Emma Walsh', time: '15 min', image: "https://img.rocket.new/generatedImages/rocket_gen_img_19ed2983c-1768144943727.png", alt: 'Spiralized zucchini noodles tossed with fresh basil pesto and cherry tomatoes', slug: 'zucchini-noodles-pesto' },
  { title: 'Grilled Chicken & Quinoa', creator: 'Sofia Patel', time: '30 min', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1105e39ee-1784981318339.png", alt: 'Grilled chicken breast sliced over fluffy quinoa with roasted vegetables', slug: 'grilled-chicken-quinoa' },
  { title: 'Berry Smoothie Bowl', creator: 'Aisha Sharma', time: '10 min', image: "https://images.unsplash.com/photo-1623783398179-078261d586d3", alt: 'Thick acai smoothie bowl topped with fresh berries, granola, and coconut flakes', slug: 'berry-smoothie-bowl' },
];

const familyRecipes = [
  { title: 'Sunday Pot Roast', creator: 'Marco Rossi', time: '3 hrs', image: "https://img.rocket.new/generatedImages/rocket_gen_img_118501734-1771898937177.png", alt: 'Slow-cooked pot roast with root vegetables in a Dutch oven', slug: 'sunday-pot-roast' },
  { title: "Grandma\'s Chicken Soup", creator: 'Rosa Gutierrez', time: '1.5 hrs', image: "https://images.unsplash.com/photo-1727417376054-a3a6d6f31999", alt: 'Hearty homemade chicken noodle soup with vegetables in a white bowl', slug: 'grandmas-chicken-soup' },
  { title: 'Classic Lasagna', creator: 'Maria Chen', time: '2 hrs', image: "https://img.rocket.new/generatedImages/rocket_gen_img_18ea24141-1772646976917.png", alt: 'Layered classic lasagna with meat sauce and bubbling mozzarella cheese', slug: 'classic-lasagna' },
  { title: 'Apple Pie from Scratch', creator: 'Emma Walsh', time: '2.5 hrs', image: "https://images.unsplash.com/photo-1638329261528-1932b0e63212", alt: 'Golden homemade apple pie with lattice crust cooling on a wooden table', slug: 'apple-pie-scratch' },
];

const spotlightCreators = [
  { name: 'Maria Chen', handle: '@mariachencooks', specialty: 'Asian Fusion', followers: '124K', recipes: 89, image: "https://img.rocket.new/generatedImages/rocket_gen_img_102df199c-1772058867782.png", alt: 'Portrait of food creator Maria Chen smiling in her kitchen' },
  { name: 'Jake Torres', handle: '@jaketorrescooks', specialty: 'Street Food', followers: '98K', recipes: 67, image: "https://img.rocket.new/generatedImages/rocket_gen_img_112cb3572-1763301680407.png", alt: 'Portrait of food creator Jake Torres holding a taco' },
  { name: 'Sofia Patel', handle: '@sofiapatelkitchen', specialty: 'Mediterranean', followers: '76K', recipes: 112, image: "https://img.rocket.new/generatedImages/rocket_gen_img_1802b76bb-1775545865831.png", alt: 'Portrait of food creator Sofia Patel in her bright kitchen' },
];

interface Recipe {
  title: string;
  creator: string;
  time?: string;
  image: string;
  alt: string;
  slug: string;
}

function RecipeCard({ recipe, size = 'md' }: { recipe: Recipe; size?: 'sm' | 'md' }) {
  return (
    <Link href={`/recipes/${recipe.slug}`} className="card-recipe group block">
      <div className={`relative overflow-hidden ${size === 'sm' ? 'h-40' : 'h-52'}`}>
        <img src={recipe.image} alt={recipe.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-foreground hover:bg-white transition-colors"
          aria-label="Save recipe"
          onClick={(e) => e.preventDefault()}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-foreground text-sm leading-snug mb-1 group-hover:text-primary transition-colors">{recipe.title}</h3>
        <p className="text-muted-foreground text-xs">{recipe.creator}</p>
        {recipe.time && (
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth={2} /><path strokeLinecap="round" strokeWidth={2} d="M12 6v6l4 2" /></svg>
              {recipe.time}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

interface FilterState {
  cuisine: string;
  mealType: string;
  time: string;
  difficulty: string;
  dietary: string[];
}

function FilterPanel({ filters, setFilters, onClose }: {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState<FilterState>(filters);

  const toggleDietary = (tag: string) => {
    setLocal(prev => ({
      ...prev,
      dietary: prev.dietary.includes(tag) ? prev.dietary.filter(d => d !== tag) : [...prev.dietary, tag],
    }));
  };

  const apply = () => { setFilters(local); onClose(); };
  const reset = () => setLocal({ cuisine: 'Any', mealType: 'Any', time: 'Any', difficulty: 'Any', dietary: [] });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Filter recipes">
      <div className="bg-card border border-border rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-3xl sm:rounded-t-3xl">
          <h2 className="font-extrabold text-foreground text-lg">Filter Recipes</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" aria-label="Close filters">✕</button>
        </div>
        <div className="p-6 space-y-6">
          {/* Cuisine */}
          <div>
            <p className="font-bold text-foreground text-sm mb-3">Cuisine</p>
            <div className="flex flex-wrap gap-2">
              {cuisineOptions.map(c => (
                <button key={c} onClick={() => setLocal({ ...local, cuisine: c })}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${local.cuisine === c ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          {/* Meal Type */}
          <div>
            <p className="font-bold text-foreground text-sm mb-3">Meal Type</p>
            <div className="flex flex-wrap gap-2">
              {mealTypeOptions.map(m => (
                <button key={m} onClick={() => setLocal({ ...local, mealType: m })}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${local.mealType === m ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          {/* Time */}
          <div>
            <p className="font-bold text-foreground text-sm mb-3">Cooking Time</p>
            <div className="flex flex-wrap gap-2">
              {timeOptions.map(t => (
                <button key={t} onClick={() => setLocal({ ...local, time: t })}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${local.time === t ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          {/* Difficulty */}
          <div>
            <p className="font-bold text-foreground text-sm mb-3">Difficulty</p>
            <div className="flex flex-wrap gap-2">
              {difficultyOptions.map(d => (
                <button key={d} onClick={() => setLocal({ ...local, difficulty: d })}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${local.difficulty === d ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          {/* Dietary */}
          <div>
            <p className="font-bold text-foreground text-sm mb-3">Dietary Tags</p>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map(d => (
                <button key={d} onClick={() => toggleDietary(d)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${local.dietary.includes(d) ? 'bg-accent text-white' : 'bg-muted text-muted-foreground hover:bg-accent/10 hover:text-accent'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex gap-3">
          <button onClick={reset} className="flex-1 btn-secondary text-sm">Reset</button>
          <button onClick={apply} className="flex-1 btn-primary text-sm">Apply Filters</button>
        </div>
      </div>
    </div>
  );
}

export default function RecipesPageClient() {
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({ cuisine: 'Any', mealType: 'Any', time: 'Any', difficulty: 'Any', dietary: [] });

  const activeFilterCount = [
    filters.cuisine !== 'Any' ? 1 : 0,
    filters.mealType !== 'Any' ? 1 : 0,
    filters.time !== 'Any' ? 1 : 0,
    filters.difficulty !== 'Any' ? 1 : 0,
    filters.dietary.length,
  ].reduce((a, b) => a + b, 0);

  return (
    <main className="bg-background min-h-screen">
      <Header />

      {/* Hero Search */}
      <section className="pt-28 pb-16 px-4 bg-gradient-to-b from-muted to-background">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-hero-lg font-extrabold text-foreground mb-4 tracking-tight">
            Find something worth cooking.
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Search by dish, ingredient, cuisine, cooking time, skill level, dietary preference, or the mood you are in.
          </p>
          <div className="relative">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Try "30-minute chicken," "vegan pasta," or "what can I make with eggs?"'
              className="w-full pl-5 pr-14 py-4 rounded-2xl border-2 border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm shadow-sm"
              aria-label="Search recipes" />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 btn-primary py-2 px-4 text-xs"
              aria-label="Search">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Category Chips + Filter Button */}
      <section className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 flex-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? '' : cat)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                  }`}>
                  {cat}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className={`shrink-0 flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all ${
                activeFilterCount > 0 ? 'border-primary text-primary bg-primary/5' : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
              }`}
              aria-label="Open filters">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </button>
          </div>
        </div>
      </section>

      {showFilters && (
        <FilterPanel filters={filters} setFilters={setFilters} onClose={() => setShowFilters(false)} />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">

        {/* Featured Recipe of the Day */}
        <section aria-labelledby="featured-heading">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Recipe of the Day</p>
              <h2 id="featured-heading" className="text-2xl font-extrabold text-foreground">Today&apos;s pick</h2>
            </div>
          </div>
          <Link href="/recipes/crispy-honey-garlic-salmon" className="group block">
            <div className="relative rounded-3xl overflow-hidden h-72 sm:h-96 lg:h-[480px]">
              <img src={featuredRecipe.image} alt={featuredRecipe.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="flex flex-wrap gap-2 mb-3">
                  {featuredRecipe.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold">{tag}</span>
                  ))}
                </div>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-2">{featuredRecipe.title}</h3>
                <p className="text-white/80 text-sm mb-4 max-w-lg hidden sm:block">{featuredRecipe.description}</p>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-white/80 text-sm">by {featuredRecipe.creator}</span>
                  <span className="text-white/60 text-sm">⏱ {featuredRecipe.time}</span>
                  <span className="text-white/60 text-sm">⭐ {featuredRecipe.rating}</span>
                  <span className="text-white/60 text-sm">🍳 {featuredRecipe.cooks.toLocaleString()} made this</span>
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* Trending on Chew */}
        <section aria-labelledby="trending-heading">
          <div className="flex items-center justify-between mb-6">
            <h2 id="trending-heading" className="text-2xl font-extrabold text-foreground">Trending on Chew</h2>
            <Link href="/recipes?filter=trending" className="text-primary text-sm font-semibold hover:underline">See all</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingRecipes.map((recipe) => (
              <Link key={recipe.slug} href={`/recipes/${recipe.slug}`} className="card-recipe group block">
                <div className="relative h-48 overflow-hidden">
                  <img src={recipe.image} alt={recipe.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-white text-xs font-semibold bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">🔥 {recipe.cooks.toLocaleString()} made this</span>
                  </div>
                  <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors" aria-label="Save recipe" onClick={(e) => e.preventDefault()}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-foreground text-sm leading-snug mb-1 group-hover:text-primary transition-colors">{recipe.title}</h3>
                  <p className="text-muted-foreground text-xs mb-2">{recipe.creator}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">⏱ {recipe.time}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${recipe.difficulty === 'Easy' ? 'bg-muted text-primary' : 'bg-secondary text-accent'}`}>{recipe.difficulty}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Ready in 30 minutes */}
        <section aria-labelledby="quick-heading">
          <div className="flex items-center justify-between mb-6">
            <h2 id="quick-heading" className="text-2xl font-extrabold text-foreground">Ready in 30 minutes or less</h2>
            <Link href="/recipes?filter=quick" className="text-primary text-sm font-semibold hover:underline">See all</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4">
            {quickRecipes.map((recipe) => (
              <div key={recipe.slug} className="shrink-0 w-56 lg:w-auto">
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        </section>

        {/* Cook around the world */}
        <section aria-labelledby="global-heading" className="section-cream rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 id="global-heading" className="text-2xl font-extrabold text-foreground">Cook around the world</h2>
              <p className="text-muted-foreground text-sm mt-1">Explore cuisines from every corner of the globe</p>
            </div>
            <Link href="/recipes?filter=global" className="text-primary text-sm font-semibold hover:underline">See all</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {globalRecipes.map((recipe) => (
              <Link key={recipe.slug} href={`/recipes/${recipe.slug}`} className="card-recipe group block">
                <div className="relative h-44 overflow-hidden">
                  <img src={recipe.image} alt={recipe.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-white text-xs font-bold bg-accent/80 px-2 py-1 rounded-full">{recipe.cuisine}</span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{recipe.title}</h3>
                  <p className="text-muted-foreground text-xs mt-0.5">{recipe.creator}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Healthy choices */}
        <section aria-labelledby="healthy-heading">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 id="healthy-heading" className="text-2xl font-extrabold text-foreground">Healthy choices</h2>
              <p className="text-muted-foreground text-sm mt-1">Fresh, balanced, and full of flavor</p>
            </div>
            <Link href="/recipes?filter=healthy" className="text-primary text-sm font-semibold hover:underline">See all</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4">
            {healthyRecipes.map((recipe) => (
              <div key={recipe.slug} className="shrink-0 w-56 lg:w-auto">
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        </section>

        {/* Family recipes */}
        <section aria-labelledby="family-heading">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 id="family-heading" className="text-2xl font-extrabold text-foreground">Family recipes</h2>
              <p className="text-muted-foreground text-sm mt-1">Recipes worth passing down</p>
            </div>
            <Link href="/recipes?filter=family" className="text-primary text-sm font-semibold hover:underline">See all</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {familyRecipes.map((recipe) => (
              <Link key={recipe.slug} href={`/recipes/${recipe.slug}`} className="card-recipe group block">
                <div className="relative h-44 overflow-hidden">
                  <img src={recipe.image} alt={recipe.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{recipe.title}</h3>
                  <p className="text-muted-foreground text-xs mt-0.5">{recipe.creator} · {recipe.time}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Creator Spotlight */}
        <section aria-labelledby="creators-heading">
          <div className="flex items-center justify-between mb-6">
            <h2 id="creators-heading" className="text-2xl font-extrabold text-foreground">Creators to watch</h2>
            <Link href="/creators" className="text-primary text-sm font-semibold hover:underline">All creators</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {spotlightCreators.map((creator) => (
              <div key={creator.handle} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 hover:shadow-card-hover transition-all duration-300">
                <img src={creator.image} alt={creator.alt} className="w-14 h-14 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground text-sm">{creator.name}</p>
                  <p className="text-muted-foreground text-xs">{creator.handle}</p>
                  <p className="text-xs text-accent font-medium mt-0.5">{creator.specialty}</p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">{creator.followers} followers</span>
                    <span className="text-xs text-muted-foreground">{creator.recipes} recipes</span>
                  </div>
                </div>
                <button className="btn-secondary py-1.5 px-3 text-xs shrink-0">Follow</button>
              </div>
            ))}
          </div>
        </section>

        {/* Join CTA */}
        <section className="bg-foreground rounded-3xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Save recipes. Build collections. Cook with Chef Pepe.
          </h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Create your free account to save favourites, build meal plans, and get step-by-step help from Chef Pepe.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/join" className="btn-primary">Join Chew — it&apos;s free</Link>
            <Link href="/chef-pepe" className="btn-secondary border-white/30 text-white hover:bg-white hover:text-foreground">Ask Chef Pepe</Link>
          </div>
        </section>

      </div>

      <Footer />
    </main>
  );
}
