import { createClient } from '@/lib/supabase/client';

/**
 * Files for the investor portal, held in a private Supabase Storage bucket.
 *
 * Netlify serves a static build, so a file cannot be added to a deployed site
 * without committing it and rebuilding. Uploads go here instead, and are read
 * back through short-lived signed links rather than public URLs.
 */

export const DOCUMENTS_BUCKET = 'investor-documents';

/** How long a generated link stays valid. Long enough to open and read a PDF. */
export const SIGNED_URL_TTL_SECONDS = 60 * 60;

/**
 * `file_url` predates the bucket and still holds external links for older
 * rows, so the two cases have to be told apart on read.
 */
export const isExternalUrl = (value: string | null | undefined): boolean =>
  /^https?:\/\//i.test((value || '').trim());

/** Strips characters that would make an awkward or ambiguous object key. */
const safeName = (name: string): string => {
  const cleaned = name
    .normalize('NFKD')
    .replace(/[^\w.\- ]+/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return cleaned || 'document';
};

/**
 * Builds the object path. The first segment is what the storage policies match
 * on, so it decides who can read the file: an investor's own uuid, or `global`
 * for something shared with everyone.
 */
export const buildDocumentPath = (investorId: string | null | undefined, fileName: string): string => {
  const folder = investorId || 'global';
  // Prefixed with a timestamp so re-uploading the same filename does not
  // silently overwrite the previous document.
  return `${folder}/${Date.now()}-${safeName(fileName)}`;
};

export type UploadResult =
  | { ok: true; path: string }
  | { ok: false; error: string };

/** Uploads one file and returns the stored path (not a URL). */
export const uploadDocumentFile = async (
  file: File,
  investorId?: string | null
): Promise<UploadResult> => {
  const supabase = createClient();
  const path = buildDocumentPath(investorId, file.name);

  const { error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type || undefined });

  if (error) return { ok: false, error: error.message };
  return { ok: true, path };
};

/**
 * Turns a stored `file_url` into something openable.
 *
 * External links are returned untouched; bucket paths are signed. Returns null
 * when the caller is not allowed to read the object, which is the storage
 * policy doing its job rather than an error to surface.
 */
export const resolveDocumentUrl = async (
  fileUrl: string | null | undefined
): Promise<string | null> => {
  const value = (fileUrl || '').trim();
  if (!value) return null;
  if (isExternalUrl(value)) return value;

  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .createSignedUrl(value, SIGNED_URL_TTL_SECONDS);

  if (error) {
    console.error('resolveDocumentUrl error:', error.message);
    return null;
  }
  return data?.signedUrl ?? null;
};

/** Removes an object. Ignores external links, which this app does not host. */
export const deleteDocumentFile = async (fileUrl: string | null | undefined): Promise<void> => {
  const value = (fileUrl || '').trim();
  if (!value || isExternalUrl(value)) return;
  const supabase = createClient();
  const { error } = await supabase.storage.from(DOCUMENTS_BUCKET).remove([value]);
  if (error) console.error('deleteDocumentFile error:', error.message);
};
