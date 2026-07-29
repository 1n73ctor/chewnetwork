-- ─── Performance indexes for saved_recipes, collections, collection_recipes, activity_feed ───

-- saved_recipes: composite index for paginated queries ordered by saved_at
CREATE INDEX IF NOT EXISTS idx_saved_recipes_user_saved_at
  ON public.saved_recipes (user_id, saved_at DESC);

-- collections: composite index for paginated queries ordered by created_at
CREATE INDEX IF NOT EXISTS idx_collections_user_created_at
  ON public.collections (user_id, created_at DESC);

-- collection_recipes: fast lookup by recipe_slug (no recipe_id column exists)
CREATE INDEX IF NOT EXISTS idx_collection_recipes_recipe_slug
  ON public.collection_recipes (recipe_slug);

-- activity_feed: composite index for paginated queries ordered by created_at
CREATE INDEX IF NOT EXISTS idx_activity_feed_user_created_at
  ON public.activity_feed (user_id, created_at DESC);
