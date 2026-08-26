-- ============================================================
-- CHEW NETWORK INVESTOR BACK OFFICE — FULL SCHEMA MIGRATION
-- ============================================================

-- ============================================================
-- 1. ENUMS / TYPES
-- ============================================================

DROP TYPE IF EXISTS public.investor_account_status CASCADE;
CREATE TYPE public.investor_account_status AS ENUM ('active', 'inactive', 'suspended', 'pending');

DROP TYPE IF EXISTS public.transaction_type CASCADE;
CREATE TYPE public.transaction_type AS ENUM (
  'purchase',
  'additional_purchase',
  'transfer_in',
  'transfer_out',
  'company_repurchase',
  'redemption',
  'adjustment'
);

DROP TYPE IF EXISTS public.document_type CASCADE;
CREATE TYPE public.document_type AS ENUM (
  'signed_agreement',
  'investment_certificate',
  'welcome_kit',
  'payment_receipt',
  'ownership_document',
  'quarterly_report',
  'transaction_document',
  'beneficiary_document',
  'other'
);

DROP TYPE IF EXISTS public.document_visibility CASCADE;
CREATE TYPE public.document_visibility AS ENUM ('investor', 'admin', 'all');

DROP TYPE IF EXISTS public.report_audience CASCADE;
CREATE TYPE public.report_audience AS ENUM ('all_investors', 'phase_1', 'phase_2', 'selected');

DROP TYPE IF EXISTS public.update_category CASCADE;
CREATE TYPE public.update_category AS ENUM (
  'see_it_cook_it',
  'chef_pepe',
  'technology',
  'company',
  'creators',
  'restaurants',
  'milestones',
  'phase_2',
  'general'
);

DROP TYPE IF EXISTS public.app_role CASCADE;
CREATE TYPE public.app_role AS ENUM ('investor', 'admin', 'super_admin');

DROP TYPE IF EXISTS public.creator_brand_approach CASCADE;
CREATE TYPE public.creator_brand_approach AS ENUM ('behind_the_scenes', 'you_are_the_brand');

-- ============================================================
-- 2. CORE TABLES
-- ============================================================

-- Investors table (extends auth.users via user_id)
CREATE TABLE IF NOT EXISTS public.investors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  investor_id TEXT NOT NULL UNIQUE,
  certificate_number TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  account_status public.investor_account_status DEFAULT 'active',
  join_date DATE DEFAULT CURRENT_DATE,
  round TEXT DEFAULT 'Phase 1',
  original_investment NUMERIC(15,2) DEFAULT 0,
  original_stake_price NUMERIC(15,8) DEFAULT 0.01,
  original_stakes_purchased BIGINT DEFAULT 0,
  additional_stakes_purchased BIGINT DEFAULT 0,
  current_stakes_owned BIGINT DEFAULT 0,
  stakes_sold BIGINT DEFAULT 0,
  stakes_transferred BIGINT DEFAULT 0,
  stakes_repurchased BIGINT DEFAULT 0,
  ownership_percentage NUMERIC(20,10) DEFAULT 0,
  beneficiary_name TEXT,
  beneficiary_relationship TEXT,
  beneficiary_email TEXT,
  beneficiary_phone TEXT,
  beneficiary_address TEXT,
  beneficiary_updated_at TIMESTAMPTZ,
  creator_program_status BOOLEAN DEFAULT false,
  creator_brand_approach public.creator_brand_approach,
  creator_website_status TEXT,
  creator_affiliate_status TEXT,
  creator_ai_content_status TEXT,
  creator_social_platforms INT DEFAULT 0,
  creator_90day_start DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Stake transactions ledger
CREATE TABLE IF NOT EXISTS public.stake_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID NOT NULL REFERENCES public.investors(id) ON DELETE CASCADE,
  transaction_type public.transaction_type NOT NULL,
  number_of_stakes BIGINT NOT NULL,
  price_per_stake NUMERIC(15,8) DEFAULT 0,
  gross_amount NUMERIC(15,2) DEFAULT 0,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  round TEXT DEFAULT 'Phase 1',
  notes TEXT,
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Documents vault
CREATE TABLE IF NOT EXISTS public.investor_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID REFERENCES public.investors(id) ON DELETE CASCADE,
  document_type public.document_type NOT NULL,
  document_title TEXT NOT NULL,
  file_url TEXT,
  upload_date DATE DEFAULT CURRENT_DATE,
  uploaded_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  visibility public.document_visibility DEFAULT 'investor',
  is_global BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Investor reports
