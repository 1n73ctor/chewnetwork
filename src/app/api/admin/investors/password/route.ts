import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { isAdminUser } from '@/lib/authRedirect';
import { normalizeEmail } from '@/lib/email';

/**
 * Sets an investor's portal password on an admin's behalf.
 *
 * This exists because emailing a reset link cannot fix the cases that actually
 * come up. `resetPasswordForEmail` reports success for an address with no
 * account at all — Supabase deliberately will not reveal whether one exists —
 * so the panel could report "reset email sent" for an investor who had no
 * login and never would. Investors whose rows came from a data migration
 * rather than the Add Investor form are exactly those investors.
 *
 * Three cases, all handled here rather than left to the admin to work out:
 *
 *   updated   the row already points at an auth account; its password is set
 *   relinked  no user_id on the row, but an auth account exists for the
 *             address — adopt it rather than failing on a duplicate email
 *   created   no account anywhere; one is created, confirmed and linked
 *
 * Server-only, so the service-role key never reaches the browser. There is no
 * fallback: without that key nothing can set another user's password, and this
 * route says so plainly instead of reporting a success that did not happen.
 */

const MIN_PASSWORD = 8;
const PAGE_SIZE = 200;
const MAX_PAGES = 25;

/**
 * GoTrue has no look-up-by-email for admins, so page through. Bounded, so a
 * large project cannot turn this into an unbounded scan.
 */
async function findUserIdByEmail(admin: any, email: string): Promise<string | undefined> {
  for (let page = 1; page <= MAX_PAGES; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: PAGE_SIZE });
    if (error) return undefined;
    const users: any[] = data?.users || [];
    const hit = users.find((u) => normalizeEmail(u?.email) === email);
    if (hit) return hit.id;
    if (users.length < PAGE_SIZE) return undefined;
  }
  return undefined;
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user)) {
    return NextResponse.json({ error: 'Not authorised.' }, { status: 403 });
  }

  let body: { investorRowId?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { investorRowId, password } = body;
  if (!investorRowId || !password) {
    return NextResponse.json({ error: 'investorRowId and password are required.' }, { status: 400 });
  }
  if (password.length < MIN_PASSWORD) {
    return NextResponse.json(
      { error: `Password must be at least ${MIN_PASSWORD} characters.` },
      { status: 400 }
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.json(
      {
        error:
          'SUPABASE_SERVICE_ROLE_KEY is not configured on this deployment, so a password cannot be set from the portal. Add it to the site environment variables, or set the password in the Supabase dashboard under Authentication → Users.',
      },
      { status: 503 }
    );
  }

  // Read the investor through the admin's own session, so RLS still decides
  // what this admin is allowed to see.
  const { data: investor, error: lookupError } = await supabase
    .from('investors')
    .select('id, email, user_id')
    .eq('id', investorRowId)
    .maybeSingle();
  if (lookupError) {
    return NextResponse.json({ error: lookupError.message }, { status: 400 });
  }
  if (!investor) {
    return NextResponse.json({ error: 'No such investor.' }, { status: 404 });
  }

  const email = normalizeEmail(investor.email);
  if (!email) {
    return NextResponse.json(
      { error: 'That investor has no email address, so there is nothing to sign in with.' },
      { status: 400 }
    );
  }

  const admin = createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let userId: string | null = (investor.user_id as string | null) ?? null;
  let mode: 'updated' | 'relinked' | 'created' = 'updated';

  // The row can say "no login" while an auth account for the address exists
  // anyway: the sign-up fallback in the account route can leave it that way.
  // Creating a second account would fail on the duplicate address, so adopt
  // the one that is already there.
  if (!userId) {
    userId = (await findUserIdByEmail(admin, email)) ?? null;
    if (userId) mode = 'relinked';
  }

  if (userId) {
    const { error } = await admin.auth.admin.updateUserById(userId, {
      password,
      // An account made by the sign-up fallback may never have been confirmed,
      // which refuses sign-in however good the password is.
      email_confirm: true,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    userId = data.user?.id ?? null;
    mode = 'created';
    if (!userId) {
      return NextResponse.json(
        { error: 'The login was created but no user id came back, so it could not be linked.' },
        { status: 500 }
      );
    }
  }

  // Keep the investor row pointing at the account the password belongs to.
  if (investor.user_id !== userId) {
    const { error: linkError } = await supabase
      .from('investors')
      .update({ user_id: userId, updated_at: new Date().toISOString() })
      .eq('id', investorRowId);
    if (linkError) {
      return NextResponse.json(
        { error: `The password was set, but linking the login to the investor failed: ${linkError.message}` },
        { status: 500 }
      );
    }
  }

  // Read the account back rather than trusting the write, and report the one
  // thing that still silently blocks sign-in.
  const { data: after } = await admin.auth.admin.getUserById(userId);
  const emailConfirmed = Boolean(after?.user?.email_confirmed_at);

  return NextResponse.json({ ok: true, mode, emailConfirmed });
}
