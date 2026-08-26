import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { isAdminUser } from '@/lib/authRedirect';
import { normalizeEmail } from '@/lib/email';

/**
 * Creates the Supabase auth account for an investor and links it to their
 * `investors` row. Admin-only, and server-only so the service-role key (when
 * configured) is never shipped to the browser.
 *
 * With SUPABASE_SERVICE_ROLE_KEY set, the admin API creates the user directly
 * with a chosen password. Without it we fall back to a plain sign-up, which
 * works here because the project has signups enabled and mailer autoconfirm on.
 */

const randomPassword = () =>
  `Cn-${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}!`;

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user)) {
    return NextResponse.json({ error: 'Not authorised.' }, { status: 403 });
  }

  let body: { investorRowId?: string; email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { investorRowId } = body;
  // Normalised here too: this route is reachable directly, not only through the
  // admin UI, and the address must match the `investors` row it gets linked to.
  const email = normalizeEmail(body.email);
  if (!investorRowId || !email) {
    return NextResponse.json({ error: 'investorRowId and email are required.' }, { status: 400 });
  }
  if (body.password && body.password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  }

  // No password given → make one up and email them a reset link instead.
  const password = body.password || randomPassword();
  const mustSetOwnPassword = !body.password;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const noSession = { auth: { autoRefreshToken: false, persistSession: false } };

  let userId: string | undefined;
  let mode: 'service-role' | 'signup';

  if (serviceKey) {
    const admin = createSupabaseClient(url, serviceKey, noSession);
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    userId = data.user?.id;
    mode = 'service-role';
  } else {
    const anon = createSupabaseClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, noSession);
    const { data, error } = await anon.auth.signUp({ email, password });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    userId = data.user?.id;
    mode = 'signup';
  }

  if (!userId) {
    return NextResponse.json({ error: 'Account created but no user id returned.' }, { status: 500 });
  }

  // Link the auth account to the investor record (RLS: admins may update investors).
  const { error: linkError } = await supabase
    .from('investors')
    .update({ user_id: userId })
    .eq('id', investorRowId);

  if (linkError) {
    return NextResponse.json(
      { error: `Account created but linking failed: ${linkError.message}`, userId, mode },
      { status: 500 }
    );
  }

  return NextResponse.json({ userId, mode, mustSetOwnPassword });
}
