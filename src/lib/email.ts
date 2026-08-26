/**
 * Supabase Auth stores addresses lowercased, so an investor row that kept the
 * capitalisation an admin happened to type would no longer match the login it
 * belongs to. `investors.email` is also a case-sensitive UNIQUE column, which
 * on its own would let "Alex@x.com" and "alex@x.com" both insert as separate
 * investors for one person. Normalising on the way in keeps the two in step.
 *
 * Lives on its own so both browser and server code can use it without pulling
 * in a Supabase client.
 */
export const normalizeEmail = (email: string | undefined | null): string =>
  (email || '').trim().toLowerCase();
