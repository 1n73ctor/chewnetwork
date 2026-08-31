-- ============================================================
-- Correct Gerald Kennedy's opening position
-- ============================================================
--
-- The opening purchase was restored as 200,000 stakes / $2,000. The correct
-- figures are 150,000 stakes / $1,500, giving:
--
--   opening      150,000 stakes  $1,500
--   additional   350,000 stakes  $3,500   (unchanged)
--   TOTAL        500,000 stakes  $5,000   0.003125%
--
-- Updating the ledger row is enough: recalculate_ownership derives the stake
-- counts, original_investment and total_investment from it, and the trigger on
-- stake_transactions fires on UPDATE. It is called explicitly as well so this
-- migration does not depend on the trigger being present.

DO $$
DECLARE
  v_id UUID;
  v_count INT;
  v_purchases INT;
  v_stakes BIGINT;
  v_total NUMERIC(15,2);
  v_opening NUMERIC(15,2);
  v_ownership NUMERIC(20,10);
BEGIN
  -- Counted and fetched separately: there is no MIN() for uuid.
  SELECT COUNT(*) INTO v_count
  FROM public.investors
  WHERE LOWER(email) = LOWER('kennedyg6767@gmail.com');

  IF v_count <> 1 THEN
    RAISE EXCEPTION 'Expected exactly 1 investor for kennedyg6767@gmail.com, found %.', v_count;
  END IF;

  SELECT id INTO v_id
  FROM public.investors
  WHERE LOWER(email) = LOWER('kennedyg6767@gmail.com');

  -- One opening row is expected; more than one means the history is not what
  -- this correction assumes, so stop rather than pick one arbitrarily.
  SELECT COUNT(*) INTO v_purchases
  FROM public.stake_transactions
  WHERE investor_id = v_id AND transaction_type = 'purchase';

  IF v_purchases <> 1 THEN
    RAISE EXCEPTION 'Expected exactly 1 opening purchase row, found %.', v_purchases;
  END IF;

  UPDATE public.stake_transactions
  SET number_of_stakes = 150000,
      price_per_stake  = 0.01,
      gross_amount     = 1500,
      notes            = 'Opening position (corrected 2026-08-28: was 200,000 / $2,000)'
  WHERE investor_id = v_id AND transaction_type = 'purchase';

  PERFORM public.recalculate_ownership(v_id);

  SELECT current_stakes_owned, total_investment, original_investment, ownership_percentage
  INTO v_stakes, v_total, v_opening, v_ownership
  FROM public.investors WHERE id = v_id;

  IF v_stakes <> 500000 THEN
    RAISE EXCEPTION 'Expected 500,000 current stakes, got %.', v_stakes;
  END IF;
  IF v_total <> 5000.00 THEN
    RAISE EXCEPTION 'Expected total_investment 5000.00, got %.', v_total;
  END IF;
  IF v_opening <> 1500.00 THEN
    RAISE EXCEPTION 'Expected original_investment 1500.00, got %.', v_opening;
  END IF;

  RAISE NOTICE 'Kennedy corrected: % stakes, opening $%, total $%, ownership %%%',
    v_stakes, v_opening, v_total, v_ownership;
END;
$$;
