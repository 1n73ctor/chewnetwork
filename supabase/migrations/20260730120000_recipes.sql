-- Recipes catalogue
-- Full recipe detail (ingredients, steps, nutrition) served to /recipes/[slug].
-- Publicly readable: recipe pages render for signed-out visitors and are statically generated.

CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',

    -- Card image is reused as the detail hero so list and detail always match
    image TEXT NOT NULL DEFAULT '',
    image_alt TEXT NOT NULL DEFAULT '',

    creator_name TEXT NOT NULL DEFAULT '',
    creator_handle TEXT NOT NULL DEFAULT '',
    creator_image TEXT NOT NULL DEFAULT '',
    creator_alt TEXT NOT NULL DEFAULT '',

    prep_time TEXT NOT NULL DEFAULT '',
    cook_time TEXT NOT NULL DEFAULT '',
    total_time TEXT NOT NULL DEFAULT '',
    prep_minutes INTEGER NOT NULL DEFAULT 0,
    cook_minutes INTEGER NOT NULL DEFAULT 0,
    total_minutes INTEGER NOT NULL DEFAULT 0,

    servings INTEGER NOT NULL DEFAULT 2,
    difficulty TEXT NOT NULL DEFAULT 'Easy',
    cuisine TEXT NOT NULL DEFAULT '',
    meal_type TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'Main Course',
    tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],

    rating NUMERIC(2,1) NOT NULL DEFAULT 4.5,
    reviews INTEGER NOT NULL DEFAULT 0,
    cooks INTEGER NOT NULL DEFAULT 0,

    calories INTEGER NOT NULL DEFAULT 0,
    protein INTEGER NOT NULL DEFAULT 0,
    carbs INTEGER NOT NULL DEFAULT 0,
    fat INTEGER NOT NULL DEFAULT 0,
    fiber INTEGER NOT NULL DEFAULT 0,

    -- [{ "amount": "2", "unit": "tbsp", "item": "honey" }]
    ingredients JSONB NOT NULL DEFAULT '[]'::JSONB,
    -- [{ "step": 1, "title": "...", "instruction": "...", "tip": "..." }]
    steps JSONB NOT NULL DEFAULT '[]'::JSONB,

    notes TEXT NOT NULL DEFAULT '',
    tips TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    allergens TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],

    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_recipes_slug ON public.recipes(slug);
CREATE INDEX IF NOT EXISTS idx_recipes_cuisine ON public.recipes(cuisine);
CREATE INDEX IF NOT EXISTS idx_recipes_meal_type ON public.recipes(meal_type);
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON public.recipes(difficulty);
CREATE INDEX IF NOT EXISTS idx_recipes_creator_name ON public.recipes(creator_name);
CREATE INDEX IF NOT EXISTS idx_recipes_published_cooks ON public.recipes(is_published, cooks DESC);
CREATE INDEX IF NOT EXISTS idx_recipes_tags ON public.recipes USING GIN(tags);

-- Enable RLS
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Published recipes are readable by everyone, including anonymous visitors
DROP POLICY IF EXISTS "public_can_read_published_recipes" ON public.recipes;
CREATE POLICY "public_can_read_published_recipes"
ON public.recipes
FOR SELECT
TO anon, authenticated
USING (is_published = true);

-- Keep updated_at fresh (function defined in the auth schema migration)
DROP TRIGGER IF EXISTS update_recipes_updated_at ON public.recipes;
CREATE TRIGGER update_recipes_updated_at
    BEFORE UPDATE ON public.recipes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