CREATE TABLE IF NOT EXISTS public.investor_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  quarter TEXT,
  year INT,
  file_url TEXT,
  date_published DATE DEFAULT CURRENT_DATE,
  audience public.report_audience DEFAULT 'all_investors',
  published_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Investor updates (newsfeed)
CREATE TABLE IF NOT EXISTS public.investor_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  thumbnail_url TEXT,
  short_description TEXT,
  full_content TEXT,
  category public.update_category DEFAULT 'general',
  publish_date DATE DEFAULT CURRENT_DATE,
  published_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  audience public.report_audience DEFAULT 'all_investors',
  send_sms BOOLEAN DEFAULT false,
  send_email BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Hotline settings
CREATE TABLE IF NOT EXISTS public.hotline_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL,
  hours TEXT NOT NULL,
  updated_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Welcome kit
CREATE TABLE IF NOT EXISTS public.welcome_kit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_url TEXT NOT NULL,
  title TEXT DEFAULT 'Founder''s Welcome Kit',
  updated_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Beneficiary audit log
CREATE TABLE IF NOT EXISTS public.beneficiary_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID NOT NULL REFERENCES public.investors(id) ON DELETE CASCADE,
  changed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  old_beneficiary_name TEXT,
  old_beneficiary_relationship TEXT,
  old_beneficiary_email TEXT,
  old_beneficiary_phone TEXT,
  old_beneficiary_address TEXT,
  new_beneficiary_name TEXT,
  new_beneficiary_relationship TEXT,
  new_beneficiary_email TEXT,
  new_beneficiary_phone TEXT,
  new_beneficiary_address TEXT,
  changed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs (admin actions)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  investor_id UUID REFERENCES public.investors(id) ON DELETE SET NULL,
  old_value JSONB,
  new_value JSONB,
  ip_address TEXT,
  session_info TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Phase 2 preparation table
CREATE TABLE IF NOT EXISTS public.phase2_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID NOT NULL REFERENCES public.investors(id) ON DELETE CASCADE,
  eligible_stakes BIGINT DEFAULT 0,
  stakes_offered_for_repurchase BIGINT DEFAULT 0,
  stakes_repurchased BIGINT DEFAULT 0,
  repurchase_price NUMERIC(15,8) DEFAULT 0,
  gross_transaction_amount NUMERIC(15,2) DEFAULT 0,
  transaction_date DATE,
  remaining_stakes BIGINT DEFAULT 0,
  updated_ownership_percentage NUMERIC(20,10) DEFAULT 0,
  transaction_documents TEXT,
  status TEXT DEFAULT 'not_open',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_investors_user_id ON public.investors(user_id);
