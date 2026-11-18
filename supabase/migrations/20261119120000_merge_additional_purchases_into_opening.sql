-- ============================================================
-- Remove the old additional-purchase history, for every investor
-- ============================================================
--
-- The Credit Purchase History showed each investor's stake-era
-- "ADDITIONAL PURCHASE" rows alongside their opening purchase. Those rows are
-- folded into the opening row here, so every investor's history reads as one
-- purchase and the additional rows are gone.
--
-- NOTHING IS LOST. For each investor the earliest purchase row absorbs the
-- units and the money, and every merged row is written out in full (date,
-- units, price, gross) in that row's notes before it is deleted.
--
-- Only additional-purchase rows are removed. An investor with two genuine
-- purchase rows keeps both; the additional rows fold into the earlier one.
--
--   before                                  after
--   purchase    150,000 @ $0.0100  $1,500    purchase  500,000 @ $0.0100  $5,000
--   additional  350,000 @ $0.0100  $3,500      notes: "Merged 1 former
--   -------------------------------------              additional purchase:
--   500,000 units            $5,000                    2026-xx-xx 350,000 @
--                                                      $0.01000000 = $3,500.00"
--
-- WHAT THIS MOVES, via the recalculate_ownership_on_transaction trigger:
--
--   current_stakes_owned          unchanged  (purchase + additional, summed)
--   total_investment              unchanged  (gross of purchase + additional)
--   ownership_percentage          unchanged  (derived from current_stakes_owned)
--   original_stakes_purchased     grows      (absorbs the additional units)
--   additional_stakes_purchased   -> 0       (no additional rows remain)
--   original_investment           grows      (gross of purchase rows only, so
--                                             it now equals total_investment)
--
-- The last three are the point of the change, not side effects: with the rows
-- gone there is no "additional" figure left to report. On the portal this means
-- "Additional Credits" reads 0 and "Original Investment" equals "Total
-- Investment" for every investor touched. The first three are asserted
-- identical at the end of this migration, which rolls the whole thing back if
-- a single investor's credits or money moved by a cent.
--
-- Everything runs in one statement, so a failed guard changes nothing.
--
-- HOW TO UNDO THIS
--
-- Two archive tables are written in the same transaction as the change, so the
-- original rows survive with their ids and timestamps intact:
--
--   public.stake_transactions_archived_20261119   every deleted row, in full
--   public.opening_rows_before_merge_20261119     each opening row as it was
--
-- Both have row-level security on and no policy, so the REST API cannot read
-- them; they are reachable only from the SQL editor or a service-role key.
-- To put everything back exactly as it was:
--
--   BEGIN;
--   UPDATE public.stake_transactions t
--   SET number_of_stakes = b.number_of_stakes,
--       price_per_stake  = b.price_per_stake,
--       gross_amount     = b.gross_amount,
--       notes            = b.notes
--   FROM public.opening_rows_before_merge_20261119 b WHERE t.id = b.id;
--
--   INSERT INTO public.stake_transactions
--   SELECT * FROM public.stake_transactions_archived_20261119;
--   COMMIT;
--
-- The recalculate_ownership_on_transaction trigger restores every derived
-- figure on the investors table by itself.
-- ============================================================

DO $$
DECLARE
  v_bad          TEXT;
  v_investors    INT;
  v_rows         INT;
  v_drift        TEXT;
