'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Ingredient {
  amount: string;
  unit: string;
  item: string;
}

interface Step {
  step: number;
  title: string;
  instruction: string;
  tip?: string;
}

interface RecipeData {
  title: string;
  creator: string;
  creatorHandle: string;
  creatorImage: string;
  creatorAlt: string;
  description: string;
  image: string;
  alt: string;
  time: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: string;
  rating: number;
  reviews: number;
  cooks: number;
  tags: string[];
  cuisine: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  ingredients: Ingredient[];
  steps: Step[];
  notes: string;
}

const recipeData: RecipeData = {
  title: 'Crispy Honey Garlic Salmon',
  creator: 'Maria Chen',
  creatorHandle: '@mariachencooks',
  creatorImage: "https://img.rocket.new/generatedImages/rocket_gen_img_195dd0c3b-1772143132505.png",
  creatorAlt: 'Portrait of food creator Maria Chen smiling in her kitchen',
  description: 'A weeknight hero — flaky salmon glazed with sticky honey garlic sauce, ready in under 30 minutes and guaranteed to impress.',
  image: 'https://img.rocket.new/generatedImages/rocket_gen_img_13581a46c-1772646980537.png',
  alt: 'Golden crispy salmon fillet glazed with honey garlic sauce on a white plate with herbs',
  time: '25 min',
  prepTime: '10 min',
  cookTime: '15 min',
  servings: 2,
  difficulty: 'Easy',
  rating: 4.9,
  reviews: 847,
  cooks: 3241,
  tags: ['Seafood', 'Quick', 'Healthy', 'Gluten-Free'],
  cuisine: 'Asian Fusion',
  calories: 420,
  protein: 38,
  carbs: 18,
  fat: 22,
  fiber: 1,
  ingredients: [
  { amount: '2', unit: 'fillets', item: 'salmon (6 oz each, skin-on)' },
  { amount: '3', unit: 'tbsp', item: 'honey' },
  { amount: '4', unit: 'cloves', item: 'garlic, minced' },
  { amount: '2', unit: 'tbsp', item: 'soy sauce (low sodium)' },
  { amount: '1', unit: 'tbsp', item: 'rice vinegar' },
  { amount: '1', unit: 'tsp', item: 'sesame oil' },
  { amount: '2', unit: 'tbsp', item: 'olive oil' },
  { amount: '1', unit: 'tsp', item: 'cornstarch' },
  { amount: '2', unit: 'tbsp', item: 'water' },
  { amount: '', unit: '', item: 'Salt and black pepper to taste' },
  { amount: '', unit: '', item: 'Sesame seeds and sliced scallions to garnish' }],

  steps: [
  {
    step: 1,
    title: 'Prep the salmon',
    instruction: 'Pat salmon fillets completely dry with paper towels — this is the key to crispy skin. Season both sides generously with salt and black pepper.',
    tip: 'Dry fish = crispy skin. Never skip this step.'
  },
  {
    step: 2,
    title: 'Make the glaze',
    instruction: 'Whisk together honey, minced garlic, soy sauce, rice vinegar, and sesame oil in a small bowl. In a separate tiny bowl, mix cornstarch with water to make a slurry.'
  },
  {
    step: 3,
    title: 'Sear the salmon',
    instruction: 'Heat olive oil in a non-stick or cast iron skillet over medium-high heat until shimmering. Place salmon skin-side down. Press gently with a spatula for the first 30 seconds to prevent curling. Cook 4–5 minutes until skin is deeply golden and crispy.',
    tip: "Don't move the fish once it's down — let it release naturally."
  },
  {
    step: 4,
    title: 'Flip and glaze',
    instruction: 'Flip salmon and cook flesh-side down for 2 minutes. Pour the honey garlic sauce into the pan around the fish. Add the cornstarch slurry and stir into the sauce. Let it bubble and thicken for 1–2 minutes, spooning sauce over the salmon.'
  },
  {
    step: 5,
    title: 'Rest and serve',
    instruction: 'Remove from heat. Let rest 2 minutes. Plate skin-side up to keep it crispy. Spoon remaining glaze over the top. Garnish with sesame seeds and sliced scallions. Serve immediately over steamed rice or roasted vegetables.'
  }],

  notes: 'Salmon is done when it flakes easily with a fork and the internal temperature reaches 125°F (52°C) for medium or 145°F (63°C) for well done. Leftovers keep in the fridge for up to 2 days — reheat gently in a pan, not the microwave.'
};

