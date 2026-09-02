/**
 * Whether an investor is allowed into the portal.
 *
 * `investors.account_status` is the single source of truth. Anything other than
 * 'active' — inactive, suspended, pending — is turned away, because an admin
 * deactivating someone expects the door to be shut, not narrowed.
 *
 * Enforcement is deliberately layered, since a signed-in browser holds a valid
 * access token for up to an hour after the admin acts:
 *   1. RLS         — a blocked investor reads nothing but their own row.
 *   2. middleware  — every portal request re-checks status and signs them out.
 *   3. AuthContext — the open tab reacts live and drops its own session.
 *   4. admin API   — the service role bans the auth user, killing refresh tokens.
 */

/** Query param the login page reads to explain an unexpected sign-out. */
export const BLOCKED_REASON = 'deactivated';

/** Shown wherever a blocked investor is turned away. Kept in one place so the
 *  login banner, the sign-in error and the portal all say the same thing. */
export const BLOCKED_MESSAGE =
  'Your account is temporarily blocked. Please contact your administrator or investor support for assistance.';

export const isAccountActive = (status?: string | null): boolean =>
  (status ?? '').trim().toLowerCase() === 'active';

/** Shown when an investor tries to sign in while the portal is closed. */
export const MAINTENANCE_MESSAGE =
  'The investor portal is temporarily offline for maintenance. Please try again shortly.';
