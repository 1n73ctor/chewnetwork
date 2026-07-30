import type { Metadata } from 'next';
import React from 'react';
import { notFound } from 'next/navigation';
import { getAllRecipeSlugs, getRecipeBySlug, getRelatedRecipes } from '@/lib/recipes';
import RecipeDetailClient from './RecipeDetailClient';

// Recipes change rarely; re-check hourly so edits in Supabase roll out without a deploy.
export const revalidate = 3600;
export const dynamicParams = true;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chewnetwor2552.builtwithrocket.new';

export async function generateStaticParams() {
  const slugs = await getAllRecipeSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params


}: {params: Promise<{slug: string;}>;}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    return { title: 'Recipe Not Found | ChewNetwork' };
  }

  const title = `${recipe.title} — ${recipe.total_time} | ChewNetwork`;
  const url = `${SITE_URL}/recipes/${recipe.slug}`;

  return {
    title,
    description: recipe.description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: recipe.description,
      url,
      siteName: 'ChewNetwork',
      images: [{ url: recipe.image, width: 1200, height: 630, alt: recipe.image_alt || recipe.title }],
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${recipe.title} | ChewNetwork`,
      description: recipe.description,
      images: [recipe.image]
    }
  };
}

/** Minutes → ISO 8601 duration, e.g. 90 → "PT1H30M". */
function isoDuration(minutes: number): string | undefined {
  if (!minutes || minutes <= 0) return undefined;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}`;
}

export default async function RecipeDetailPage({
  params


}: {params: Promise<{slug: string;}>;}) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) notFound();

  const related = await getRelatedRecipes(recipe);

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.description,
    image: recipe.image,
    author: { '@type': 'Person', name: recipe.creator_name },
    prepTime: isoDuration(recipe.prep_minutes),
    cookTime: isoDuration(recipe.cook_minutes),
    totalTime: isoDuration(recipe.total_minutes),
    recipeYield: `${recipe.servings} servings`,
    recipeCuisine: recipe.cuisine || undefined,
    recipeCategory: recipe.category,
    keywords: recipe.tags.join(', '),
    nutrition: {
      '@type': 'NutritionInformation',
      servingSize: '1 serving',
      calories: `${recipe.calories} calories`,
      proteinContent: `${recipe.protein}g`,
      carbohydrateContent: `${recipe.carbs}g`,
      fatContent: `${recipe.fat}g`,
      fiberContent: `${recipe.fiber}g`
    },
    aggregateRating: recipe.reviews > 0 ?
    {
      '@type': 'AggregateRating',
      ratingValue: recipe.rating,
      reviewCount: recipe.reviews
    } :
    undefined,
    recipeIngredient: recipe.ingredients.map((ing) =>
    `${ing.amount} ${ing.unit} ${ing.item}`.replace(/\s+/g, ' ').trim()
    ),
    recipeInstructions: recipe.steps.map((step) => ({
      '@type': 'HowToStep',
      name: step.title,
      text: step.instruction
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />

      <RecipeDetailClient recipe={recipe} related={related} />
    </>);

}
