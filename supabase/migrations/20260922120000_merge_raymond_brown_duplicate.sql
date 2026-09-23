-- ============================================================
-- Raymond Brown: remove the duplicate, correct the real record
-- ============================================================
--
-- Two investor records exist for one person:
--
--   CN-000024  njayray@yahoo.co   active    ← the real account, kept
--   CN-000029  nrayjay@yahoo.com  inactive  ← a later duplicate, removed
--
-- CN-000029 was created on 2026-09-21 carrying the correct opening position
-- (500,000 stakes / $5,000) and was then deactivated. CN-000024 still shows the
-- wrong opening (100,000 stakes / $1,000). This removes the duplicate and moves
-- the correct opening onto the account that is kept.
--
-- CN-000024's stored address is "yahoo.co", without the "m" — that is the value
-- in the database, so it is what the guards below match on. It is not changed
-- here.
--
-- Following 20260828140000: every row belonging to CN-000029 is copied into the
-- `archive` schema before deletion, so this is recoverable. Its auth account is
-- removed too, which cascades to user_profiles. audit_logs keeps its history
-- with investor_id nulled (ON DELETE SET NULL).
--
-- Following 20260828150000: the opening is corrected on the ledger row, since
-- recalculate_ownership derives every stake figure and both investment totals
-- from stake_transactions — editing the investors row directly would simply be
-- overwritten. The old figures are kept in the ledger row's note.
--
-- CN-000024's additional purchase (100,000,000 stakes / $10,000, 2026-09-21) is
-- NOT touched. The asserted end state therefore includes it:
--
--   opening      500,000 stakes     $5,000
--   additional   100,000,000 stakes $10,000   (unchanged)
--   TOTAL        100,500,000 stakes $15,000   0.628125%

CREATE SCHEMA IF NOT EXISTS archive;
REVOKE ALL ON SCHEMA archive FROM PUBLIC;
REVOKE ALL ON SCHEMA archive FROM anon, authenticated;

-- ------------------------------------------------------------
-- Guards: refuse to run unless the data is exactly as inspected
-- ------------------------------------------------------------
DO $$
DECLARE
  v_dup_count INT;
  v_keep_count INT;
  v_dup_user UUID;
  v_keep_user UUID;
  v_keep_id UUID;
  v_purchases INT;
BEGIN
  SELECT COUNT(*) INTO v_dup_count
  FROM public.investors
  WHERE investor_id = 'CN-000029' AND LOWER(email) = 'nrayjay@yahoo.com';
  IF v_dup_count <> 1 THEN
    RAISE EXCEPTION 'Expected CN-000029 / nrayjay@yahoo.com exactly once, found %. Nothing changed.', v_dup_count;
  END IF;

  SELECT COUNT(*) INTO v_keep_count
  FROM public.investors
  WHERE investor_id = 'CN-000024' AND LOWER(email) = 'njayray@yahoo.co';
  IF v_keep_count <> 1 THEN
    RAISE EXCEPTION 'Expected CN-000024 / njayray@yahoo.co exactly once, found %. Nothing changed.', v_keep_count;
  END IF;

  SELECT user_id INTO v_dup_user FROM public.investors WHERE investor_id = 'CN-000029';
  SELECT id, user_id INTO v_keep_id, v_keep_user FROM public.investors WHERE investor_id = 'CN-000024';

  -- The auth account about to be deleted must not be the one the kept record
  -- signs in with, or removing the duplicate would lock out the real account.
  IF v_dup_user IS NOT NULL AND v_dup_user IS NOT DISTINCT FROM v_keep_user THEN
    RAISE EXCEPTION 'CN-000029 and CN-000024 share auth account %. Refusing to delete it.', v_dup_user;
  END IF;

  SELECT COUNT(*) INTO v_purchases
  FROM public.stake_transactions
  WHERE investor_id = v_keep_id AND transaction_type = 'purchase';
  IF v_purchases <> 1 THEN
    RAISE EXCEPTION 'Expected exactly 1 opening purchase row on CN-000024, found %. Nothing changed.', v_purchases;
  END IF;
END;
$$;

-- ------------------------------------------------------------
-- Archive CN-000029
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS archive.investors_removed_20260922 AS
SELECT * FROM public.investors WHERE investor_id = 'CN-000029';

