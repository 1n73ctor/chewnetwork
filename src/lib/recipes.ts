import { createPublicClient } from '@/lib/supabase/public';

export interface Ingredient {
  amount: string;
  unit: string;
  item: string;
}

export interface Step {
  step: number;
  title: string;
  instruction: string;
  tip?: string;
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  image_alt: string;
  creator_name: string;
  creator_handle: string;
  creator_image: string;
  creator_alt: string;
  prep_time: string;
  cook_time: string;
  total_time: string;
  prep_minutes: number;
  cook_minutes: number;
  total_minutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  meal_type: string;
  category: string;
  tags: string[];
  rating: number;
  reviews: number;
  cooks: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  ingredients: Ingredient[];
  steps: Step[];
  notes: string;
  tips: string[];
  allergens: string[];
}

/** Trimmed shape used by "you may also love" cards. */
export interface RecipeCardData {
  slug: string;
  title: string;
  image: string;
  image_alt: string;
  creator_name: string;
  total_time: string;
}

const CARD_COLUMNS = 'slug, title, image, image_alt, creator_name, total_time';

/** `rating` comes back from postgres NUMERIC as a string. */
function normalize(row: Record<string, unknown>): Recipe {
  return {
    ...(row as unknown as Recipe),
    rating: Number(row.rating ?? 0),
    tags: (row.tags as string[]) ?? [],
    tips: (row.tips as string[]) ?? [],
    allergens: (row.allergens as string[]) ?? [],
    ingredients: (row.ingredients as Ingredient[]) ?? [],
    steps: (row.steps as Step[]) ?? [],
  };
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error || !data) return null;
  return normalize(data);
}

/**
 * Recipes to suggest alongside `recipe` — same cuisine first, then anything
 * sharing a tag, topped up with popular recipes so the row is never short.
 */
export async function getRelatedRecipes(recipe: Recipe, limit = 3): Promise<RecipeCardData[]> {
  const supabase = createPublicClient();
  const found = new Map<string, RecipeCardData>();

  const collect = (rows: RecipeCardData[] | null) => {
    for (const row of rows ?? []) {
      if (row.slug !== recipe.slug && found.size < limit) found.set(row.slug, row);
    }
  };

  const { data: sameCuisine } = await supabase
    .from('recipes')
    .select(CARD_COLUMNS)
    .eq('is_published', true)
    .eq('cuisine', recipe.cuisine)
    .neq('slug', recipe.slug)
    .order('cooks', { ascending: false })
    .limit(limit + 1);
  collect(sameCuisine as RecipeCardData[] | null);

  if (found.size < limit && recipe.tags.length) {
    const { data: sharedTags } = await supabase
      .from('recipes')
      .select(CARD_COLUMNS)
      .eq('is_published', true)
      .overlaps('tags', recipe.tags)
      .neq('slug', recipe.slug)
      .order('cooks', { ascending: false })
      .limit(limit + 1);
    collect(sharedTags as RecipeCardData[] | null);
  }

  if (found.size < limit) {
    const { data: popular } = await supabase
      .from('recipes')
      .select(CARD_COLUMNS)
      .eq('is_published', true)
      .neq('slug', recipe.slug)
      .order('cooks', { ascending: false })
      .limit(limit + 1);
    collect(popular as RecipeCardData[] | null);
  }

  return Array.from(found.values());
}

export async function getAllRecipeSlugs(): Promise<string[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('recipes')
    .select('slug')
    .eq('is_published', true);

  if (error || !data) return [];
  return data.map((r) => r.slug as string);
}
