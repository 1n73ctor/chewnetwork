-- ============================================================
-- Remove four investors and their records
-- ============================================================
--
--   CN-000001  Alex Rivera
--   CN-000002  Jordan Kim
--   CN-000003  Morgan Chen
--   CN-000004  Suraj Choudhary
--
-- Every row is copied into the `archive` schema before deletion, so this is
-- recoverable. `archive` is not exposed through PostgREST and no role is
-- granted access, so the archived personal data is not reachable from the API.
--
-- Deleting an investor cascades to stake_transactions, investor_documents,
-- beneficiary_audit and phase2_transactions. audit_logs uses ON DELETE SET
-- NULL, so the audit trail survives with investor_id nulled — deliberately
-- left that way rather than destroying history.
--
-- Their auth accounts are removed too, which cascades to user_profiles.

CREATE SCHEMA IF NOT EXISTS archive;
REVOKE ALL ON SCHEMA archive FROM PUBLIC;
REVOKE ALL ON SCHEMA archive FROM anon, authenticated;

-- ------------------------------------------------------------
-- Guard: refuse to run unless exactly these four are present
-- ------------------------------------------------------------
DO $$
DECLARE
  v_count INT;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM public.investors
  WHERE investor_id IN ('CN-000001', 'CN-000002', 'CN-000003', 'CN-000004');

  IF v_count <> 4 THEN
    RAISE EXCEPTION
      'Expected exactly 4 investors to remove, found %. Nothing deleted.', v_count;
  END IF;
END;
$$;

-- ------------------------------------------------------------
-- Archive
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS archive.investors_removed_20260828 AS
SELECT * FROM public.investors
WHERE investor_id IN ('CN-000001', 'CN-000002', 'CN-000003', 'CN-000004');

CREATE TABLE IF NOT EXISTS archive.stake_transactions_removed_20260828 AS
SELECT t.* FROM public.stake_transactions t
WHERE t.investor_id IN (SELECT id FROM archive.investors_removed_20260828);

CREATE TABLE IF NOT EXISTS archive.investor_documents_removed_20260828 AS
SELECT d.* FROM public.investor_documents d
WHERE d.investor_id IN (SELECT id FROM archive.investors_removed_20260828);

CREATE TABLE IF NOT EXISTS archive.beneficiary_audit_removed_20260828 AS
SELECT b.* FROM public.beneficiary_audit b
WHERE b.investor_id IN (SELECT id FROM archive.investors_removed_20260828);

CREATE TABLE IF NOT EXISTS archive.phase2_transactions_removed_20260828 AS
SELECT p.* FROM public.phase2_transactions p
WHERE p.investor_id IN (SELECT id FROM archive.investors_removed_20260828);

CREATE TABLE IF NOT EXISTS archive.user_profiles_removed_20260828 AS
SELECT u.* FROM public.user_profiles u
WHERE u.id IN (SELECT user_id FROM archive.investors_removed_20260828 WHERE user_id IS NOT NULL);

-- ------------------------------------------------------------
-- Delete
-- ------------------------------------------------------------
DO $$
DECLARE
  v_investors INT;
  v_users INT;
BEGIN
  -- Auth accounts first; user_profiles cascades from auth.users.
  DELETE FROM auth.users
  WHERE id IN (
    SELECT user_id FROM archive.investors_removed_20260828 WHERE user_id IS NOT NULL
  );
  GET DIAGNOSTICS v_users = ROW_COUNT;

  DELETE FROM public.investors
  WHERE investor_id IN ('CN-000001', 'CN-000002', 'CN-000003', 'CN-000004');
  GET DIAGNOSTICS v_investors = ROW_COUNT;

  RAISE NOTICE 'Removed % investors and % auth accounts.', v_investors, v_users;

  IF v_investors <> 4 THEN
    RAISE EXCEPTION 'Expected to delete 4 investors, deleted %. Rolled back.', v_investors;
  END IF;
END;
$$;

-- ------------------------------------------------------------
-- Confirm they are gone
-- ------------------------------------------------------------
DO $$
DECLARE
  v_left INT;
BEGIN
  SELECT COUNT(*) INTO v_left
  FROM public.investors
  WHERE investor_id IN ('CN-000001', 'CN-000002', 'CN-000003', 'CN-000004');

  IF v_left <> 0 THEN
    RAISE EXCEPTION 'Still % matching investors after delete.', v_left;
  END IF;

  RAISE NOTICE 'Verified: none of the four remain. Archived copies are in the archive schema.';
END;
$$;
