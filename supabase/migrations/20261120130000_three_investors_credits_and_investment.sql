-- ============================================================
-- Credits and total investment for three investors
-- ============================================================
--
-- From the subscriber sheet dated 2026-11-20:
--
--   column D  Credit amount  -> number_of_stakes -> current_stakes_owned
--   column E  amount paid    -> gross_amount     -> total_investment
--
--   Daniel Moran    go2dbq@gmail.com              0 credits  $80.00
--   Elbert White    dezwhite1010@gmail.com    3,500 credits  $500.00
--   Bernard Davis   aaaemergency@gmail.com    3,500 credits  $500.00
--
-- Matched on email. Targeted subscribers were set separately in
-- 20261120120000 and are not touched again here.
--
-- ELBERT WHITE IS A DELIBERATE CORRECTION. 20261119150000 recorded him at
-- $0.00, because the partners sheet put 0 in its "Amount total Spent" column
-- (Howard Shackelford paid on his behalf). This sheet states $500.00 and is
-- the later word, so $500.00 is what is stored. Bernard Davis already held
-- these figures; he is rewritten to the same values for consistency and
-- nothing about him changes.
--
-- DANIEL MORAN HOLDS 0 CREDITS FOR $80.00, exactly as the sheet says. Two
-- consequences, both handled rather than left to chance:
--   - price per credit would be 80 / 0. It is set to 0 instead of dividing.
--   - recalculate_ownership only refreshes original_investment when a purchase
--     row carries units, and his carries none, so original_investment is set
--     directly below rather than left stale.
--
-- DATES ARE NOT TAKEN FROM THIS SHEET. Only credits, money and the subscriber
-- target were asked for, so each investor keeps the transaction date and round
-- already on their ledger. Daniel has no row to inherit from, so his falls
-- back to the sheet's date, then his join date.
--
-- HOW TO UNDO
--
--   BEGIN;
--   DELETE FROM public.stake_transactions
--   WHERE investor_id IN (SELECT id FROM archive.investors_before_sheet_20261120);
--   INSERT INTO public.stake_transactions
--   SELECT * FROM archive.stake_transactions_replaced_20261120;
--   UPDATE public.investors i
--   SET original_stake_price = a.original_stake_price,
--       original_investment  = a.original_investment
--   FROM archive.investors_before_sheet_20261120 a WHERE a.id = i.id;
--   COMMIT;
-- ============================================================

CREATE SCHEMA IF NOT EXISTS archive;
REVOKE ALL ON SCHEMA archive FROM PUBLIC;

DO $$
DECLARE
  v_bad TEXT;
  v_n   INT;
