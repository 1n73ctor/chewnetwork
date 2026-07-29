-- ChewNetwork Auth Schema Migration
-- Tables: user_profiles, saved_recipes, collections, collection_recipes, activity_feed

-- 1. ENUM Types
DROP TYPE IF EXISTS public.account_type CASCADE;
CREATE TYPE public.account_type AS ENUM ('food-lover', 'creator', 'restaurant', 'teacher', 'partner');

DROP TYPE IF EXISTS public.activity_type CASCADE;
CREATE TYPE public.activity_type AS ENUM ('saved_recipe', 'created_collection', 'joined_challenge', 'followed_creator', 'commented');

-- 2. Core Tables

-- user_profiles: one row per auth user
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL DEFAULT '',
    full_name TEXT NOT NULL DEFAULT '',
    avatar_url TEXT DEFAULT '',
    account_type public.account_type DEFAULT 'food-lover'::public.account_type,
    country TEXT DEFAULT '',
    skill_level TEXT DEFAULT '',
    chef_pepe_mode TEXT DEFAULT 'beginner',
    dietary_preferences TEXT DEFAULT '',
    goals TEXT[] DEFAULT ARRAY[]::TEXT[],
    favourite_cuisines TEXT[] DEFAULT ARRAY[]::TEXT[],
    marketing_consent BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- saved_recipes: recipes saved by users
CREATE TABLE IF NOT EXISTS public.saved_recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    recipe_slug TEXT NOT NULL,
    recipe_title TEXT NOT NULL DEFAULT '',
    recipe_image TEXT DEFAULT '',
    recipe_creator TEXT DEFAULT '',
    recipe_time TEXT DEFAULT '',
    saved_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- collections: named recipe collections per user
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    cover_image TEXT DEFAULT '',
    recipe_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- collection_recipes: junction table linking collections to recipes
CREATE TABLE IF NOT EXISTS public.collection_recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
    recipe_slug TEXT NOT NULL,
    recipe_title TEXT NOT NULL DEFAULT '',
    recipe_image TEXT DEFAULT '',
    added_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- activity_feed: user activity log
CREATE TABLE IF NOT EXISTS public.activity_feed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    activity_type public.activity_type NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    description TEXT DEFAULT '',
    reference_id TEXT DEFAULT '',
    reference_type TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_saved_recipes_user_id ON public.saved_recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_recipes_slug ON public.saved_recipes(recipe_slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_saved_recipes_user_slug ON public.saved_recipes(user_id, recipe_slug);
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON public.collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_recipes_collection_id ON public.collection_recipes(collection_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_user_id ON public.activity_feed(user_id);

-- 4. Functions

-- Auto-create user_profiles on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.user_profiles (
        id,
        email,
        first_name,
        full_name,
        avatar_url,
        account_type,
        country,
        skill_level,
        chef_pepe_mode,
        dietary_preferences,
        goals,
        favourite_cuisines,
        marketing_consent
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
        COALESCE(NEW.raw_user_meta_data->>'account_type', 'food-lover')::public.account_type,
        COALESCE(NEW.raw_user_meta_data->>'country', ''),
        COALESCE(NEW.raw_user_meta_data->>'skill_level', ''),
        COALESCE(NEW.raw_user_meta_data->>'chef_pepe_mode', 'beginner'),
        COALESCE(NEW.raw_user_meta_data->>'dietary_preferences', ''),
        COALESCE(
            ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'goals')),
            ARRAY[]::TEXT[]
        ),
        COALESCE(
            ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'favourite_cuisines')),
            ARRAY[]::TEXT[]
        ),
        COALESCE((NEW.raw_user_meta_data->>'marketing_consent')::BOOLEAN, false)
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

-- Auto-update updated_at on user_profiles
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 5. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies

-- user_profiles: users manage their own profile
DROP POLICY IF EXISTS "users_manage_own_user_profiles" ON public.user_profiles;
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- saved_recipes: users manage their own saved recipes
DROP POLICY IF EXISTS "users_manage_own_saved_recipes" ON public.saved_recipes;
CREATE POLICY "users_manage_own_saved_recipes"
ON public.saved_recipes
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- collections: users manage their own collections
DROP POLICY IF EXISTS "users_manage_own_collections" ON public.collections;
CREATE POLICY "users_manage_own_collections"
ON public.collections
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- collection_recipes: users manage recipes in their own collections
DROP POLICY IF EXISTS "users_manage_own_collection_recipes" ON public.collection_recipes;
CREATE POLICY "users_manage_own_collection_recipes"
ON public.collection_recipes
FOR ALL
TO authenticated
USING (
    collection_id IN (
        SELECT id FROM public.collections WHERE user_id = auth.uid()
    )
)
WITH CHECK (
    collection_id IN (
        SELECT id FROM public.collections WHERE user_id = auth.uid()
    )
);

-- activity_feed: users view their own activity
DROP POLICY IF EXISTS "users_manage_own_activity_feed" ON public.activity_feed;
CREATE POLICY "users_manage_own_activity_feed"
ON public.activity_feed
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 7. Triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_collections_updated_at ON public.collections;
CREATE TRIGGER update_collections_updated_at
    BEFORE UPDATE ON public.collections
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
