-- ============================================================
-- Deactivating an investor actually locks them out
-- ============================================================
--
-- Setting investors.account_status to anything but 'active' used to be a label
-- only: nothing read it, so a deactivated investor kept full access until their
-- session happened to expire. This makes the database itself the last word.
--
-- The one thing a blocked investor may still read is their OWN investors row.
-- That is deliberate and load-bearing:
--   * the app needs account_status to tell "blocked" from "not an investor",
--     so it can show the right message instead of a blank portal;
--   * realtime postgres_changes only delivers rows the listener may SELECT, so
--     without it an open tab would never learn it had just been deactivated.
-- Everything else — stakes, documents, reports, updates, the hotline, the
-- welcome kit — is closed.

-- ------------------------------------------------------------
-- Helper
-- ------------------------------------------------------------
-- SECURITY DEFINER so it can read investors without tripping the very policies
-- it is used by, matching is_admin_user() / get_my_investor_id() alongside it.
CREATE OR REPLACE FUNCTION public.is_active_investor()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
  SELECT 1 FROM public.investors
  WHERE user_id = auth.uid()
    AND lower(account_status::TEXT) = 'active'
)
$$;

COMMENT ON FUNCTION public.is_active_investor() IS
  'True when the calling user has an investors row with account_status = active. '
  'Gates every investor-facing read; admins are checked with is_admin_user() instead.';

-- ------------------------------------------------------------
-- Investor-facing read policies
-- ------------------------------------------------------------

-- stake_transactions
DROP POLICY IF EXISTS "stake_transactions_select_own" ON public.stake_transactions;
CREATE POLICY "stake_transactions_select_own" ON public.stake_transactions
FOR SELECT TO authenticated
USING (
  (investor_id = public.get_my_investor_id() AND public.is_active_investor())
  OR public.is_admin_user()
);

-- investor_documents
DROP POLICY IF EXISTS "investor_documents_select_own" ON public.investor_documents;
CREATE POLICY "investor_documents_select_own" ON public.investor_documents
FOR SELECT TO authenticated
USING (
  (
    (investor_id = public.get_my_investor_id() OR is_global = true)
    AND public.is_active_investor()
  )
  OR public.is_admin_user()
);

-- investor_reports — was USING (true), which also let non-investor accounts read
DROP POLICY IF EXISTS "investor_reports_select" ON public.investor_reports;
CREATE POLICY "investor_reports_select" ON public.investor_reports
FOR SELECT TO authenticated
USING (public.is_active_investor() OR public.is_admin_user());

-- investor_updates
DROP POLICY IF EXISTS "investor_updates_select" ON public.investor_updates;
CREATE POLICY "investor_updates_select" ON public.investor_updates
FOR SELECT TO authenticated
USING (
  (is_published = true AND public.is_active_investor())
  OR public.is_admin_user()
);

-- hotline_settings — a private number, so it goes when access goes
DROP POLICY IF EXISTS "hotline_settings_select" ON public.hotline_settings;
CREATE POLICY "hotline_settings_select" ON public.hotline_settings
FOR SELECT TO authenticated
USING (public.is_active_investor() OR public.is_admin_user());

-- welcome_kit
DROP POLICY IF EXISTS "welcome_kit_select" ON public.welcome_kit;
CREATE POLICY "welcome_kit_select" ON public.welcome_kit
FOR SELECT TO authenticated
USING (public.is_active_investor() OR public.is_admin_user());

-- beneficiary_audit
DROP POLICY IF EXISTS "beneficiary_audit_select_own" ON public.beneficiary_audit;
CREATE POLICY "beneficiary_audit_select_own" ON public.beneficiary_audit
FOR SELECT TO authenticated
USING (
  (investor_id = public.get_my_investor_id() AND public.is_active_investor())
  OR public.is_admin_user()
);

-- phase2_transactions
DROP POLICY IF EXISTS "phase2_select_own" ON public.phase2_transactions;
CREATE POLICY "phase2_select_own" ON public.phase2_transactions
FOR SELECT TO authenticated
USING (
  (investor_id = public.get_my_investor_id() AND public.is_active_investor())
  OR public.is_admin_user()
);

-- ------------------------------------------------------------
-- Private document storage
-- ------------------------------------------------------------
-- SELECT here is what decides whether a signed URL can be minted at all, so
-- gating it stops a blocked investor pulling files they still hold links for.
DROP POLICY IF EXISTS "investor_docs_read_own" ON storage.objects;
CREATE POLICY "investor_docs_read_own" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'investor-documents'
  AND public.is_active_investor()
  AND (
    (storage.foldername(name))[1] = 'global'
    OR (storage.foldername(name))[1] = public.get_my_investor_id()::TEXT
  )
);

-- ------------------------------------------------------------
-- Realtime
-- ------------------------------------------------------------
-- AuthContext listens for changes to the signed-in user's investors row so an
-- open tab signs itself out the moment it is deactivated. That only works if
-- the table is actually published, which no migration had set up.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'investors'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.investors;
  END IF;
EXCEPTION
  -- A self-hosted database without the Supabase publication still works; the
  -- polling fallback in the client covers it.
  WHEN undefined_object THEN NULL;
END $$;

-- FULL so the row-level filter (user_id=eq.…) matches on UPDATE, which
-- otherwise only carries the primary key in the old record.
ALTER TABLE public.investors REPLICA IDENTITY FULL;
