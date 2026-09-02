import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { isAdminUser } from '@/lib/authRedirect';
import { isAccountActive } from '@/lib/accountStatus';

/**
 * Activates or deactivates an investor, and makes it stick immediately.
 *
 * Flipping `account_status` alone leaves the investor holding a valid access
 * token for up to an hour. Everything else in the app closes that window
 * defensively (RLS, the middleware re-check, the live sign-out in AuthContext);
 * this route closes it at the source, by banning the auth user so GoTrue drops
 * their refresh tokens and refuses new sign-ins.
 *
 * Server-only, so the service-role key never reaches the browser. Without that
 * key configured the status change still applies and the other layers still
 * shut the door — the session simply dies at its next refresh instead of now.
 */

// Effectively permanent; lifted the moment the investor is reactivated.
const BAN_DURATION = '876000h';

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user)) {
    return NextResponse.json({ error: 'Not authorised.' }, { status: 403 });
  }

  let body: { investorRowId?: string; status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { investorRowId, status } = body;
  if (!investorRowId || !status) {
    return NextResponse.json({ error: 'investorRowId and status are required.' }, { status: 400 });
  }
  if (!['active', 'inactive', 'suspended', 'pending'].includes(status)) {
    return NextResponse.json({ error: `Unknown account status "${status}".` }, { status: 400 });
  }

  // RLS: admins may update investors.
  const { data: investor, error: updateError } = await supabase
    .from('investors')
    .update({ account_status: status })
    .eq('id', investorRowId)
    .select('user_id')
    .maybeSingle();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }
  if (!investor) {
    return NextResponse.json({ error: 'Investor not found.' }, { status: 404 });
  }

  const shouldHaveAccess = isAccountActive(status);
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // No linked auth account yet, or no service key — the status change is all we
  // can do here, and it is enough for every other layer to act on.
  if (!investor.user_id || !serviceKey) {
    return NextResponse.json({
      status,
      sessionsRevoked: false,
      reason: !investor.user_id ? 'no-auth-account' : 'no-service-role-key',
    });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const admin = createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error: banError } = await admin.auth.admin.updateUserById(investor.user_id, {
    ban_duration: shouldHaveAccess ? 'none' : BAN_DURATION,
  });

  if (banError) {
    // The status change already landed, so report the partial result rather
    // than pretending the whole thing failed.
    return NextResponse.json(
      { status, sessionsRevoked: false, error: `Status saved, but sessions were not revoked: ${banError.message}` },
      { status: 502 }
    );
  }

  return NextResponse.json({ status, sessionsRevoked: !shouldHaveAccess });
}