CREATE INDEX IF NOT EXISTS idx_investors_investor_id ON public.investors(investor_id);
CREATE INDEX IF NOT EXISTS idx_investors_email ON public.investors(email);
CREATE INDEX IF NOT EXISTS idx_stake_transactions_investor_id ON public.stake_transactions(investor_id);
CREATE INDEX IF NOT EXISTS idx_stake_transactions_date ON public.stake_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_investor_documents_investor_id ON public.investor_documents(investor_id);
CREATE INDEX IF NOT EXISTS idx_investor_updates_publish_date ON public.investor_updates(publish_date);
CREATE INDEX IF NOT EXISTS idx_audit_logs_investor_id ON public.audit_logs(investor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- ============================================================
-- 4. SEQUENCES FOR AUTO-GENERATED IDs
-- ============================================================

CREATE SEQUENCE IF NOT EXISTS public.investor_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS public.certificate_seq START 1;

-- ============================================================
-- 5. FUNCTIONS
-- ============================================================

-- Generate investor ID like CN-000001
CREATE OR REPLACE FUNCTION public.generate_investor_id()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  next_val BIGINT;
BEGIN
  next_val := nextval('public.investor_id_seq');
  RETURN 'CN-' || LPAD(next_val::TEXT, 6, '0');
END;
$$;

-- Generate certificate number like CERT-CN-000001
CREATE OR REPLACE FUNCTION public.generate_certificate_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  next_val BIGINT;
BEGIN
  next_val := nextval('public.certificate_seq');
  RETURN 'CERT-CN-' || LPAD(next_val::TEXT, 6, '0');
END;
$$;

-- Recalculate ownership percentage
CREATE OR REPLACE FUNCTION public.recalculate_ownership(p_investor_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_purchases BIGINT := 0;
  v_additional BIGINT := 0;
  v_transfers_in BIGINT := 0;
  v_transfers_out BIGINT := 0;
  v_repurchases BIGINT := 0;
  v_redemptions BIGINT := 0;
  v_current_stakes BIGINT := 0;
  v_ownership NUMERIC(20,10) := 0;
BEGIN
  SELECT
    COALESCE(SUM(CASE WHEN transaction_type = 'purchase' THEN number_of_stakes ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN transaction_type = 'additional_purchase' THEN number_of_stakes ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN transaction_type = 'transfer_in' THEN number_of_stakes ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN transaction_type = 'transfer_out' THEN number_of_stakes ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN transaction_type = 'company_repurchase' THEN number_of_stakes ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN transaction_type = 'redemption' THEN number_of_stakes ELSE 0 END), 0)
  INTO v_purchases, v_additional, v_transfers_in, v_transfers_out, v_repurchases, v_redemptions
  FROM public.stake_transactions
  WHERE investor_id = p_investor_id;

  v_current_stakes := v_purchases + v_additional + v_transfers_in - v_transfers_out - v_repurchases - v_redemptions;
  IF v_current_stakes < 0 THEN v_current_stakes := 0; END IF;

  v_ownership := (v_current_stakes::NUMERIC / 800000000.0) * 5.0;

  UPDATE public.investors SET
    original_stakes_purchased = v_purchases,
    additional_stakes_purchased = v_additional,
    stakes_sold = v_transfers_out,
    stakes_transferred = v_transfers_out,
    stakes_repurchased = v_repurchases,
    current_stakes_owned = v_current_stakes,
    ownership_percentage = v_ownership,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = p_investor_id;
END;
$$;

-- Trigger function to recalculate on transaction insert/update/delete
CREATE OR REPLACE FUNCTION public.trigger_recalculate_ownership()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.recalculate_ownership(OLD.investor_id);
    RETURN OLD;
  ELSE
    PERFORM public.recalculate_ownership(NEW.investor_id);
    RETURN NEW;
  END IF;
END;
$$;

-- Admin check function (uses auth metadata to avoid recursion)
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
  SELECT 1 FROM auth.users au
  WHERE au.id = auth.uid()
  AND (
    au.raw_user_meta_data->>'role' = 'admin'
    OR au.raw_user_meta_data->>'role' = 'super_admin'
    OR au.raw_app_meta_data->>'role' = 'admin'
    OR au.raw_app_meta_data->>'role' = 'super_admin'
  )
)
$$;

-- Get investor id for current user
CREATE OR REPLACE FUNCTION public.get_my_investor_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT id FROM public.investors WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Handle new user trigger (creates user_profiles)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- ============================================================
-- 6. ENABLE RLS
-- ============================================================

ALTER TABLE public.investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stake_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotline_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.welcome_kit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beneficiary_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phase2_transactions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 7. RLS POLICIES
-- ============================================================

-- investors: investor sees own, admin sees all
DROP POLICY IF EXISTS "investors_select_own" ON public.investors;
CREATE POLICY "investors_select_own" ON public.investors
FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_admin_user());

DROP POLICY IF EXISTS "investors_admin_all" ON public.investors;
CREATE POLICY "investors_admin_all" ON public.investors
FOR ALL TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- stake_transactions: investor sees own, admin sees all
DROP POLICY IF EXISTS "stake_transactions_select_own" ON public.stake_transactions;
CREATE POLICY "stake_transactions_select_own" ON public.stake_transactions
FOR SELECT TO authenticated
USING (investor_id = public.get_my_investor_id() OR public.is_admin_user());

DROP POLICY IF EXISTS "stake_transactions_admin_all" ON public.stake_transactions;
CREATE POLICY "stake_transactions_admin_all" ON public.stake_transactions
FOR ALL TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- investor_documents: investor sees own or global, admin sees all
DROP POLICY IF EXISTS "investor_documents_select_own" ON public.investor_documents;
CREATE POLICY "investor_documents_select_own" ON public.investor_documents
FOR SELECT TO authenticated
USING (
  investor_id = public.get_my_investor_id()
  OR is_global = true
  OR public.is_admin_user()
);

