import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isAdminUser, resolveLandingPathForUser } from '@/lib/authRedirect';
import { BLOCKED_REASON, isAccountActive } from '@/lib/accountStatus';

function getProjectRef(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return url.match(/https:\/\/([^.]+)\./)?.[1] ?? '';
}

function injectTokenFromHeader(request: NextRequest): void {
  const token = request.headers.get('x-sb-token');
  if (!token) return;
  const hasCookie = request.cookies.getAll().some((c) => c.name.includes('auth-token'));
  if (hasCookie) return;
  request.cookies.set(`sb-${getProjectRef()}-auth-token`, token);
}

export async function middleware(request: NextRequest) {
  injectTokenFromHeader(request);
  let supabaseResponse = NextResponse.next({ request });

  // Match the browser's cookie rules: `secure` is rejected over plain HTTP.
  const secureOrigin =
    request.nextUrl.protocol === 'https:' || request.nextUrl.hostname === 'localhost';

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, {
              ...options,
              sameSite: secureOrigin ? 'none' : 'lax',
              secure: secureOrigin,
            });
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === '/login';
  // Only the portal is gated. The marketing site stays public.
  const isInvestorPage = pathname === '/investor' || pathname.startsWith('/investor/');
  const isAdminPage = pathname === '/admin' || pathname.startsWith('/admin/');
  const isPortalPage = isInvestorPage || isAdminPage;

  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = '';
    return NextResponse.redirect(url);
  };

  // Maintenance mode, checked before anything about the user's own account.
  //
  // Admins are exempt without exception — locking them out would leave nobody
  // able to switch it back off. That is also why an anonymous visitor to
  // /login is let through: until they authenticate there is no way to know an
  // admin from an investor, and turning the login form away would strand the
  // one person who can end the maintenance window. A signed-in investor
  // landing there is redirected, and the sign-in itself is refused in
  // AuthContext, so the form being reachable gives an investor nothing.
  const maintenanceApplies = isPortalPage || (isLoginPage && Boolean(user));
  if (maintenanceApplies && !(user && isAdminUser(user))) {
    const { data: settings } = await supabase
      .from('portal_settings')
      .select('maintenance_mode')
      .limit(1)
      .maybeSingle();

    if (settings?.maintenance_mode) {
      return redirectTo('/maintenance');
    }
  }

  if (!user && isPortalPage) {
    // Send them back to where they were headed once they sign in.
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  if (user) {
    const isAdmin = isAdminUser(user);

    // A deactivated investor still holds a perfectly valid access token for up
    // to an hour, so status is re-checked on every gated request rather than
    // trusted from sign-in time. Admins are exempt: they have no investors row.
    if (!isAdmin) {
      const { data: investor } = await supabase
        .from('investors')
        .select('account_status')
        .eq('user_id', user.id)
        .maybeSingle();

      if (investor && !isAccountActive(investor.account_status)) {
        // Global scope, so every other device signed in as them drops too.
        try {
          await supabase.auth.signOut({ scope: 'global' });
        } catch {
          // Already-invalid tokens are fine; the redirect below still applies.
        }
        // Already on the login page being told why — don't bounce in a loop.
        if (isLoginPage && request.nextUrl.searchParams.get('reason') === BLOCKED_REASON) {
          return supabaseResponse;
        }
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.search = `?reason=${BLOCKED_REASON}`;
        const response = NextResponse.redirect(url);
        // signOut() wrote its cookie clearing onto supabaseResponse, which we
        // are not returning — carry it across or the session survives.
        supabaseResponse.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));
        return response;
      }
    }

    if (isLoginPage) {
      return redirectTo(await resolveLandingPathForUser(supabase, user));
    }
    // Investors cannot reach the admin console; admins land on their own.
    if (isAdminPage && !isAdmin) {
      return redirectTo('/investor');
    }
    if (isInvestorPage && isAdmin) {
      return redirectTo('/admin');
    }
  }

  return supabaseResponse;
}

export const config = {
  // Scoped deliberately: calling supabase.auth.getUser() on every public request
  // costs a network round-trip per page view and trips Supabase's auth rate
  // limit (429 over_request_rate_limit). Only the gated routes need it.
  matcher: ['/investor/:path*', '/investor', '/admin/:path*', '/admin', '/login'],
};
