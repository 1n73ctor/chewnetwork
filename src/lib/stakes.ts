/**
 * The size of the Ecosystem Stake pool, in one place.
 *
 * This number was written out by hand in five different files and again inside
 * the database's recalculate_ownership function, so changing it meant finding
 * every copy — and the portal quoting a figure the maths no longer used if one
 * was missed. The SQL side still holds its own copy of necessity; it is changed
 * in the same migration and asserted against these values.
 *
 * The pool represents a 5% share of Chew Network, so the figure implied by a
 * full 100% is twenty times larger. Ownership is therefore:
 *
 *   (stakes / TOTAL_ECOSYSTEM_STAKES) * ECOSYSTEM_SHARE_PERCENT
 */

export const TOTAL_ECOSYSTEM_STAKES = 80_000_000_000;

/** The share of Chew Network the whole pool represents. */
export const ECOSYSTEM_SHARE_PERCENT = 5;

/** The notional pool at 100%, used by the ownership donut. */
export const FULL_ECOSYSTEM_POOL =
  TOTAL_ECOSYSTEM_STAKES * (100 / ECOSYSTEM_SHARE_PERCENT);

/** Ownership of Chew Network, as a percentage, for a holding of `stakes`. */
export const ownershipPercent = (stakes: number): number =>
  (stakes / TOTAL_ECOSYSTEM_STAKES) * ECOSYSTEM_SHARE_PERCENT;

/** The pool size written out, e.g. "80,000,000,000". */
export const formatTotalStakes = (): string =>
  new Intl.NumberFormat('en-US').format(TOTAL_ECOSYSTEM_STAKES);

/**
 * The smallest parcel of stakes the business issues. Ownership has to render
 * exactly at this size, or a certificate shows a rounded figure.
 */
const SMALLEST_PARCEL = 50_000;

/**
 * Decimal places needed to render ownership without rounding, derived rather
 * than written down: a hundredfold larger pool makes every percentage a
 * hundredth the size, and a fixed precision chosen for an older pool quietly
 * starts rounding certificates instead of failing loudly.
 */
export const OWNERSHIP_DECIMALS = (() => {
  const exact = ownershipPercent(SMALLEST_PARCEL);
  let decimals = 2;
  while (decimals < 20 && Number(exact.toFixed(decimals)) !== exact) decimals++;
  return decimals;
})();
