-- ============================================================
-- Private storage for investor documents
-- ============================================================
--
-- Documents were previously referenced by a URL typed into the admin form, so
-- the file had to already be hosted somewhere. Netlify cannot accept uploads
-- into a deployed build, so that meant committing files to the repo and
-- rebuilding. This bucket lets the admin panel upload directly.
--
-- The bucket is PRIVATE. Nothing is readable by URL alone: the app mints a
-- short-lived signed link per view, so a leaked link expires.
--
-- Path convention, which the policies below depend on:
--   <investor_uuid>/<filename>   a document for one investor
--   global/<filename>            shared with every investor

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'investor-documents',
  'investor-documents',
  false,
  52428800, -- 50 MB
  ARRAY[
    'application/pdf',
    'image/png',
    'image/jpeg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ------------------------------------------------------------
-- Access policies
-- ------------------------------------------------------------
-- Admins manage everything in the bucket.
DROP POLICY IF EXISTS "investor_docs_admin_all" ON storage.objects;
CREATE POLICY "investor_docs_admin_all" ON storage.objects
FOR ALL TO authenticated
USING (bucket_id = 'investor-documents' AND public.is_admin_user())
WITH CHECK (bucket_id = 'investor-documents' AND public.is_admin_user());

-- An investor may read only their own folder, plus anything shared globally.
-- createSignedUrl requires SELECT on the object, so this is what decides
-- whether a signed link can be minted at all.
DROP POLICY IF EXISTS "investor_docs_read_own" ON storage.objects;
CREATE POLICY "investor_docs_read_own" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'investor-documents'
  AND (
    (storage.foldername(name))[1] = 'global'
    OR (storage.foldername(name))[1] = public.get_my_investor_id()::TEXT
  )
);

-- ------------------------------------------------------------
-- Tell stored references apart
-- ------------------------------------------------------------
-- file_url has always held an external URL. It now also holds bucket paths, so
-- readers need to know which they have: a value starting with http(s) is an
-- external link, anything else is a path inside this bucket.
COMMENT ON COLUMN public.investor_documents.file_url IS
  'Either an external https URL, or a path inside the private '
  'investor-documents bucket (<investor_uuid>/<file> or global/<file>), '
  'which must be served through a signed URL.';