const communityPhotos = [
{
  user: 'Jamie T.',
  userImage: "https://img.rocket.new/generatedImages/rocket_gen_img_16fb8608b-1772873804348.png",
  userAlt: 'Community member Jamie T.',
  photo: 'https://img.rocket.new/generatedImages/rocket_gen_img_13581a46c-1772646980537.png',
  photoAlt: 'Jamie\'s version of crispy honey garlic salmon served over jasmine rice',
  comment: 'Made this for date night — absolute perfection. Added a pinch of chili flakes to the glaze for heat. 10/10!',
  rating: 5,
  date: '2 days ago'
},
{
  user: 'Priya N.',
  userImage: "https://img.rocket.new/generatedImages/rocket_gen_img_194c7ec88-1763299919087.png",
  userAlt: 'Community member Priya N.',
  photo: "https://images.unsplash.com/photo-1702866788652-46c9a3cc911e",
  photoAlt: 'Priya\'s honey garlic salmon with roasted vegetables on a dark plate',
  comment: 'Swapped soy sauce for coconut aminos to make it fully paleo. Worked beautifully. The skin was SO crispy.',
  rating: 5,
  date: '5 days ago'
},
{
  user: 'Carlos M.',
  userImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1381bcb08-1763296653927.png",
  userAlt: 'Community member Carlos M.',
  photo: "https://images.unsplash.com/photo-1570894322280-63ee9081cc10",
  photoAlt: 'Carlos\'s plated salmon with sesame seeds and fresh scallions',
  comment: 'First time cooking salmon and it came out restaurant quality. Chef Pepe helped me nail the timing.',
  rating: 5,
  date: '1 week ago'
}];


const relatedRecipes = [
{
  title: 'Garlic Butter Shrimp Pasta',
  creator: 'Marco Rossi',
  time: '20 min',
  image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1f19f6fbe-1775504653966.png',
  alt: 'Garlic butter shrimp tossed with linguine pasta and fresh parsley',
  slug: 'garlic-butter-shrimp-pasta'
},
{
  title: 'Mango Coconut Chia Pudding',
  creator: 'Priya Nair',
  time: '10 min',
  image: 'https://images.unsplash.com/photo-1629180050285-7c56c6671f19',
  alt: 'Layered mango coconut chia pudding in a glass jar topped with fresh mango slices',
  slug: 'mango-coconut-chia-pudding'
},
{
  title: 'One-Pan Lemon Orzo',
  creator: 'Sofia Patel',
  time: '30 min',
  image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927',
  alt: 'Creamy lemon orzo pasta with spinach and parmesan in a cast iron pan',
  slug: 'one-pan-lemon-orzo'
}];


