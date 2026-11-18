-- ============================================================
-- Move the additional-purchase archive into the `archive` schema
-- ============================================================
--
-- 20261119120000 wrote its two archive tables into `public`, where PostgREST
-- publishes an endpoint for every table. Row-level security and a REVOKE kept
-- them unreadable (the API answers 401), but the earlier removals in this
-- project - archive.stake_transactions_removed_20260828 and _20260922 - put
-- their archives in a schema PostgREST is never told about. That is the better
-- place for investor money, and it is the convention already in use here, so
-- these two tables follow it.
--
-- Table contents and row ids are untouched; only the schema and one name
-- change. The ledger itself is not read or written by this migration.
--
--   public.stake_transactions_archived_20261119
--     -> archive.stake_transactions_removed_20261119   (20 deleted rows)
--   public.opening_rows_before_merge_20261119
--     -> archive.opening_rows_before_merge_20261119    (12 pre-merge rows)
--
-- HOW TO UNDO THE MERGE, from the new location. This replaces the instructions
-- in 20261119120000, which name the old `public` tables:
--
--   BEGIN;
--   UPDATE public.stake_transactions t
--   SET number_of_stakes = b.number_of_stakes,
--       price_per_stake  = b.price_per_stake,
--       gross_amount     = b.gross_amount,
--       notes            = b.notes
--   FROM archive.opening_rows_before_merge_20261119 b WHERE t.id = b.id;
--
--   INSERT INTO public.stake_transactions
--   SELECT * FROM archive.stake_transactions_removed_20261119;
--   COMMIT;
--
-- The recalculate_ownership_on_transaction trigger restores every derived
-- figure on the investors table by itself.
-- ============================================================

CREATE SCHEMA IF NOT EXISTS archive;
REVOKE ALL ON SCHEMA archive FROM PUBLIC;

DO $$
BEGIN
  -- Guarded so this cannot fail on a database without the Supabase roles.
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    EXECUTE 'REVOKE ALL ON SCHEMA archive FROM anon';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    EXECUTE 'REVOKE ALL ON SCHEMA archive FROM authenticated';
  END IF;

  -- IF EXISTS throughout: on a database where 20261119120000 found nothing to
  -- merge, neither table was created and there is nothing to move.
  IF EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'stake_transactions_archived_20261119'
  ) THEN
    ALTER TABLE public.stake_transactions_archived_20261119 SET SCHEMA archive;
    -- Named to match its siblings, archive.stake_transactions_removed_*.
    ALTER TABLE archive.stake_transactions_archived_20261119
      RENAME TO stake_transactions_removed_20261119;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'opening_rows_before_merge_20261119'
  ) THEN
    ALTER TABLE public.opening_rows_before_merge_20261119 SET SCHEMA archive;
  END IF;

  -- Nothing may be left behind in public, where the API could see it.
  IF EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename IN ('stake_transactions_archived_20261119',
                        'opening_rows_before_merge_20261119')
  ) THEN
    RAISE EXCEPTION 'Rolled back - an archive table is still in the public schema.';
  END IF;
END;
$$;
