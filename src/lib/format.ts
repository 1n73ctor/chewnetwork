/** Display formatting for investor figures, shared across the portal. */

import { OWNERSHIP_DECIMALS } from '@/lib/stakes';

/**
 * Ownership runs to very small fractions of a percent, so a fixed 2dp would
 * render most holdings as "0.00%". The precision comes from the size of the
 * stake pool, with trailing zeroes trimmed so round numbers stay readable.
 */
export const formatOwnership = (pct: number | null | undefined): string => {
  if (!pct) return '0%';
  return pct.toFixed(OWNERSHIP_DECIMALS).replace(/\.?0+$/, '') + '%';
};

export const formatCurrency = (value: number | null | undefined): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);

export const formatStakes = (value: number | null | undefined): string =>
  new Intl.NumberFormat('en-US').format(value || 0);

/**
 * Dates arrive as plain YYYY-MM-DD, which `new Date()` reads as UTC midnight —
 * formatting that in a negative-offset timezone would show the previous day.
 * Forcing the UTC timezone keeps the date as stored.
 */
export const formatDate = (value: string | null | undefined): string => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
};
