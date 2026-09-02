-- ============================================================
-- Portal settings, and a maintenance mode that actually holds
-- ============================================================
--
-- The admin Settings page had a Portal Config tab with a Maintenance Mode
-- toggle, but the whole tab was cosmetic: the values lived in React state
-- seeded from hardcoded defaults, "Save" only wrote an audit-log entry, and
-- nothing ever read any of it. Flipping the toggle changed nothing, and the
-- setting did not survive a page refresh. This gives the tab somewhere to live.

CREATE TABLE IF NOT EXISTS public.portal_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_name TEXT NOT NULL DEFAULT 'Chew Network Investor Back Office',
  support_email TEXT NOT NULL DEFAULT 'investors@chewnetwork.com',
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  maintenance_message TEXT NOT NULL DEFAULT
    'The investor portal is temporarily unavailable while we carry out scheduled maintenance. Please check back shortly.',
  allow_new_registrations BOOLEAN NOT NULL DEFAULT false,
  updated_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  -- One row, enforced by the database rather than by convention: a second row
  -- would leave "is the portal down?" with two possible answers.
  singleton BOOLEAN NOT NULL DEFAULT true UNIQUE CHECK (singleton)
);

ALTER TABLE public.portal_settings ENABLE ROW LEVEL SECURITY;

-- Readable by anyone, signed in or not. The maintenance page has to render for
-- a visitor who never got as far as authenticating, and none of these fields
-- are sensitive — the portal's own name and support address.
DROP POLICY IF EXISTS "portal_settings_select" ON public.portal_settings;
CREATE POLICY "portal_settings_select" ON public.portal_settings
FOR SELECT TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "portal_settings_admin_all" ON public.portal_settings;
CREATE POLICY "portal_settings_admin_all" ON public.portal_settings
FOR ALL TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

INSERT INTO public.portal_settings (portal_name, support_email)
SELECT 'Chew Network Investor Back Office', 'investors@chewnetwork.com'
WHERE NOT EXISTS (SELECT 1 FROM public.portal_settings);

-- So an investor with the portal already open is moved to the maintenance page
-- when the toggle flips, rather than on their next navigation.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'portal_settings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.portal_settings;
  END IF;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;
