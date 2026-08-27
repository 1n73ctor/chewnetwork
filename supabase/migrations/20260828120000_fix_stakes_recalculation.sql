-- ============================================================
-- Fix stake recalculation losing an investor's opening position
-- ============================================================
--
-- createInvestor wrote the opening position straight to `investors` without a
-- matching `stake_transactions` row, but recalculate_ownership derives every
-- figure from the ledger. So the first transaction added for an investor made
-- the trigger recompute original_stakes_purchased from `purchase` rows, found
-- none, and overwrote the opening stakes with 0.
--
-- This makes the ledger genuinely authoritative:
--   1. adds total_investment, which nothing was maintaining
--   2. rewrites recalculate_ownership (money totals, correct sold/transferred
--      split, adjustments applied instead of silently ignored)
--   3. backfills an opening `purchase` row for investors who predate the ledger
--
-- Order matters: the function is replaced before the backfill, so the inserts
-- below are recalculated by the corrected version.

-- ------------------------------------------------------------
-- 1. Total invested to date
-- ------------------------------------------------------------
ALTER TABLE public.investors
  ADD COLUMN IF NOT EXISTS total_investment NUMERIC(15,2) DEFAULT 0;

COMMENT ON COLUMN public.investors.total_investment IS
  'Sum of gross_amount across purchase and additional_purchase transactions. '
  'original_investment remains the opening purchase only.';

-- ------------------------------------------------------------
-- 2. Corrected recalculation
-- ------------------------------------------------------------
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

  v_ownership := (v_current_stakes::NUMERIC / 800000000.0) * 5.0;

  UPDATE public.investors SET
    original_stakes_purchased   = v_purchases,
    additional_stakes_purchased = v_additional,
    -- Previously both of these were set to transfers_out, double-counting the
    -- same stakes, while redemptions were recorded in neither.
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
-- 3. Backfill opening positions that predate the ledger
-- ------------------------------------------------------------
-- Only for investors holding stakes with no `purchase` row. Without this, the
-- next transaction on any such investor would zero their opening position.
INSERT INTO public.stake_transactions (
  investor_id, transaction_type, number_of_stakes,
  price_per_stake, gross_amount, transaction_date, round, notes
)
SELECT
  i.id,
  'purchase',
  i.original_stakes_purchased,
  COALESCE(NULLIF(i.original_stake_price, 0), 0.01),
  COALESCE(
    NULLIF(i.original_investment, 0),
    i.original_stakes_purchased * COALESCE(NULLIF(i.original_stake_price, 0), 0.01)
  ),
  COALESCE(i.join_date, CURRENT_DATE),
  COALESCE(i.round, 'Phase 1'),
  'Opening position recorded retroactively when the ledger became authoritative.'
FROM public.investors i
WHERE i.original_stakes_purchased > 0
  AND NOT EXISTS (
    SELECT 1 FROM public.stake_transactions t
    WHERE t.investor_id = i.id AND t.transaction_type = 'purchase'
  );

-- Investors with no stakes at all still need total_investment populated, and
-- any whose figures the old function already corrupted are refreshed here.
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT id FROM public.investors LOOP
    PERFORM public.recalculate_ownership(r.id);
  END LOOP;
END;
$$;