DROP POLICY IF EXISTS "investor_documents_admin_all" ON public.investor_documents;
CREATE POLICY "investor_documents_admin_all" ON public.investor_documents
FOR ALL TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- investor_reports: all investors can read published
DROP POLICY IF EXISTS "investor_reports_select" ON public.investor_reports;
CREATE POLICY "investor_reports_select" ON public.investor_reports
FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "investor_reports_admin_all" ON public.investor_reports;
CREATE POLICY "investor_reports_admin_all" ON public.investor_reports
FOR ALL TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- investor_updates: all investors can read published
DROP POLICY IF EXISTS "investor_updates_select" ON public.investor_updates;
CREATE POLICY "investor_updates_select" ON public.investor_updates
FOR SELECT TO authenticated
USING (is_published = true OR public.is_admin_user());

DROP POLICY IF EXISTS "investor_updates_admin_all" ON public.investor_updates;
CREATE POLICY "investor_updates_admin_all" ON public.investor_updates
FOR ALL TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- hotline_settings: all investors can read
DROP POLICY IF EXISTS "hotline_settings_select" ON public.hotline_settings;
CREATE POLICY "hotline_settings_select" ON public.hotline_settings
FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "hotline_settings_admin_all" ON public.hotline_settings;
CREATE POLICY "hotline_settings_admin_all" ON public.hotline_settings
FOR ALL TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- welcome_kit: all investors can read
DROP POLICY IF EXISTS "welcome_kit_select" ON public.welcome_kit;
CREATE POLICY "welcome_kit_select" ON public.welcome_kit
FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "welcome_kit_admin_all" ON public.welcome_kit;
CREATE POLICY "welcome_kit_admin_all" ON public.welcome_kit
FOR ALL TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- beneficiary_audit: investor sees own, admin sees all
DROP POLICY IF EXISTS "beneficiary_audit_select_own" ON public.beneficiary_audit;
CREATE POLICY "beneficiary_audit_select_own" ON public.beneficiary_audit
FOR SELECT TO authenticated
USING (investor_id = public.get_my_investor_id() OR public.is_admin_user());

DROP POLICY IF EXISTS "beneficiary_audit_admin_all" ON public.beneficiary_audit;
CREATE POLICY "beneficiary_audit_admin_all" ON public.beneficiary_audit
FOR ALL TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- audit_logs: admin only
DROP POLICY IF EXISTS "audit_logs_admin_all" ON public.audit_logs;
CREATE POLICY "audit_logs_admin_all" ON public.audit_logs
FOR ALL TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- phase2_transactions: investor sees own, admin sees all
DROP POLICY IF EXISTS "phase2_select_own" ON public.phase2_transactions;
CREATE POLICY "phase2_select_own" ON public.phase2_transactions
FOR SELECT TO authenticated
USING (investor_id = public.get_my_investor_id() OR public.is_admin_user());

DROP POLICY IF EXISTS "phase2_admin_all" ON public.phase2_transactions;
CREATE POLICY "phase2_admin_all" ON public.phase2_transactions
FOR ALL TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- ============================================================
-- 8. TRIGGERS
-- ============================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS recalculate_ownership_on_transaction ON public.stake_transactions;
CREATE TRIGGER recalculate_ownership_on_transaction
  AFTER INSERT OR UPDATE OR DELETE ON public.stake_transactions
  FOR EACH ROW EXECUTE FUNCTION public.trigger_recalculate_ownership();

-- ============================================================
-- 9. SEED DATA
-- ============================================================

DO $$
DECLARE
  admin_uuid UUID := gen_random_uuid();
  inv1_uuid UUID := gen_random_uuid();
  inv2_uuid UUID := gen_random_uuid();
  inv3_uuid UUID := gen_random_uuid();
  inv1_profile_uuid UUID := gen_random_uuid();
  inv2_profile_uuid UUID := gen_random_uuid();
  inv3_profile_uuid UUID := gen_random_uuid();
  admin_profile_uuid UUID := gen_random_uuid();
