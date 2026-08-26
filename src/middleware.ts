import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isAdminUser, resolveLandingPathForUser } from '@/lib/authRedirect';

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

  if (!user && isPortalPage) {
    // Send them back to where they were headed once they sign in.
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  if (user) {
    const isAdmin = isAdminUser(user);

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
