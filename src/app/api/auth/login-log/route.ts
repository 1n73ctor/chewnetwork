import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { getRequestIp } from '@/lib/requestIp';

/**
 * Records the signed-in user's sign-in, with the IP it came from.
 *
 * This has to be a server route: the browser cannot see its own public address,
 * so the IP is read from the edge headers here and the client never gets a say
 * in what is written.
 *
 * Called right after sign-in succeeds. Failures are deliberately quiet — a
 * missing audit row must never be the reason someone cannot log in.
 */

/**
 * The caller passes its access token explicitly. Cookies alone are not enough:
 * this app falls back to localStorage wherever cookies are blocked (see
 * lib/supabase/client.ts), and even with cookies working the write races the
 * fetch that follows sign-in. The token is still verified against Supabase
 * below, so supplying one proves nothing on its own.
 */
function authedClient(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) return null;
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { Authorization: authorization } },
    }
  );
}

export async function POST(request: NextRequest) {
  const supabase = authedClient(request) ?? (await createServerSupabase());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const ip = getRequestIp(request.headers) ?? '';
  const userAgent = request.headers.get('user-agent') ?? '';

  // The function is SECURITY DEFINER and fixes both the action and whose row it
  // lands on from auth.uid(), so the caller only supplies the IP — and here
  // that comes from the edge headers, not from the browser.
  const { error } = await supabase.rpc('record_login_event', {
    p_ip: ip,
    p_user_agent: userAgent,
  });

  if (error) {
    console.error('record_login_event error:', error.message);
    return NextResponse.json({ logged: false }, { status: 200 });
  }

  return NextResponse.json({ logged: true, ip: ip || null });
}