BEGIN
  -- ----------------------------------------------------------
  -- Snapshot the three figures that must not move.
  -- ----------------------------------------------------------
  CREATE TEMP TABLE _before ON COMMIT DROP AS
  SELECT id, current_stakes_owned, total_investment, ownership_percentage
  FROM public.investors;

  -- ----------------------------------------------------------
  -- Guard: an investor with additional rows needs an opening row to merge
  -- into. With none there is no home for the units, so refuse and name them.
  -- ----------------------------------------------------------
  SELECT string_agg(i.email, ', ' ORDER BY i.email) INTO v_bad
  FROM public.investors i
  WHERE i.id IN (
      SELECT investor_id FROM public.stake_transactions
      WHERE transaction_type = 'additional_purchase')
    AND NOT EXISTS (
      SELECT 1 FROM public.stake_transactions t
      WHERE t.investor_id = i.id AND t.transaction_type = 'purchase');

  IF v_bad IS NOT NULL THEN
    RAISE EXCEPTION E'Cannot merge: these investors have additional purchases but no opening purchase row:\n  %\nNothing was changed.', v_bad;
  END IF;

  -- ----------------------------------------------------------
  -- What is about to be merged, per investor.
  -- ----------------------------------------------------------
  CREATE TEMP TABLE _merge ON COMMIT DROP AS
  SELECT
    investor_id,
    COUNT(*)                        AS n_rows,
    SUM(number_of_stakes)           AS units,
    SUM(COALESCE(gross_amount, 0))  AS gross,
    string_agg(
      format('%s %s @ $%s = $%s',
             transaction_date,
             to_char(number_of_stakes, 'FM999,999,999,999'),
             to_char(COALESCE(price_per_stake, 0), 'FM999990.00000000'),
             to_char(COALESCE(gross_amount, 0), 'FM999,999,990.00')),
      '; ' ORDER BY transaction_date, created_at
    )                               AS detail
  FROM public.stake_transactions
  WHERE transaction_type = 'additional_purchase'
  GROUP BY investor_id;

  SELECT COUNT(*), COALESCE(SUM(n_rows), 0) INTO v_investors, v_rows FROM _merge;

  IF v_investors = 0 THEN
    RAISE NOTICE 'No additional-purchase rows anywhere; nothing to do.';
    RETURN;
  END IF;

  -- ----------------------------------------------------------
  -- Which row absorbs the merge: the investor's EARLIEST purchase row. Most
  -- investors have exactly one, but at least one on the live ledger has two
  -- genuine purchase rows, and those are not ours to consolidate - only the
  -- additional-purchase history was asked for. created_at then id break ties
  -- so the choice is deterministic rather than whatever order the scan gives.
  -- ----------------------------------------------------------
  CREATE TEMP TABLE _target ON COMMIT DROP AS
  SELECT DISTINCT ON (t.investor_id)
         t.investor_id, t.id AS row_id, t.number_of_stakes AS units
  FROM public.stake_transactions t
  JOIN _merge m ON m.investor_id = t.investor_id
  WHERE t.transaction_type = 'purchase'
  ORDER BY t.investor_id, t.transaction_date, t.created_at, t.id;

  -- Guard: a zero-unit target row would make the blended price undefined.
  SELECT string_agg(i.email, ', ' ORDER BY i.email) INTO v_bad
  FROM _target tg
  JOIN public.investors i ON i.id = tg.investor_id
  WHERE COALESCE(tg.units, 0) <= 0;

  IF v_bad IS NOT NULL THEN
    RAISE EXCEPTION E'Cannot merge: these investors have an earliest opening row of 0 units:\n  %\nNothing was changed.', v_bad;
  END IF;

  -- ----------------------------------------------------------
  -- Archive, in this same transaction, everything needed to undo the change:
  -- the rows about to be deleted, and the opening rows as they stand now.
  -- See HOW TO UNDO THIS at the top of this file.
  -- ----------------------------------------------------------
  CREATE TABLE public.stake_transactions_archived_20261119 AS
  SELECT * FROM public.stake_transactions WHERE transaction_type = 'additional_purchase';

  CREATE TABLE public.opening_rows_before_merge_20261119 AS
  SELECT t.id, t.investor_id, t.number_of_stakes, t.price_per_stake,
         t.gross_amount, t.notes
  FROM public.stake_transactions t
  JOIN _target tg ON tg.row_id = t.id;

  -- Investor money must not be readable through the REST API. RLS on with no
  -- policy denies anon and authenticated outright; service_role bypasses it.
  ALTER TABLE public.stake_transactions_archived_20261119 ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.opening_rows_before_merge_20261119  ENABLE ROW LEVEL SECURITY;
  -- Belt and braces on top of RLS. Guarded on the role existing so the
  -- migration cannot die here on a database that has no Supabase roles.
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    EXECUTE 'REVOKE ALL ON public.stake_transactions_archived_20261119 FROM anon';
    EXECUTE 'REVOKE ALL ON public.opening_rows_before_merge_20261119 FROM anon';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    EXECUTE 'REVOKE ALL ON public.stake_transactions_archived_20261119 FROM authenticated';
    EXECUTE 'REVOKE ALL ON public.opening_rows_before_merge_20261119 FROM authenticated';
  END IF;

  -- ----------------------------------------------------------
  -- Fold the units and the money into the opening row, recording what was
  -- merged. price_per_stake becomes the blended rate the opening row now
  -- represents: gross / units, to the column's 8 decimal places.
  -- ----------------------------------------------------------
  UPDATE public.stake_transactions t
  SET number_of_stakes = t.number_of_stakes + m.units,
      gross_amount     = COALESCE(t.gross_amount, 0) + m.gross,
      price_per_stake  = ROUND(
        (COALESCE(t.gross_amount, 0) + m.gross) / (t.number_of_stakes + m.units), 8),
      notes = COALESCE(NULLIF(t.notes, '') || ' ', '')
            || format('Merged %s former additional purchase%s on 2026-11-19: %s.',
                      m.n_rows, CASE WHEN m.n_rows = 1 THEN '' ELSE 's' END, m.detail)
  FROM _merge m, _target tg
  WHERE tg.investor_id = m.investor_id
    AND t.id = tg.row_id;

  -- ----------------------------------------------------------
  -- The rows themselves.
  -- ----------------------------------------------------------
  DELETE FROM public.stake_transactions WHERE transaction_type = 'additional_purchase';

  -- The per-row trigger has already recalculated each investor, but be explicit
  -- for anyone reading this later.
  PERFORM public.recalculate_ownership(investor_id) FROM _merge;

  -- ----------------------------------------------------------
  -- Assert no investor's credits, money or ownership moved.
  -- ----------------------------------------------------------
  SELECT string_agg(
           format(E'\n  %s: credits %s -> %s, total $%s -> $%s, ownership %s -> %s',
                  i.email, b.current_stakes_owned, a.current_stakes_owned,
                  b.total_investment, a.total_investment,
                  b.ownership_percentage, a.ownership_percentage),
           '' ORDER BY i.email)
  INTO v_drift
  FROM _before b
  JOIN public.investors a ON a.id = b.id
  JOIN public.investors i ON i.id = b.id
  WHERE b.current_stakes_owned IS DISTINCT FROM a.current_stakes_owned
     OR b.total_investment     IS DISTINCT FROM a.total_investment
     OR b.ownership_percentage IS DISTINCT FROM a.ownership_percentage;

  IF v_drift IS NOT NULL THEN
    RAISE EXCEPTION E'Rolled back - the merge moved figures it must not touch:%', v_drift;
  END IF;

  IF EXISTS (SELECT 1 FROM public.stake_transactions WHERE transaction_type = 'additional_purchase') THEN
    RAISE EXCEPTION 'Rolled back - additional-purchase rows still present.';
  END IF;

  RAISE NOTICE 'Merged % additional-purchase row(s) into the opening row of % investor(s). Credits, total investment and ownership all unchanged.',
    v_rows, v_investors;
END;
$$;
