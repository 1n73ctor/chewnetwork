/**
 * The client IP for an incoming request.
 *
 * A browser cannot be asked for its own address, and anything it volunteered
 * would be worth nothing in an audit log, so this reads the headers the edge
 * puts on the request instead.
 *
 * Netlify's own header is checked first because it is set by the platform and
 * cannot be spoofed by the caller. x-forwarded-for CAN be forged by a client
 * when nothing upstream overwrites it, so it is only a fallback — and only its
 * first entry, which is the original client; the rest are the proxies it passed
 * through.
 */

const HEADERS = [
  'x-nf-client-connection-ip', // Netlify
  'cf-connecting-ip', // Cloudflare
  'true-client-ip',
  'x-real-ip',
  'x-forwarded-for',
];

export function getRequestIp(headers: Headers): string | null {
  for (const name of HEADERS) {
    const value = headers.get(name);
    if (!value) continue;
    const ip = value.split(',')[0]?.trim();
    if (ip) return ip;
  }
  return null;
}
