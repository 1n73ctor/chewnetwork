import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Cookie-free Supabase client for public, unauthenticated reads (recipes, etc).
 *
 * The `server.ts` client reads cookies, which opts every route that touches it
 * into dynamic rendering. Public content has no per-user state, so it uses this
 * client instead and stays statically renderable at build time.
 */

export const isSupabaseConfigured = (): boolean =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    // supabase-js would otherwise throw a bare "supabaseUrl is required", which
    // says nothing about which variable is missing or where to set it.
    throw new Error(
      'Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and ' +
        'NEXT_PUBLIC_SUPABASE_ANON_KEY. Locally these live in .env; on a host ' +
        '(Netlify, Vercel) they must be set in the site\'s environment variables, ' +
        'because .env is not committed.'
    );
  }
  return createSupabaseClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

let warned = false;

/**
 * Same client, but null instead of a throw when the environment is missing.
 *
 * Build-time data collection uses this so a misconfigured deploy degrades to a
 * site without database content rather than failing the whole build — the
 * warning below is what tells you which it was.
 */
export function tryCreatePublicClient() {
  if (!isSupabaseConfigured()) {
    if (!warned) {
      warned = true;
      console.warn(
        '[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are ' +
          'not set — database-backed content will be empty. Set them in your ' +
          'host\'s environment variables.'
      );
    }
    return null;
  }
  return createPublicClient();
}
