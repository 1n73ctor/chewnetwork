/**
 * Where a signed-in user belongs after authentication.
 *
 * The app hosts three audiences behind one login: admins (/admin), investors
 * with a row in `investors` (/investor), and everyone else on the public
 * network side (/profile).
 */

export const PUBLIC_LANDING = '/profile';
export const INVESTOR_LANDING = '/investor';
export const ADMIN_LANDING = '/admin';

export const isAdminUser = (user: any): boolean => {
  const meta = user?.user_metadata || user?.raw_user_meta_data || {};
  const appMeta = user?.app_metadata || user?.raw_app_meta_data || {};
  return meta?.role === 'admin' || meta?.role === 'super_admin' ||
         appMeta?.role === 'admin' || appMeta?.role === 'super_admin';
};

export const resolveLandingPath = (
  { isAdmin, hasInvestorProfile }: { isAdmin: boolean; hasInvestorProfile: boolean }
): string => {
  if (isAdmin) return ADMIN_LANDING;
  if (hasInvestorProfile) return INVESTOR_LANDING;
  return PUBLIC_LANDING;
};

/**
 * Resolves the landing path for `user` against an authenticated Supabase
 * client (browser or server). Falls back to the public landing on any error so
 * a failed lookup never blocks sign-in.
 */
export const resolveLandingPathForUser = async (supabase: any, user: any): Promise<string> => {
  if (!user) return PUBLIC_LANDING;
  if (isAdminUser(user)) return ADMIN_LANDING;
  try {
    const { data } = await supabase
      .from('investors')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();
    return resolveLandingPath({ isAdmin: false, hasInvestorProfile: Boolean(data) });
  } catch {
    return PUBLIC_LANDING;
  }
};
