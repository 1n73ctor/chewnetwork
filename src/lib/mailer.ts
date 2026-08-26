import 'server-only';
import nodemailer, { type Transporter } from 'nodemailer';

/**
 * Outgoing mail for admin broadcasts, over the project's own SMTP account.
 *
 * Deliberately separate from Supabase Auth's mailer: that one sends the
 * transactional login mail (password resets, set-password links) and is
 * configured in the Supabase dashboard, not here.
 */

export type MailConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  from: string;
};

/** Reads SMTP settings from the environment, or null when any are missing. */
export const getMailConfig = (): MailConfig | null => {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM?.trim() || user;
  if (!host || !user || !password || !from) return null;

  const port = Number(process.env.SMTP_PORT) || 587;
  // Port 465 is implicit TLS; 587 upgrades via STARTTLS. Honour an explicit
  // SMTP_SECURE when set, otherwise infer from the port.
  const secureEnv = process.env.SMTP_SECURE?.trim().toLowerCase();
  const secure = secureEnv ? secureEnv === 'true' : port === 465;

  return { host, port, secure, user, password, from };
};

export const isMailConfigured = (): boolean => getMailConfig() !== null;

let cached: Transporter | null = null;

const getTransport = (config: MailConfig): Transporter => {
  if (!cached) {
    cached = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.password },
    });
  }
  return cached;
};

/** Confirms the SMTP credentials actually authenticate, without sending mail. */
export const verifyMailConnection = async (): Promise<{ ok: boolean; error?: string }> => {
  const config = getMailConfig();
  if (!config) return { ok: false, error: 'SMTP is not configured.' };
  try {
    await getTransport(config).verify();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'SMTP connection failed.' };
  }
};

export type Recipient = { email: string; name?: string };
export type SendResult = {
  sent: number;
  failed: { email: string; error: string }[];
};

/**
 * Sends one message per recipient rather than a single message with everyone in
 * the header — investors must not see each other's addresses. Runs in small
 * batches so a large list doesn't trip the provider's rate limit, and a single
 * bad address never aborts the rest of the run.
 */
export const sendBulkMail = async (
  recipients: Recipient[],
  subject: string,
  body: string,
  batchSize = 5
): Promise<SendResult> => {
  const config = getMailConfig();
  if (!config) throw new Error('SMTP is not configured.');

  const transport = getTransport(config);
  const result: SendResult = { sent: 0, failed: [] };

  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    const outcomes = await Promise.allSettled(
      batch.map((recipient) =>
        transport.sendMail({
          from: config.from,
          to: recipient.name ? `${recipient.name} <${recipient.email}>` : recipient.email,
          subject,
          text: body,
          html: bodyToHtml(body),
        })
      )
    );

    outcomes.forEach((outcome, index) => {
      if (outcome.status === 'fulfilled') {
        result.sent += 1;
      } else {
        result.failed.push({
          email: batch[index].email,
          error: outcome.reason instanceof Error ? outcome.reason.message : 'Send failed.',
        });
      }
    });
  }

  return result;
};

const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Plain text in, simple paragraphed HTML out. Escaped, since admins type it. */
const bodyToHtml = (body: string): string => {
  const paragraphs = escapeHtml(body)
    .split(/\n{2,}/)
    .map((block) => `<p style="margin:0 0 16px">${block.replace(/\n/g, '<br>')}</p>`)
    .join('');
  return `<div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;font-size:15px;line-height:1.6;color:#1a1f1b">${paragraphs}</div>`;
};
