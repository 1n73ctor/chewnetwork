'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Recipe, RecipeCardData } from '@/lib/recipes';

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function CreatorAvatar({ recipe, className = 'w-10 h-10' }: { recipe: Recipe; className?: string }) {
  if (recipe.creator_image) {
    return (
      <img
        src={recipe.creator_image}
        alt={recipe.creator_alt || `Portrait of ${recipe.creator_name}`}
        className={`${className} rounded-full object-cover`} />);

  }
  return (
    <div
      className={`${className} rounded-full bg-primary/15 text-primary flex items-center justify-center font-extrabold text-sm`}
      aria-hidden="true">

      {initials(recipe.creator_name)}
    </div>);

}

export default function RecipeDetailClient({
  recipe,
  related


}: {recipe: Recipe;related: RecipeCardData[];}) {
  const [servings, setServings] = useState(recipe.servings);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [voiceEmail, setVoiceEmail] = useState('');
  const [voiceSubmitted, setVoiceSubmitted] = useState(false);
  const [mealPlanToast, setMealPlanToast] = useState(false);

  const toggleStep = (stepNum: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepNum)) next.delete(stepNum);else
      next.add(stepNum);
      return next;
    });
  };

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);else
      next.add(idx);
      return next;
    });
  };

  const scaleAmount = (amount: string) => {
    if (!amount) return '';
    const num = parseFloat(amount);
    if (isNaN(num)) return amount;
    const scaled = num * servings / recipe.servings;
    return scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(1);
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  const handleReportSubmit = () => {
    setReportSubmitted(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReportSubmitted(false);
      setReportReason('');
    }, 2000);
  };

  const handleMealPlan = () => {
    setMealPlanToast(true);
    setTimeout(() => setMealPlanToast(false), 2500);
  };

  const handleVoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVoiceSubmitted(true);
    setTimeout(() => {
      setShowVoiceModal(false);
      setVoiceSubmitted(false);
      setVoiceEmail('');
    }, 2500);
  };

  const cuisineHref = `/recipes?cuisine=${encodeURIComponent(recipe.cuisine.toLowerCase().replace(/\s+/g, '-'))}`;

  return (
    <main className="bg-background min-h-screen pb-24 lg:pb-0">
      <Header />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="pt-20 bg-background border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            </li>
            <li aria-hidden="true" className="text-border">›</li>
            <li>
              <Link href="/recipes" className="hover:text-primary transition-colors">Recipes</Link>
            </li>
            {recipe.cuisine &&
            <>
                <li aria-hidden="true" className="text-border">›</li>
                <li>
                  <Link href={cuisineHref} className="hover:text-primary transition-colors">{recipe.cuisine}</Link>
                </li>
              </>
            }
            <li aria-hidden="true" className="text-border">›</li>
            <li className="text-foreground font-medium truncate max-w-[200px]" aria-current="page">
              {recipe.title}
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero — same image as the recipe card that linked here */}
      <section aria-label="Recipe hero">
        <div className="relative h-72 sm:h-96 lg:h-[520px] overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.image_alt || recipe.title}
            className="w-full h-full object-cover" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-5xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              {recipe.tags.map((tag) =>
              <span key={tag} className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold">
                  {tag}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3 leading-tight">
              {recipe.title}
            </h1>
            <p className="text-white/80 text-base max-w-2xl hidden sm:block">{recipe.description}</p>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">

            {/* Creator attribution */}
            <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-border">
              <Link href="/creators" className="flex items-center gap-3 group">
                <CreatorAvatar recipe={recipe} />
                <div>
                  <p className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                    {recipe.creator_name}
                  </p>
                  {recipe.creator_handle &&
                  <p className="text-muted-foreground text-xs">{recipe.creator_handle}</p>
                  }
                </div>
              </Link>

              <button
                onClick={() => setFollowing(!following)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                following ?
                'bg-accent text-white border-accent' : 'border-border text-foreground hover:border-accent hover:text-accent'}`
                }>

                {following ? '✓ Following' : '+ Follow'}
              </button>

              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground ml-auto">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <strong className="text-foreground">{recipe.rating.toFixed(1)}</strong>
                  <span>({recipe.reviews.toLocaleString()} reviews)</span>
                </span>
                <span>🍳 {recipe.cooks.toLocaleString()} made this</span>
              </div>
            </div>

            {/* Primary actions row */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/chef-pepe"
                className="btn-primary flex items-center gap-2 text-sm">

                <span>🍳</span> Start Cooking with Chef Pepe
              </Link>
              <button
                onClick={() => setSaved(!saved)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                saved ?
                'bg-primary text-white border-primary' : 'border-border text-foreground hover:border-primary hover:text-primary'}`
                }>

                <svg className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                {saved ? 'Saved' : 'Save Recipe'}
              </button>
            </div>

            {/* Secondary actions */}
            <div className="flex flex-wrap gap-2">
              {[
              { label: 'Add to Meal Plan', icon: '📅', onClick: handleMealPlan },
              { label: 'Create Shopping List', icon: '🛒' },
              { label: 'Print', icon: '🖨️', onClick: handlePrint },
              { label: 'Share', icon: '↗', onClick: handleShare }].
              map((action) =>
              <button
                key={action.label}
                onClick={action.onClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all">

                  <span>{action.icon}</span> {action.label}
                </button>
              )}
              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-border text-muted-foreground hover:border-red-400 hover:text-red-500 transition-all ml-auto">

                ⚑ Report
              </button>
            </div>

            {/* Share toast */}
            {shareToast &&
            <div className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-foreground text-background text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg z-50 animate-fade-in">
                Link copied to clipboard!
              </div>
            }

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
              { label: 'Prep', value: recipe.prep_time },
              { label: 'Cook', value: recipe.cook_time },
              { label: 'Total', value: recipe.total_time },
              { label: 'Servings', value: `${servings}` },
              { label: 'Difficulty', value: recipe.difficulty }].
              map((stat) =>
              <div key={stat.label} className="bg-muted rounded-2xl p-4 text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">{stat.label}</p>
                  <p className="font-extrabold text-foreground text-base">{stat.value}</p>
                </div>
              )}
            </div>

            {/* Steps */}
            <section aria-labelledby="steps-heading">
              <h2 id="steps-heading" className="text-2xl font-extrabold text-foreground mb-6">
                Let&apos;s cook
              </h2>
              <ol className="space-y-6">
                {recipe.steps.map((step) =>
                <li
                  key={step.step}
                  className={`relative pl-14 transition-opacity ${
                  completedSteps.has(step.step) ? 'opacity-50' : ''}`
                  }>

                    <button
                    onClick={() => toggleStep(step.step)}
                    className={`absolute left-0 top-0 w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-sm transition-all ${
                    completedSteps.has(step.step) ?
                    'bg-primary text-white' : 'bg-muted text-foreground hover:bg-primary/20'}`
                    }
                    aria-label={`Mark step ${step.step} as ${completedSteps.has(step.step) ? 'incomplete' : 'complete'}`}>

                      {completedSteps.has(step.step) ? '✓' : step.step}
                    </button>
                    <div className="bg-card border border-border rounded-2xl p-5">
                      <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{step.instruction}</p>
                      {step.tip &&
                    <div className="mt-3 flex items-start gap-2 bg-accent/10 rounded-xl p-3">
                          <span className="text-accent text-sm">💡</span>
                          <p className="text-accent text-xs font-medium">{step.tip}</p>
                        </div>
                    }
                    </div>
                  </li>
                )}
              </ol>
            </section>

            {/* Chef Pepe cooking mode */}
            <section aria-labelledby="chef-pepe-heading" className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <span className="text-4xl shrink-0">🍳</span>
                <div className="flex-1">
                  <h2 id="chef-pepe-heading" className="font-extrabold text-foreground text-lg mb-2">
                    Cook this with Chef Pepe
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    Want hands-free help? Chef Pepe can read each step, set the pace, answer questions, and help with substitutions.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setShowVoiceModal(true)}
                      className="btn-primary text-sm">

                      Start Cooking with Chef Pepe
                    </button>
                    <Link href="/see-it-cook-it" className="btn-secondary text-sm">
                      Try See It. Cook It.
                    </Link>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    🎙️ Voice-guided cooking mode — coming in Phase 4. Text guidance available now via Chef Pepe.
                  </p>
                </div>
              </div>
            </section>

            {/* Notes */}
            <section aria-labelledby="notes-heading" className="bg-muted rounded-2xl p-6">
              <h2 id="notes-heading" className="font-bold text-foreground mb-3 flex items-center gap-2 text-lg">
                <span>📝</span> Tips, swaps, and make-ahead notes
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{recipe.notes}</p>
              {recipe.tips.length > 0 &&
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {recipe.tips.map((tip) => {
                  const [head, ...tail] = tip.split(':');
                  const hasLabel = tail.length > 0;
                  return (
                    <li key={tip} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>
                          {hasLabel ?
                        <>
                              <strong className="text-foreground">{head}:</strong>{tail.join(':')}
                            </> :
                        tip}
                        </span>
                      </li>);

                })}
                </ul>
              }
            </section>

            {/* Nutrition & Safety */}
            <section aria-labelledby="nutrition-heading">
              <h2 id="nutrition-heading" className="text-xl font-extrabold text-foreground mb-4">
                Nutrition &amp; Safety
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                { label: 'Calories', value: `${recipe.calories}`, unit: 'kcal' },
                { label: 'Protein', value: `${recipe.protein}`, unit: 'g' },
                { label: 'Carbs', value: `${recipe.carbs}`, unit: 'g' },
                { label: 'Fat', value: `${recipe.fat}`, unit: 'g' }].
                map((n) =>
                <div key={n.label} className="bg-card border border-border rounded-2xl p-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">{n.label}</p>
                    <p className="font-extrabold text-foreground text-lg">{n.value}<span className="text-xs font-normal text-muted-foreground ml-0.5">{n.unit}</span></p>
                  </div>
                )}
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-sm text-amber-700 dark:text-amber-400">
                <p className="font-semibold mb-1">⚠️ Allergen &amp; Safety Note</p>
                <p>
                  {recipe.allergens.length > 0 ?
                  <>
                      This recipe contains{' '}
                      {recipe.allergens.map((a, i) =>
                    <React.Fragment key={a}>
                          {i > 0 && (i === recipe.allergens.length - 1 ? ' and ' : ', ')}
                          <strong>{a.toLowerCase()}</strong>
                        </React.Fragment>
                    )}
                      .{' '}
                    </> :
                  <>Check every ingredient label against your own allergies before cooking.{' '}</>
                  }
                  Nutritional values are estimates per serving and may vary based on the specific ingredients you use. If you have food allergies, please verify all ingredients before cooking.
                </p>
                <p className="mt-2 text-xs opacity-80">AI-assisted content. Always verify instructions with trusted culinary sources.</p>
              </div>
            </section>

            {/* Community */}
            <section aria-labelledby="community-heading">
              <div className="flex items-center justify-between mb-6">
                <h2 id="community-heading" className="text-2xl font-extrabold text-foreground">
                  Made by the Chew community
                </h2>
                <span className="text-sm text-muted-foreground">{recipe.cooks.toLocaleString()} made this</span>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5 flex flex-wrap items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl shrink-0">
                  👤
                </div>
                <div className="flex-1 min-w-[200px]">
                  <p className="text-sm text-muted-foreground">
                    Did you make this? Share what worked, what you changed, and a photo of your plate.
                  </p>
                </div>
                <Link
                  href="/join"
                  className="btn-primary text-sm shrink-0">

                  Upload Your Version
                </Link>
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <aside className="space-y-6">

            {/* Ingredients */}
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-extrabold text-foreground text-lg">What you&apos;ll need</h2>
                <div className="flex items-center gap-2 bg-muted rounded-full px-3 py-1">
                  <button
                    onClick={() => setServings(Math.max(1, servings - 1))}
                    className="w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-foreground font-bold text-sm hover:bg-primary hover:text-white hover:border-primary transition-colors"
                    aria-label="Decrease servings">

                    −
                  </button>
                  <span className="text-sm font-bold text-foreground w-8 text-center">{servings}</span>
                  <button
                    onClick={() => setServings(servings + 1)}
                    className="w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-foreground font-bold text-sm hover:bg-primary hover:text-white hover:border-primary transition-colors"
                    aria-label="Increase servings">

                    +
                  </button>
                </div>
              </div>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, i) =>
                <li key={`${ing.item}-${i}`} className="flex items-start gap-3 text-sm">
                    <button
                    onClick={() => toggleIngredient(i)}
                    className={`w-4 h-4 rounded border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                    checkedIngredients.has(i) ?
                    'bg-primary border-primary text-white' : 'border-border hover:border-primary'}`
                    }
                    aria-label={`Mark ${ing.item} as ${checkedIngredients.has(i) ? 'unchecked' : 'checked'}`}>

                      {checkedIngredients.has(i) &&
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    }
                    </button>
                    <span className={`text-foreground transition-opacity ${checkedIngredients.has(i) ? 'line-through opacity-50' : ''}`}>
                      {ing.amount &&
                    <strong>{scaleAmount(ing.amount)}{ing.unit ? ` ${ing.unit}` : ''} </strong>
                    }
                      {ing.item}
                    </span>
                  </li>
                )}
              </ul>
              <button className="w-full mt-5 btn-secondary text-sm">
                Create Shopping List
              </button>
              <button className="w-full mt-2 border border-border text-foreground text-sm font-semibold rounded-full py-2 hover:border-primary hover:text-primary transition-all">
                Add to Meal Plan
              </button>
            </div>

            {/* Recipe info */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Difficulty</span>
                <span className="font-semibold text-foreground">{recipe.difficulty}</span>
              </div>
              {recipe.cuisine &&
              <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cuisine</span>
                  <span className="font-semibold text-foreground">{recipe.cuisine}</span>
                </div>
              }
              {recipe.meal_type &&
              <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Meal</span>
                  <span className="font-semibold text-foreground">{recipe.meal_type}</span>
                </div>
              }
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Servings</span>
                <span className="font-semibold text-foreground">{servings}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Calories</span>
                <span className="font-semibold text-foreground">{recipe.calories} kcal</span>
              </div>
            </div>

          </aside>
        </div>

        {/* Related recipes */}
        {related.length > 0 &&
        <section className="mt-16" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-2xl font-extrabold text-foreground mb-6">
              You may also love
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((item) =>
            <Link key={item.slug} href={`/recipes/${item.slug}`} className="card-recipe group block">
                  <div className="relative h-44 overflow-hidden">
                    <img
                  src={item.image}
                  alt={item.image_alt || item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-xs mt-1">
                      {item.creator_name} · {item.total_time}
                    </p>
                  </div>
                </Link>
            )}
            </div>
          </section>
        }
      </div>

      <Footer />

      {/* Mobile sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border px-4 py-3 flex gap-3 lg:hidden">
        <button
          onClick={() => setShowVoiceModal(true)}
          className="flex-1 btn-primary text-sm text-center flex items-center justify-center gap-1.5">

          <span>🍳</span> Start Cooking
        </button>
        <button
          onClick={() => setSaved(!saved)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
          saved ?
          'bg-primary text-white border-primary' : 'border-border text-foreground'}`
          }>

          <svg className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          {saved ? 'Saved' : 'Save'}
        </button>
        <Link
          href="/chef-pepe"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border border-border text-foreground hover:border-primary hover:text-primary transition-all">

          Ask Chef Pepe
        </Link>
      </div>

      {/* Meal Plan toast */}
      {mealPlanToast &&
      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-foreground text-background text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg z-50 whitespace-nowrap">
          📅 Meal planning coming soon — <Link href="/join" className="underline">join early access</Link>
        </div>
      }

      {/* Voice Cooking Mode Modal */}
      {showVoiceModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-background rounded-3xl p-8 max-w-md w-full shadow-2xl">
            {voiceSubmitted ?
          <div className="text-center py-6">
                <div className="text-5xl mb-3">🎙️</div>
                <h3 className="font-extrabold text-foreground text-xl mb-2">You&apos;re on the list!</h3>
                <p className="text-muted-foreground text-sm">We&apos;ll notify you when voice-guided cooking mode launches.</p>
              </div> :

          <>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">🍳</span>
                  <div>
                    <h3 className="font-extrabold text-foreground text-xl">Voice Cooking Mode</h3>
                    <span className="text-xs bg-accent/20 text-accent font-bold px-2 py-0.5 rounded-full">Coming in Phase 4</span>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                  Chef Pepe will read each step aloud, set the pace, answer your questions, and help with substitutions — all hands-free while you cook.
                </p>
                <ul className="space-y-2 mb-6 mt-4">
                  {['Step-by-step voice guidance', 'Hands-free timer control', 'Ask questions mid-cook', 'Substitution help in real time'].map((f) =>
              <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">✓</span>
                      {f}
                    </li>
              )}
                </ul>
                <form onSubmit={handleVoiceSubmit} className="space-y-3">
                  <input
                type="email"
                required
                value={voiceEmail}
                onChange={(e) => setVoiceEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground focus:outline-none focus:border-primary text-sm" />

                  <button type="submit" className="btn-primary w-full justify-center">
                    Notify Me When It Launches
                  </button>
                </form>
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center mb-2">In the meantime, get text guidance from Chef Pepe:</p>
                  <Link
                href="/chef-pepe"
                onClick={() => setShowVoiceModal(false)}
                className="btn-secondary w-full justify-center text-sm block text-center">

                    Chat with Chef Pepe
                  </Link>
                </div>
                <button
              onClick={() => setShowVoiceModal(false)}
              className="w-full mt-2 text-sm text-muted-foreground hover:text-foreground transition-colors">

                  Close
                </button>
              </>
          }
          </div>
        </div>
      }

      {/* Report Modal */}
      {showReportModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-background rounded-3xl p-6 max-w-md w-full shadow-2xl">
            {reportSubmitted ?
          <div className="text-center py-6">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="font-extrabold text-foreground text-lg mb-2">Report submitted</h3>
                <p className="text-muted-foreground text-sm">Thank you. Our team will review this content.</p>
              </div> :

          <>
                <h3 className="font-extrabold text-foreground text-lg mb-1">Report this recipe</h3>
                <p className="text-muted-foreground text-sm mb-5">Help us keep Chew Network safe and accurate.</p>
                <div className="space-y-2 mb-5">
                  {[
              'Unsafe or dangerous instructions',
              'Plagiarism or stolen content',
              'Incorrect allergen information',
              'Inaccurate recipe instructions',
              'Spam or misleading content',
              'Other'].
              map((reason) =>
              <label key={reason} className="flex items-center gap-3 cursor-pointer group">
                      <input
                  type="radio"
                  name="report-reason"
                  value={reason}
                  checked={reportReason === reason}
                  onChange={() => setReportReason(reason)}
                  className="accent-primary" />

                      <span className="text-sm text-foreground group-hover:text-primary transition-colors">{reason}</span>
                    </label>
              )}
                </div>
                <div className="flex gap-3">
                  <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 border border-border text-foreground text-sm font-semibold rounded-full py-2.5 hover:border-primary hover:text-primary transition-all">

                    Cancel
                  </button>
                  <button
                onClick={handleReportSubmit}
                disabled={!reportReason}
                className="flex-1 btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed">

                    Submit Report
                  </button>
                </div>
              </>
          }
          </div>
        </div>
      }
    </main>);

}