export default function RecipeDetailPage() {
  const [servings, setServings] = useState(recipeData.servings);
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
    const scaled = num * servings / recipeData.servings;
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

  // Schema.org Recipe JSON-LD
  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipeData.title,
    description: recipeData.description,
    image: recipeData.image,
    author: { '@type': 'Person', name: recipeData.creator },
    prepTime: 'PT10M',
    cookTime: 'PT15M',
    totalTime: 'PT25M',
    recipeYield: `${recipeData.servings} servings`,
    recipeCuisine: recipeData.cuisine,
    recipeCategory: 'Main Course',
    keywords: recipeData.tags.join(', '),
    nutrition: {
      '@type': 'NutritionInformation',
      calories: `${recipeData.calories} calories`,
      proteinContent: `${recipeData.protein}g`,
      carbohydrateContent: `${recipeData.carbs}g`,
      fatContent: `${recipeData.fat}g`,
      fiberContent: `${recipeData.fiber}g`
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: recipeData.rating,
      reviewCount: recipeData.reviews
    },
    recipeIngredient: recipeData.ingredients.map((ing) =>
    `${ing.amount} ${ing.unit} ${ing.item}`.trim()
    ),
    recipeInstructions: recipeData.steps.map((step) => ({
      '@type': 'HowToStep',
      name: step.title,
      text: step.instruction
    }))
  };

  return (
    <>
      {/* Schema.org Recipe markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />
      

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
              <li aria-hidden="true" className="text-border">›</li>
              <li>
                <Link href="/recipes?cuisine=asian-fusion" className="hover:text-primary transition-colors">{recipeData.cuisine}</Link>
              </li>
              <li aria-hidden="true" className="text-border">›</li>
              <li className="text-foreground font-medium truncate max-w-[200px]" aria-current="page">
                {recipeData.title}
              </li>
            </ol>
          </div>
        </nav>

        {/* Hero */}
        <section aria-label="Recipe hero">
          <div className="relative h-72 sm:h-96 lg:h-[520px] overflow-hidden">
            <img
              src={recipeData.image}
              alt={recipeData.alt}
              className="w-full h-full object-cover" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-5xl mx-auto">
              <div className="flex flex-wrap gap-2 mb-3">
                {recipeData.tags.map((tag) =>
                <span key={tag} className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold">
                    {tag}
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3 leading-tight">
                {recipeData.title}
              </h1>
              <p className="text-white/80 text-base max-w-2xl hidden sm:block">{recipeData.description}</p>
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">

              {/* Creator attribution + primary actions */}
              <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-border">
                <Link href="/creators" className="flex items-center gap-3 group">
                  <img
                    src={recipeData.creatorImage}
                    alt={recipeData.creatorAlt}
                    className="w-10 h-10 rounded-full object-cover" />
                  
                  <div>
                    <p className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                      {recipeData.creator}
                    </p>
                    <p className="text-muted-foreground text-xs">{recipeData.creatorHandle}</p>
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
                    <strong className="text-foreground">{recipeData.rating}</strong>
                    <span>({recipeData.reviews} reviews)</span>
                  </span>
                  <span>🍳 {recipeData.cooks.toLocaleString()} made this</span>
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
                { label: 'Prep', value: recipeData.prepTime },
                { label: 'Cook', value: recipeData.cookTime },
                { label: 'Total', value: recipeData.time },
                { label: 'Servings', value: `${servings}` },
                { label: 'Difficulty', value: recipeData.difficulty }].
                map((stat) =>
                <div key={stat.label} className="bg-muted rounded-2xl p-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">{stat.label}</p>
                    <p className="font-extrabold text-foreground text-base">{stat.value}</p>
                  </div>
                )}
              </div>

              {/* Steps — "Let's cook" */}
              <section aria-labelledby="steps-heading">
                <h2 id="steps-heading" className="text-2xl font-extrabold text-foreground mb-6">
                  Let's cook
                </h2>
                <ol className="space-y-6">
                  {recipeData.steps.map((step) =>
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

              {/* Chef Pepe cooking mode section */}
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

              {/* Notes — "Tips, swaps, and make-ahead notes" */}
              <section aria-labelledby="notes-heading" className="bg-muted rounded-2xl p-6">
                <h2 id="notes-heading" className="font-bold text-foreground mb-3 flex items-center gap-2 text-lg">
                  <span>📝</span> Tips, swaps, and make-ahead notes
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{recipeData.notes}</p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span><strong className="text-foreground">Swap:</strong> No soy sauce? Use coconut aminos for a gluten-free, slightly sweeter version.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span><strong className="text-foreground">Make-ahead:</strong> Mix the glaze up to 3 days in advance and store in the fridge.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span><strong className="text-foreground">Swap:</strong> Works equally well with trout, arctic char, or thick cod fillets.</span>
                  </li>
                </ul>
              </section>

              {/* Nutrition & Safety Notes */}
              <section aria-labelledby="nutrition-heading">
                <h2 id="nutrition-heading" className="text-xl font-extrabold text-foreground mb-4">
                  Nutrition &amp; Safety
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  {[
                  { label: 'Calories', value: `${recipeData.calories}`, unit: 'kcal' },
                  { label: 'Protein', value: `${recipeData.protein}`, unit: 'g' },
                  { label: 'Carbs', value: `${recipeData.carbs}`, unit: 'g' },
                  { label: 'Fat', value: `${recipeData.fat}`, unit: 'g' }].
                  map((n) =>
                  <div key={n.label} className="bg-card border border-border rounded-2xl p-4 text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">{n.label}</p>
                      <p className="font-extrabold text-foreground text-lg">{n.value}<span className="text-xs font-normal text-muted-foreground ml-0.5">{n.unit}</span></p>
                    </div>
                  )}
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-800">
                  <p className="font-semibold mb-1">⚠️ Allergen & Safety Note</p>
                  <p>This recipe contains <strong>fish (salmon)</strong> and <strong>soy</strong>. Nutritional values are estimates per serving and may vary based on specific ingredients used. Always cook fish to a safe internal temperature. If you have food allergies, please verify all ingredients before cooking.</p>
                  <p className="mt-2 text-xs text-yellow-700">AI-assisted content. Always verify instructions with trusted culinary sources.</p>
                </div>
              </section>

              {/* Community photos/reviews — "Made by the Chew community" */}
              <section aria-labelledby="community-heading">
                <div className="flex items-center justify-between mb-6">
                  <h2 id="community-heading" className="text-2xl font-extrabold text-foreground">
                    Made by the Chew community
                  </h2>
                  <span className="text-sm text-muted-foreground">{recipeData.reviews} reviews</span>
                </div>

                {/* Review prompt */}
                <div className="bg-card border border-border rounded-2xl p-5 mb-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl shrink-0">
                    👤
                  </div>
                  <div className="flex-1">
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

                {/* Community photos grid */}
                <div className="space-y-5">
                  {communityPhotos.map((photo, i) =>
                  <div key={i} className="bg-card border border-border rounded-2xl p-5">
                      <div className="flex items-start gap-3 mb-4">
                        <img
                        src={photo.userImage}
                        alt={photo.userAlt}
                        className="w-9 h-9 rounded-full object-cover shrink-0" />
                      
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-foreground text-sm">{photo.user}</span>
                            <div className="flex gap-0.5">
                              {Array.from({ length: photo.rating }).map((_, j) =>
                            <svg key={j} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            )}
                            </div>
                            <span className="text-xs text-muted-foreground">{photo.date}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{photo.comment}</p>
                        </div>
                      </div>
                      <img
                      src={photo.photo}
                      alt={photo.photoAlt}
                      className="w-full h-48 object-cover rounded-xl" />
                    
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        Community version — original recipe by {recipeData.creator} ({recipeData.creatorHandle})
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 text-center">
                  <button className="btn-secondary text-sm">
                    View all {recipeData.reviews} reviews
                  </button>
                </div>
              </section>

            </div>

            {/* Sidebar */}
            <aside className="space-y-6">

              {/* Ingredients — "What you'll need" */}
              <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-extrabold text-foreground text-lg">What you'll need</h2>
                  <div className="flex items-center gap-2 bg-muted rounded-full px-3 py-1">
                    <button
                      onClick={() => setServings(Math.max(1, servings - 1))}
                      className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-foreground font-bold text-sm hover:bg-primary hover:text-white transition-colors"
                      aria-label="Decrease servings">
                      
                      −
                    </button>
                    <span className="text-sm font-bold text-foreground w-8 text-center">{servings}</span>
                    <button
                      onClick={() => setServings(servings + 1)}
                      className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-foreground font-bold text-sm hover:bg-primary hover:text-white transition-colors"
                      aria-label="Increase servings">
                      
                      +
                    </button>
                  </div>
                </div>
                <ul className="space-y-3">
                  {recipeData.ingredients.map((ing, i) =>
                  <li key={i} className="flex items-start gap-3 text-sm">
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
                      <strong>{scaleAmount(ing.amount)} {ing.unit} </strong>
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
                  <span className="font-semibold text-foreground">{recipeData.difficulty}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cuisine</span>
                  <span className="font-semibold text-foreground">{recipeData.cuisine}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Servings</span>
                  <span className="font-semibold text-foreground">{servings}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Calories</span>
                  <span className="font-semibold text-foreground">{recipeData.calories} kcal</span>
                </div>
              </div>

            </aside>
          </div>

          {/* Related recipes — "You may also love" */}
          <section className="mt-16" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-2xl font-extrabold text-foreground mb-6">
              You may also love
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedRecipes.map((recipe) =>
              <Link key={recipe.slug} href={`/recipes/${recipe.slug}`} className="card-recipe group block">
                  <div className="relative h-44 overflow-hidden">
                    <img
                    src={recipe.image}
                    alt={recipe.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                      {recipe.title}
                    </h3>
                    <p className="text-muted-foreground text-xs mt-1">
                      {recipe.creator} · {recipe.time}
                    </p>
                  </div>
                </Link>
              )}
            </div>
          </section>
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

        {/* Meal Plan Coming Soon Toast */}
        {mealPlanToast &&
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-foreground text-background text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg z-50 whitespace-nowrap">
            📅 Meal planning coming soon — <Link href="/join" className="underline">join early access</Link>
          </div>
        }

        {/* Voice Cooking Mode Modal — Phase 4 Coming Soon */}
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
      </main>
    </>);

}