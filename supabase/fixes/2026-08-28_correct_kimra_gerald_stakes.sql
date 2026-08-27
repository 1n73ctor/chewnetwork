-- ============================================================
-- Data correction: two investors' stake history
-- ============================================================
--
-- Their opening positions were written straight to `investors` with no ledger
-- row, so the first additional purchase made recalculate_ownership overwrite
-- the opening stakes with 0. See migration 20260828120000 for the root cause.
--
-- Intended positions, both at $0.01/stake:
--
--   PBeyes362@gmail.com     opening    150,000 stakes  $1,500
--   (Kimra Rowlett)         additional 200,000 stakes  $2,000
--                           TOTAL      350,000 stakes  $3,500   0.0021875%
--
--   kennedyg6767@gmail.com  opening    200,000 stakes  $2,000
--   (Gerald Kennedy)        additional 350,000 stakes  $3,500
--                           TOTAL      550,000 stakes  $5,500   0.0034375%
--
-- Matched on email rather than name: it is the UNIQUE column, and names are
-- not. Compared with LOWER() on both sides because these rows predate email
-- normalisation, so stored capitalisation may differ from what was typed.
--
-- RUN MIGRATION 20260828120000 FIRST. This script relies on the corrected
-- recalculate_ownership and on the total_investment column existing.
--
-- ------------------------------------------------------------
-- STEP 1 — inspect before changing anything (read-only)
-- ------------------------------------------------------------
-- Run this alone. Confirm one row per address, and CHECK THE NAMES match the
-- people you expect before going any further.

SELECT
  i.id,
  i.investor_id,
  i.first_name || ' ' || i.last_name AS name,
  i.email,
  i.original_stakes_purchased,
  i.additional_stakes_purchased,
  i.current_stakes_owned,
  i.original_investment,
  i.ownership_percentage,
  (SELECT COUNT(*) FROM public.stake_transactions t WHERE t.investor_id = i.id) AS tx_rows
FROM public.investors i
WHERE LOWER(i.email) IN (LOWER('PBeyes362@gmail.com'), LOWER('kennedyg6767@gmail.com'))
ORDER BY i.email;

-- Existing ledger rows for the two, if any:
SELECT
  i.email,
  t.transaction_type, t.number_of_stakes, t.price_per_stake,
  t.gross_amount, t.transaction_date, t.notes
FROM public.stake_transactions t
JOIN public.investors i ON i.id = t.investor_id
WHERE LOWER(i.email) IN (LOWER('PBeyes362@gmail.com'), LOWER('kennedyg6767@gmail.com'))
ORDER BY i.email, t.transaction_date;


-- ------------------------------------------------------------
-- STEP 2 — apply the correction
-- ------------------------------------------------------------
-- Only run once STEP 1 shows exactly one investor per address AND the names
-- are the people you intend. Rebuilds their purchase history from the
-- known-good figures and lets the trigger recalculate. Transfers, redemptions
-- and repurchases are left untouched.

BEGIN;

DO $$
DECLARE
  v_id UUID;
  v_count INT;
  v_join DATE;
  v_round TEXT;
  -- email, opening stakes, opening $, additional stakes, additional $
  v_people CONSTANT TEXT[][] := ARRAY[
    ARRAY['PBeyes362@gmail.com',    '150000', '1500', '200000', '2000'],
    ARRAY['kennedyg6767@gmail.com', '200000', '2000', '350000', '3500']
  ];
  v_row TEXT[];
BEGIN
  FOREACH v_row SLICE 1 IN ARRAY v_people LOOP
    SELECT COUNT(*), MIN(id) INTO v_count, v_id
    FROM public.investors
    WHERE LOWER(email) = LOWER(v_row[1]);

    IF v_count = 0 THEN
      RAISE EXCEPTION 'No investor found for %', v_row[1];
    ELSIF v_count > 1 THEN
      RAISE EXCEPTION 'Multiple investors match % — resolve by id instead', v_row[1];
    END IF;

    SELECT join_date, round INTO v_join, v_round
    FROM public.investors WHERE id = v_id;

    -- Replace only the purchase history; other transaction types survive.
    DELETE FROM public.stake_transactions
    WHERE investor_id = v_id
      AND transaction_type IN ('purchase', 'additional_purchase');

    INSERT INTO public.stake_transactions
      (investor_id, transaction_type, number_of_stakes, price_per_stake,
       gross_amount, transaction_date, round, notes)
    VALUES
      (v_id, 'purchase', v_row[2]::BIGINT, 0.01, v_row[3]::NUMERIC,
       COALESCE(v_join, CURRENT_DATE), COALESCE(v_round, 'Phase 1'),
       'Opening position (corrected 2026-08-28)'),
      (v_id, 'additional_purchase', v_row[4]::BIGINT, 0.01, v_row[5]::NUMERIC,
       COALESCE(v_join, CURRENT_DATE), COALESCE(v_round, 'Phase 1'),
       'Additional purchase (corrected 2026-08-28)');

    PERFORM public.recalculate_ownership(v_id);

    RAISE NOTICE 'Corrected % (%)', v_row[1], v_id;
  END LOOP;
END;
$$;

-- ------------------------------------------------------------
-- STEP 3 — verify, still inside the transaction
-- ------------------------------------------------------------
-- Expected:
--   PBeyes362@gmail.com      150000 | 200000 | 350000 | 3500.00 | 0.0021875000
--   kennedyg6767@gmail.com   200000 | 350000 | 550000 | 5500.00 | 0.0034375000

SELECT
  i.email,
  i.first_name || ' ' || i.last_name AS name,
  i.original_stakes_purchased,
  i.additional_stakes_purchased,
  i.current_stakes_owned,
  i.total_investment,
  i.ownership_percentage
FROM public.investors i
WHERE LOWER(i.email) IN (LOWER('PBeyes362@gmail.com'), LOWER('kennedyg6767@gmail.com'))
ORDER BY i.email;

-- If the numbers above match, COMMIT. Otherwise ROLLBACK.
COMMIT;
