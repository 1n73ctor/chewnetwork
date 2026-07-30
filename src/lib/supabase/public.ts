import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Cookie-free Supabase client for public, unauthenticated reads (recipes, etc).
 *
 * The `server.ts` client reads cookies, which opts every route that touches it
 * into dynamic rendering. Public content has no per-user state, so it uses this
 * client instead and stays statically renderable at build time.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
