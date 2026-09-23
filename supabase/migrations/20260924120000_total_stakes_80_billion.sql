-- ============================================================
-- Ecosystem Stake pool: 800,000,000 -> 80,000,000,000
-- ============================================================
--
-- The pool is a 5% share of Chew Network, so ownership is
-- (stakes / pool) * 5. Raising the pool a hundredfold divides every existing
-- ownership percentage by a hundred. Nothing else changes: stake counts and
-- investment amounts are untouched, only the share they represent.
--
-- Two halves have to move together, and this is the half the database owns:
-- src/lib/stakes.ts carries the same figures for the portal. The guard at the
-- end fails if this migration is applied without that change, so the two cannot
-- silently disagree.
--
-- Changing the function alone would leave every stored ownership_percentage at
-- its old value, since they are only written when recalculate_ownership runs.
-- Every investor is therefore recalculated below.

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
  v_adjustments BIGINT := 0;
  v_current_stakes BIGINT := 0;
  v_ownership NUMERIC(20,10) := 0;
  v_opening_investment NUMERIC(15,2) := 0;
  v_total_investment NUMERIC(15,2) := 0;
BEGIN
  SELECT
    COALESCE(SUM(CASE WHEN transaction_type = 'purchase' THEN number_of_stakes ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN transaction_type = 'additional_purchase' THEN number_of_stakes ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN transaction_type = 'transfer_in' THEN number_of_stakes ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN transaction_type = 'transfer_out' THEN number_of_stakes ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN transaction_type = 'company_repurchase' THEN number_of_stakes ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN transaction_type = 'redemption' THEN number_of_stakes ELSE 0 END), 0),
    -- Adjustments are signed: a correction may add or remove stakes.
    COALESCE(SUM(CASE WHEN transaction_type = 'adjustment' THEN number_of_stakes ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN transaction_type = 'purchase' THEN gross_amount ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN transaction_type IN ('purchase', 'additional_purchase') THEN gross_amount ELSE 0 END), 0)
  INTO
    v_purchases, v_additional, v_transfers_in, v_transfers_out,
    v_repurchases, v_redemptions, v_adjustments,
    v_opening_investment, v_total_investment
  FROM public.stake_transactions
  WHERE investor_id = p_investor_id;

  v_current_stakes := v_purchases + v_additional + v_transfers_in + v_adjustments
                      - v_transfers_out - v_repurchases - v_redemptions;
  IF v_current_stakes < 0 THEN v_current_stakes := 0; END IF;

  -- Pool raised from 800,000,000 on 2026-09-24. Mirrors
  -- TOTAL_ECOSYSTEM_STAKES / ECOSYSTEM_SHARE_PERCENT in src/lib/stakes.ts.
  v_ownership := (v_current_stakes::NUMERIC / 80000000000.0) * 5.0;

  UPDATE public.investors SET
    original_stakes_purchased   = v_purchases,
    additional_stakes_purchased = v_additional,
    stakes_sold                 = v_redemptions,
    stakes_transferred          = v_transfers_out,
    stakes_repurchased          = v_repurchases,
    current_stakes_owned        = v_current_stakes,
    ownership_percentage        = v_ownership,
    -- Only overwrite the opening amount once a purchase row exists, so an
    -- investor with no ledger history keeps whatever was entered by hand.
    original_investment         = CASE WHEN v_purchases > 0 THEN v_opening_investment
                                       ELSE original_investment END,
    total_investment            = v_total_investment,
    updated_at                  = CURRENT_TIMESTAMP
  WHERE id = p_investor_id;
END;
$$;

-- ------------------------------------------------------------
-- Restate every investor against the new pool
-- ------------------------------------------------------------
DO $$
DECLARE
  r RECORD;
  v_done INT := 0;
BEGIN
  FOR r IN SELECT id FROM public.investors LOOP
    PERFORM public.recalculate_ownership(r.id);
    v_done := v_done + 1;
  END LOOP;
  RAISE NOTICE 'Recalculated % investors against the 80,000,000,000 pool.', v_done;
END;
$$;

-- ------------------------------------------------------------
-- Verify
-- ------------------------------------------------------------
DO $$
DECLARE
  v_bad INT;
BEGIN
  -- Every stored percentage must now agree with the new pool. Compared with a
  -- tolerance because ownership_percentage is NUMERIC(20,10) and the quotient
  -- is not always exact at that scale.
  SELECT COUNT(*) INTO v_bad
  FROM public.investors
  WHERE ABS(ownership_percentage
            - (current_stakes_owned::NUMERIC / 80000000000.0) * 5.0) > 0.0000000001;

  IF v_bad > 0 THEN
    RAISE EXCEPTION '% investor(s) still hold an ownership percentage from the old pool.', v_bad;
  END IF;

  RAISE NOTICE 'Verified: all ownership percentages match the new pool.';
END;
$$;