BEGIN
  -- Create admin auth user
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
    is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
    recovery_token, recovery_sent_at, email_change_token_new, email_change,
    email_change_sent_at, email_change_token_current, email_change_confirm_status,
    reauthentication_token, reauthentication_sent_at, phone, phone_change,
    phone_change_token, phone_change_sent_at
  ) VALUES (
    admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'admin@chewnetwork.com', crypt('ChewAdmin2026!', gen_salt('bf', 10)), now(), now(), now(),
    jsonb_build_object('full_name', 'Chew Admin', 'role', 'admin'),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[], 'role', 'admin'),
    false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
  ) ON CONFLICT (id) DO NOTHING;

  -- Create investor 1 auth user
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
    is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
    recovery_token, recovery_sent_at, email_change_token_new, email_change,
    email_change_sent_at, email_change_token_current, email_change_confirm_status,
    reauthentication_token, reauthentication_sent_at, phone, phone_change,
    phone_change_token, phone_change_sent_at
  ) VALUES (
    inv1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'investor1@chewnetwork.com', crypt('Investor2026!', gen_salt('bf', 10)), now(), now(), now(),
    jsonb_build_object('full_name', 'Alex Rivera', 'role', 'investor'),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
    false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
  ) ON CONFLICT (id) DO NOTHING;

  -- Create investor 2 auth user
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
    is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
    recovery_token, recovery_sent_at, email_change_token_new, email_change,
    email_change_sent_at, email_change_token_current, email_change_confirm_status,
    reauthentication_token, reauthentication_sent_at, phone, phone_change,
    phone_change_token, phone_change_sent_at
  ) VALUES (
    inv2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'investor2@chewnetwork.com', crypt('Investor2026!', gen_salt('bf', 10)), now(), now(), now(),
    jsonb_build_object('full_name', 'Jordan Kim', 'role', 'investor'),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
    false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
  ) ON CONFLICT (id) DO NOTHING;

  -- Create investor 3 auth user
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
    is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
    recovery_token, recovery_sent_at, email_change_token_new, email_change,
    email_change_sent_at, email_change_token_current, email_change_confirm_status,
    reauthentication_token, reauthentication_sent_at, phone, phone_change,
    phone_change_token, phone_change_sent_at
  ) VALUES (
    inv3_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'investor3@chewnetwork.com', crypt('Investor2026!', gen_salt('bf', 10)), now(), now(), now(),
    jsonb_build_object('full_name', 'Morgan Chen', 'role', 'investor'),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
    false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
  ) ON CONFLICT (id) DO NOTHING;

  -- Get profile IDs created by trigger (or create them if trigger hasn't run)
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (admin_uuid, 'admin@chewnetwork.com', 'Chew Admin')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (inv1_uuid, 'investor1@chewnetwork.com', 'Alex Rivera')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (inv2_uuid, 'investor2@chewnetwork.com', 'Jordan Kim')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (inv3_uuid, 'investor3@chewnetwork.com', 'Morgan Chen')
  ON CONFLICT (id) DO NOTHING;

  -- Advance sequences so first 3 investors get CN-000001, CN-000002, CN-000003
  PERFORM nextval('public.investor_id_seq') FROM generate_series(1,3);
  PERFORM nextval('public.certificate_seq') FROM generate_series(1,3);

  -- Create investor records
  INSERT INTO public.investors (
    id, user_id, investor_id, certificate_number,
    first_name, last_name, email, phone,
    account_status, join_date, round,
    original_investment, original_stake_price,
    original_stakes_purchased, current_stakes_owned,
    ownership_percentage
  ) VALUES
  (
    inv1_profile_uuid, inv1_uuid, 'CN-000001', 'CERT-CN-000001',
    'Alex', 'Rivera', 'investor1@chewnetwork.com', '+1-555-0101',
    'active', '2026-05-20', 'Phase 1',
    500.00, 0.01, 50000, 50000,
    (50000.0 / 800000000.0) * 5.0
  ),
  (
    inv2_profile_uuid, inv2_uuid, 'CN-000002', 'CERT-CN-000002',
    'Jordan', 'Kim', 'investor2@chewnetwork.com', '+1-555-0102',
    'active', '2026-05-20', 'Phase 1',
    1000.00, 0.01, 100000, 100000,
    (100000.0 / 800000000.0) * 5.0
  ),
  (
    inv3_profile_uuid, inv3_uuid, 'CN-000003', 'CERT-CN-000003',
    'Morgan', 'Chen', 'investor3@chewnetwork.com', '+1-555-0103',
    'active', '2026-05-20', 'Phase 1',
    250.00, 0.01, 25000, 25000,
    (25000.0 / 800000000.0) * 5.0
  )
  ON CONFLICT (investor_id) DO NOTHING;

  -- Seed stake transactions for investor 1
  INSERT INTO public.stake_transactions (
    investor_id, transaction_type, number_of_stakes, price_per_stake, gross_amount, transaction_date, round, notes
  )
  SELECT inv1_profile_uuid, 'purchase', 50000, 0.01, 500.00, '2026-05-20', 'Phase 1', 'Initial investment — Phase 1'
  WHERE EXISTS (SELECT 1 FROM public.investors WHERE id = inv1_profile_uuid)
  ON CONFLICT DO NOTHING;

  -- Seed stake transactions for investor 2
  INSERT INTO public.stake_transactions (
    investor_id, transaction_type, number_of_stakes, price_per_stake, gross_amount, transaction_date, round, notes
  )
  SELECT inv2_profile_uuid, 'purchase', 100000, 0.01, 1000.00, '2026-05-20', 'Phase 1', 'Initial investment — Phase 1'
  WHERE EXISTS (SELECT 1 FROM public.investors WHERE id = inv2_profile_uuid)
  ON CONFLICT DO NOTHING;

  -- Seed stake transactions for investor 3
  INSERT INTO public.stake_transactions (
    investor_id, transaction_type, number_of_stakes, price_per_stake, gross_amount, transaction_date, round, notes
  )
  SELECT inv3_profile_uuid, 'purchase', 25000, 0.01, 250.00, '2026-05-20', 'Phase 1', 'Initial investment — Phase 1'
  WHERE EXISTS (SELECT 1 FROM public.investors WHERE id = inv3_profile_uuid)
  ON CONFLICT DO NOTHING;

  -- Seed hotline settings
  INSERT INTO public.hotline_settings (phone_number, hours)
  VALUES ('+1-800-CHEW-NET', 'Monday – Friday, 9:00 AM – 6:00 PM EST')
  ON CONFLICT DO NOTHING;

  -- Seed welcome kit placeholder
  INSERT INTO public.welcome_kit (file_url, title)
  VALUES ('https://chewnetwork.com/welcome-kit.pdf', 'Founder''s Welcome Kit — Chew Network')
  ON CONFLICT DO NOTHING;

  -- Seed investor reports
  INSERT INTO public.investor_reports (title, quarter, year, file_url, date_published, audience)
  VALUES
    ('Q2 2026 Investor Report', 'Q2', 2026, 'https://chewnetwork.com/reports/q2-2026.pdf', '2026-07-15', 'all_investors'),
    ('Q3 2026 Investor Report', 'Q3', 2026, 'https://chewnetwork.com/reports/q3-2026.pdf', '2026-10-15', 'all_investors')
  ON CONFLICT DO NOTHING;

  -- Seed investor updates
  INSERT INTO public.investor_updates (title, short_description, full_content, category, publish_date, audience, is_published)
  VALUES
    (
      'See It. Cook It. Development Update',
      'New application milestone completed. The Chew Network platform has reached a major development milestone.',
      'We are thrilled to announce that the Chew Network platform has reached a major development milestone. Our engineering team has completed the core infrastructure for the See It. Cook It. feature set, enabling creators to publish step-by-step cooking content with integrated commerce capabilities.',
      'see_it_cook_it', '2026-05-20', 'all_investors', true
    ),
    (
      'Chef Pepe Partnership Announcement',
      'Chef Pepe officially joins Chew Network as our founding culinary ambassador.',
      'We are proud to announce that Chef Pepe has officially joined Chew Network as our founding culinary ambassador. This partnership marks a significant milestone in our mission to connect food creators with their communities.',
      'chef_pepe', '2026-06-01', 'all_investors', true
    ),
    (
      'Phase 1 Investor Update — Company Milestone',
      'Chew Network reaches 3 founding investors and begins platform development.',
      'Chew Network has officially welcomed its first three founding investors. This marks the beginning of Phase 1 of our investor program. All founding investors will receive their official Ecosystem Stake certificates and access to the Investor Back Office.',
      'milestones', '2026-05-25', 'phase_1', true
    )
  ON CONFLICT DO NOTHING;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Seed data error: %', SQLERRM;
END $$;
