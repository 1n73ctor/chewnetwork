import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { getRequestIp } from '@/lib/requestIp';
import { normalizeEmail } from '@/lib/email';

/**
 * Records a rejected sign-in attempt, with the IP it came from.
 *
 * Unauthenticated by necessity: the attempt failed, so there is no session to
 * check. That makes this the one route someone could call at will, so it is
 * kept as narrow as possible — the caller supplies only the attempted email and
 * a reason, the IP comes from the edge headers, and the SQL function behind it
 * rate-limits per address.
 *
 * The response is the same whatever happens. It must never become an oracle for
 * whether an address belongs to a real investor.
 */

const REASONS = ['invalid_credentials', 'account_blocked'];

export async function POST(request: NextRequest) {
  let body: { email?: string; reason?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ recorded: false }, { status: 200 });
  }

  const email = normalizeEmail(body.email);
  if (!email) {
    return NextResponse.json({ recorded: false }, { status: 200 });
  }

  const reason = REASONS.includes(body.reason ?? '') ? body.reason : 'invalid_credentials';

  // The anon key, because there is no session to borrow. The function is
  // SECURITY DEFINER and fixes the action itself, so anon can write this one
  // kind of row and nothing else.
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { error } = await supabase.rpc('record_failed_login', {
    p_email: email,
    p_ip: getRequestIp(request.headers) ?? '',
    p_user_agent: request.headers.get('user-agent') ?? '',
    p_reason: reason,
  });

  if (error) console.error('record_failed_login error:', error.message);

  return NextResponse.json({ recorded: true });
}
