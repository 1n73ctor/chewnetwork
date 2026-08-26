import { createBrowserClient } from '@supabase/ssr';

const PFX = 'sb_';

/**
 * `Secure` cookies are only accepted over HTTPS (localhost excepted), so on a
 * plain-HTTP origin — a LAN IP like http://192.168.0.5:4028 during development —
 * every auth cookie would be silently dropped and the server would never see the
 * session. Use SameSite=None/Secure/Partitioned only where it actually works
 * (HTTPS, needed for embedded preview contexts) and fall back to Lax otherwise.
 */
const isSecureOrigin = () =>
  typeof window !== 'undefined' &&
  (window.location.protocol === 'https:' || window.location.hostname === 'localhost');

const cookieAttrs = () =>
  isSecureOrigin() ? 'SameSite=None; Secure; Partitioned' : 'SameSite=Lax';

const canUseCookies = (() => {
  let cache: boolean | null = null;
  return () => {
    if (typeof document === 'undefined') return false;
    if (cache !== null) return cache;
    const k = '__sb_test__';
    document.cookie = `${k}=1; Path=/; ${cookieAttrs()}`;
    cache = document.cookie.includes(k);
    document.cookie = `${k}=; Path=/; Max-Age=0; ${cookieAttrs()}`;
    return cache;
  };
})();

const fromCookies = () =>
  typeof document === 'undefined' ? [] :
  document.cookie.split(';').filter(Boolean).map((c) => {
    const idx = c.trim().indexOf('=');
    const name = idx >= 0 ? c.trim().slice(0, idx) : c.trim();
    const value = idx >= 0 ? decodeURIComponent(c.trim().slice(idx + 1)) : '';
    return { name: name.trim(), value };
  }).filter((c) => c.name);

const fromStorage = () => {
  try {
    return Object.keys(localStorage)
      .filter((k) => k.startsWith(PFX))
      .map((k) => ({ name: k.slice(PFX.length), value: localStorage.getItem(k) || '' }));
  } catch { return []; }
};

const setCookie = (name: string, value: string, options?: Record<string, unknown>) => {
  let s = `${name}=${encodeURIComponent(value)}; Path=${(options?.path as string) || '/'}; ${cookieAttrs()}`;
  if (options?.maxAge) s += `; Max-Age=${options.maxAge}`;
  if (options?.domain) s += `; Domain=${options.domain}`;
  if (options?.expires) s += `; Expires=${new Date(options.expires as string).toUTCString()}`;
  document.cookie = s;
};

const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  const domains = ['', host, host ? `.${host}` : ''].filter(Boolean);
  const variants = [
    'Path=/; SameSite=Lax',
    'Path=/; SameSite=None; Secure',
    'Path=/; SameSite=None; Secure; Partitioned',
    `Path=/; ${cookieAttrs()}`,
  ];
  variants.forEach((attrs) => {
    document.cookie = `${name}=; Max-Age=0; ${attrs}`;
    domains.forEach((domain) => {
      document.cookie = `${name}=; Max-Age=0; Domain=${domain}; ${attrs}`;
    });
  });
};

const getToken = () =>
  (canUseCookies() ? fromCookies() : fromStorage())
    .find((c) => c.name.includes('auth-token'))?.value ?? null;

if (typeof window !== 'undefined' && !(window as Record<string, unknown>).__sb_patched__) {
  (window as Record<string, unknown>).__sb_patched__ = true;
  const orig = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const token = getToken();
    const url = typeof input === 'string' ? input
      : input instanceof URL ? input.href
      : (input as Request).url;
    const isLocal = url.startsWith('/') || url.startsWith(window.location.origin);
    // Supabase auth endpoints must not carry the custom header - it breaks signInWithPassword.
    const isAuthEndpoint = url.includes('/auth/v1/');
    if (token && isLocal && !isAuthEndpoint) {
      init = { ...(init || {}), headers: { ...(init?.headers || {}), 'x-sb-token': token } };
    }
    return orig(input, init);
  };
}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => canUseCookies() ? fromCookies() : fromStorage(),
        setAll(cookiesToSet) {
          if (typeof document === 'undefined') return;
          if (canUseCookies()) {
            cookiesToSet.forEach(({ name, value, options }) =>
              value ? setCookie(name, value, options as Record<string, unknown>)
                    : deleteCookie(name)
            );
          } else {
            cookiesToSet.forEach(({ name, value, options }) => {
              try {
                value ? localStorage.setItem(`${PFX}${name}`, value)
                      : localStorage.removeItem(`${PFX}${name}`);
              } catch {}
              if (value) setCookie(name, value, options as Record<string, unknown>);
            });
          }
        },
      },
    }
  );
}