BEGIN
  CREATE TEMP TABLE _sheet (
    email      TEXT PRIMARY KEY,
    name       TEXT,
    credits    BIGINT,
    paid       NUMERIC(15,2),
    sheet_date DATE
  ) ON COMMIT DROP;

  INSERT INTO _sheet (email, name, credits, paid, sheet_date) VALUES
    ('go2dbq@gmail.com',       'Daniel Moran',  0,    80.00,  '2026-11-13'),
    ('dezwhite1010@gmail.com', 'Elbert White',  3500, 500.00, '2026-11-03'),
    ('aaaemergency@gmail.com', 'Bernard Davis', 3500, 500.00, '2026-11-03');

  -- ----------------------------------------------------------
  -- Resolve by email, refusing on anything ambiguous or missing.
  -- ----------------------------------------------------------
  SELECT string_agg(format('%s (%s)', s.email, s.name), E'\n  ' ORDER BY s.email)
  INTO v_bad
  FROM _sheet s
  WHERE NOT EXISTS (
    SELECT 1 FROM public.investors i WHERE LOWER(TRIM(i.email)) = s.email);

  IF v_bad IS NOT NULL THEN
    RAISE EXCEPTION E'No investor on the database for:\n  %\nNothing was changed.', v_bad;
  END IF;

  SELECT string_agg(format('%s matches %s investors', s.email, c.n), ', ') INTO v_bad
  FROM _sheet s
  JOIN (SELECT LOWER(TRIM(email)) e, COUNT(*) n FROM public.investors
        GROUP BY LOWER(TRIM(email))) c ON c.e = s.email
  WHERE c.n > 1;

  IF v_bad IS NOT NULL THEN
    RAISE EXCEPTION E'Ambiguous email match: %\nNothing was changed.', v_bad;
  END IF;

  CREATE TEMP TABLE _m ON COMMIT DROP AS
  SELECT s.*, i.id AS investor_id
  FROM _sheet s
  JOIN public.investors i ON LOWER(TRIM(i.email)) = s.email;

  -- The date and round to keep: from the investor's earliest purchase row.
  CREATE TEMP TABLE _keep ON COMMIT DROP AS
  SELECT DISTINCT ON (t.investor_id) t.investor_id, t.transaction_date AS d, t.round AS r
  FROM public.stake_transactions t
  JOIN _m m ON m.investor_id = t.investor_id
  WHERE t.transaction_type = 'purchase'
  ORDER BY t.investor_id, t.transaction_date, t.created_at, t.id;

  -- ----------------------------------------------------------
  -- Archive everything this overwrites.
  -- ----------------------------------------------------------
  CREATE TABLE archive.investors_before_sheet_20261120 AS
  SELECT i.* FROM public.investors i WHERE i.id IN (SELECT investor_id FROM _m);

  CREATE TABLE archive.stake_transactions_replaced_20261120 AS
  SELECT t.* FROM public.stake_transactions t
  WHERE t.investor_id IN (SELECT investor_id FROM _m);

  SELECT COUNT(*) INTO v_n FROM archive.stake_transactions_replaced_20261120;
  RAISE NOTICE 'Archived % existing ledger row(s) for the 3 investors.', v_n;

  -- ----------------------------------------------------------
  -- One purchase row each, carrying the sheet's two figures.
  -- ----------------------------------------------------------
  DELETE FROM public.stake_transactions WHERE investor_id IN (SELECT investor_id FROM _m);

  INSERT INTO public.stake_transactions (
    investor_id, transaction_type, number_of_stakes, price_per_stake,
    gross_amount, transaction_date, round, notes)
  SELECT
    m.investor_id,
    'purchase',
    m.credits,
    -- No division when there are no credits to divide by.
    CASE WHEN m.credits > 0 THEN ROUND(m.paid / m.credits, 8) ELSE 0 END,
    m.paid,
    COALESCE(k.d, m.sheet_date, i.join_date, CURRENT_DATE),
    COALESCE(NULLIF(k.r, ''), NULLIF(i.round, ''), 'Phase 1'),
    'Set from the subscriber sheet on 2026-11-20: '
      || to_char(m.credits, 'FM999,999,999') || ' credits for $'
      || to_char(m.paid, 'FM999,999,990.00') || '.'
  FROM _m m
  JOIN public.investors i ON i.id = m.investor_id
  LEFT JOIN _keep k ON k.investor_id = m.investor_id;

  -- recalculate_ownership leaves original_investment alone when the purchase
  -- row has no units, so set it (and the headline price) directly.
  UPDATE public.investors i
  SET original_investment  = m.paid,
      original_stake_price = CASE WHEN m.credits > 0 THEN ROUND(m.paid / m.credits, 8) ELSE 0 END
  FROM _m m
  WHERE i.id = m.investor_id;

  -- ----------------------------------------------------------
  -- Assert against the sheet.
  -- ----------------------------------------------------------
  SELECT string_agg(
           format(E'\n  %s: credits %s (sheet %s), total $%s (sheet $%s)',
                  m.email, i.current_stakes_owned, m.credits,
                  i.total_investment, m.paid),
           '' ORDER BY m.email)
  INTO v_bad
  FROM _m m
  JOIN public.investors i ON i.id = m.investor_id
  WHERE i.current_stakes_owned IS DISTINCT FROM m.credits
     OR i.total_investment     IS DISTINCT FROM m.paid;

  IF v_bad IS NOT NULL THEN
    RAISE EXCEPTION E'Rolled back - these do not match the sheet:%', v_bad;
  END IF;

  SELECT string_agg(format('%s has %s rows', m.email, c.n), ', ') INTO v_bad
  FROM _m m
  JOIN (SELECT investor_id, COUNT(*) n FROM public.stake_transactions
        GROUP BY investor_id) c ON c.investor_id = m.investor_id
  WHERE c.n <> 1;

  IF v_bad IS NOT NULL THEN
    RAISE EXCEPTION E'Rolled back - expected one ledger row each: %', v_bad;
  END IF;

  -- The subscriber targets set in 20261120120000 must still stand.
  SELECT string_agg(format('%s: %s', i.email, COALESCE(i.targeted_subscribers, 'NULL')), ', ')
  INTO v_bad
  FROM _m m JOIN public.investors i ON i.id = m.investor_id
  WHERE i.targeted_subscribers IS NULL;

  IF v_bad IS NOT NULL THEN
    RAISE EXCEPTION E'Rolled back - a subscriber target was lost: %', v_bad;
  END IF;

  RAISE NOTICE 'Credits and total investment set for 3 investors from the subscriber sheet.';
END;
$$;
