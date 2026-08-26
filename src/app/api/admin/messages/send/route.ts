import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';
import { isAdminUser } from '@/lib/authRedirect';
import { isMailConfigured, sendBulkMail, type Recipient } from '@/lib/mailer';

/**
 * Sends an admin broadcast to investors over SMTP.
 *
 * The recipient list is resolved here from the database rather than taken from
 * the request, so the browser can only choose an audience — never an arbitrary
 * address to mail through this account.
 */

// nodemailer opens a TCP socket, which the edge runtime cannot do.
export const runtime = 'nodejs';

type Audience = 'all' | 'phase_1' | 'phase_2' | 'selected';

const matchesAudience = (round: string | null, audience: Audience): boolean => {
  const value = (round || '').toLowerCase();
  if (audience === 'all') return true;
  if (audience === 'phase_1') return value.includes('phase 1') || value.includes('1');
  if (audience === 'phase_2') return value.includes('phase 2') || value.includes('2');
  return false;
};

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user)) {
    return NextResponse.json({ error: 'Not authorised.' }, { status: 403 });
  }

  if (!isMailConfigured()) {
    return NextResponse.json(
      { error: 'Email is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD and SMTP_FROM.' },
      { status: 503 }
    );
  }

  let body: {
    subject?: string;
    message?: string;
    audience?: Audience;
    selectedInvestorId?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const subject = body.subject?.trim();
  const message = body.message?.trim();
  const audience: Audience = body.audience || 'all';
  if (!subject || !message) {
    return NextResponse.json({ error: 'A subject and message are required.' }, { status: 400 });
  }
  if (audience === 'selected' && !body.selectedInvestorId) {
    return NextResponse.json({ error: 'Select an investor for targeted messaging.' }, { status: 400 });
  }

  let query = supabase.from('investors').select('id, first_name, last_name, email, round');
  if (audience === 'selected') query = query.eq('id', body.selectedInvestorId!);

  const { data: rows, error } = await query;
  if (error) {
    return NextResponse.json({ error: `Could not load recipients: ${error.message}` }, { status: 500 });
  }

  const recipients: Recipient[] = (rows || [])
    .filter((row) => row.email && matchesAudience(row.round, audience))
    .map((row) => ({
      email: row.email as string,
      name: [row.first_name, row.last_name].filter(Boolean).join(' ') || undefined,
    }));

  if (recipients.length === 0) {
    return NextResponse.json({ error: 'No investors with an email address match that audience.' }, { status: 400 });
  }

  try {
    const result = await sendBulkMail(recipients, subject, message);
    return NextResponse.json({
      sent: result.sent,
      failedCount: result.failed.length,
      // Capped: a large bad list should not return an unbounded payload.
      failed: result.failed.slice(0, 20),
      total: recipients.length,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Sending failed.' },
      { status: 500 }
    );
  }
}