CREATE TABLE IF NOT EXISTS archive.stake_transactions_removed_20260922 AS
SELECT t.* FROM public.stake_transactions t
WHERE t.investor_id IN (SELECT id FROM archive.investors_removed_20260922);

CREATE TABLE IF NOT EXISTS archive.investor_documents_removed_20260922 AS
SELECT d.* FROM public.investor_documents d
WHERE d.investor_id IN (SELECT id FROM archive.investors_removed_20260922);

CREATE TABLE IF NOT EXISTS archive.beneficiary_audit_removed_20260922 AS
SELECT b.* FROM public.beneficiary_audit b
WHERE b.investor_id IN (SELECT id FROM archive.investors_removed_20260922);

CREATE TABLE IF NOT EXISTS archive.phase2_transactions_removed_20260922 AS
SELECT p.* FROM public.phase2_transactions p
WHERE p.investor_id IN (SELECT id FROM archive.investors_removed_20260922);

CREATE TABLE IF NOT EXISTS archive.user_profiles_removed_20260922 AS
SELECT u.* FROM public.user_profiles u
WHERE u.id IN (SELECT user_id FROM archive.investors_removed_20260922 WHERE user_id IS NOT NULL);

-- ------------------------------------------------------------
-- Delete CN-000029
-- ------------------------------------------------------------
DO $$
DECLARE
  v_investors INT;
  v_users INT;
BEGIN
  -- Auth account first; user_profiles cascades from auth.users.
  DELETE FROM auth.users
  WHERE id IN (
    SELECT user_id FROM archive.investors_removed_20260922 WHERE user_id IS NOT NULL
  );
  GET DIAGNOSTICS v_users = ROW_COUNT;

  DELETE FROM public.investors WHERE investor_id = 'CN-000029';
  GET DIAGNOSTICS v_investors = ROW_COUNT;

  IF v_investors <> 1 THEN
    RAISE EXCEPTION 'Expected to delete 1 investor, deleted %. Rolled back.', v_investors;
  END IF;

  RAISE NOTICE 'Removed CN-000029 and % auth account(s). Archived in archive.*_removed_20260922.', v_users;
END;
$$;

-- ------------------------------------------------------------
-- Correct CN-000024's opening position
-- ------------------------------------------------------------
DO $$
DECLARE
  v_id UUID;
  v_opening_stakes BIGINT;
  v_additional BIGINT;
  v_current BIGINT;
  v_opening NUMERIC(15,2);
  v_total NUMERIC(15,2);
  v_ownership NUMERIC(20,10);
BEGIN
  SELECT id INTO v_id FROM public.investors WHERE investor_id = 'CN-000024';

  UPDATE public.stake_transactions
  SET number_of_stakes = 500000,
      price_per_stake  = 0.01,
      gross_amount     = 5000,
      notes            = 'Opening position (corrected 2026-09-22: was 100,000 / $1,000)'
  WHERE investor_id = v_id AND transaction_type = 'purchase';

  PERFORM public.recalculate_ownership(v_id);

  SELECT original_stakes_purchased, additional_stakes_purchased, current_stakes_owned,
         original_investment, total_investment, ownership_percentage
  INTO v_opening_stakes, v_additional, v_current, v_opening, v_total, v_ownership
  FROM public.investors WHERE id = v_id;

  IF v_opening_stakes <> 500000 THEN
    RAISE EXCEPTION 'Expected 500,000 opening stakes, got %.', v_opening_stakes;
  END IF;
  IF v_opening <> 5000.00 THEN
    RAISE EXCEPTION 'Expected original_investment 5000.00, got %.', v_opening;
  END IF;
  -- The additional purchase must have come through untouched.
  IF v_additional <> 100000000 THEN
    RAISE EXCEPTION 'Expected 100,000,000 additional stakes (unchanged), got %.', v_additional;
  END IF;
  IF v_current <> 100500000 THEN
    RAISE EXCEPTION 'Expected 100,500,000 current stakes, got %.', v_current;
  END IF;
  IF v_total <> 15000.00 THEN
    RAISE EXCEPTION 'Expected total_investment 15000.00, got %.', v_total;
  END IF;

  RAISE NOTICE 'CN-000024 corrected: opening % stakes / $%, total % stakes / $%, ownership %%%',
    v_opening_stakes, v_opening, v_current, v_total, v_ownership;
END;
$$;
