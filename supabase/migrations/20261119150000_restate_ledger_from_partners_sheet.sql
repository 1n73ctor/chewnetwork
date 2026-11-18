-- ============================================================
-- Restate the ledger from the ChewNetwork Partners credits sheet
-- ============================================================
--
-- Source: "ChewNetwork Partners - Chew credits.pdf", 19 rows, of which 18 are
-- applied here. Matched on email, never on name or position.
--
-- EXCLUDED: Carmen Mercer. Her sheet email, carmen_mercer2025@yahoo.com, does
-- not match any investor on the database - the guard below refused the whole
-- migration over it on the first attempt, and the decision was to leave her
-- out rather than guess at the right record. Her row is untouched and her
-- figures are still whatever they were. The other 18 sheet rows all matched.
--
--   column C  TOTAL Credits        -> number_of_stakes  -> current_stakes_owned
--   column E  Amount total Spent   -> gross_amount      -> total_investment
--
-- Each listed investor's existing ledger is replaced by ONE purchase row
-- holding the sheet's two figures. Every row removed is archived first, with
-- its id and timestamps, in archive.stake_transactions_replaced_20261119, and
-- the investors' pre-change state in archive.investors_before_doc_20261119.
--
-- price_per_stake is not in the sheet, so it is derived: spent / credits, to 8
-- decimal places. It therefore varies per investor ($0.0286 to $0.1429),
-- because the TOTAL Credits column already includes bonus credits that were
-- not paid for. original_stake_price on the investor record is set to the same
-- figure, so the portal's "Original Credit Price" agrees with the ledger row
-- rather than still showing $0.01.
--
-- ALL transaction types are cleared for these investors, not just purchases.
-- Leaving a transfer or redemption behind would make current_stakes_owned
-- disagree with column C, which is the one thing this migration must get right.
--
-- NOT TOUCHED: names, emails, phones, join_date, and the 17 investors on the
-- database who are not on the sheet. The sheet's "Target Subscribers" column
-- is empty for all 19 rows, so targeted_subscribers is left unset.
--
-- Two things in the sheet are passed through exactly as written, both flagged
-- for review rather than silently adjusted:
--   - Elbert White: column E is 0 (Howard Shackelford paid), so he is recorded
--     as 3,500 credits for $0.00 and a $0.00 credit price.
--   - Val Meyer: no credit date and no phase, so the row falls back to the
--     investor's existing join_date and round.
--
-- HOW TO UNDO
--
--   BEGIN;
--   DELETE FROM public.stake_transactions
--   WHERE investor_id IN (SELECT id FROM archive.investors_before_doc_20261119);
--   INSERT INTO public.stake_transactions
--   SELECT * FROM archive.stake_transactions_replaced_20261119;
--   UPDATE public.investors i SET original_stake_price = a.original_stake_price
--   FROM archive.investors_before_doc_20261119 a WHERE a.id = i.id;
--   COMMIT;
--
-- The recalculate_ownership_on_transaction trigger restores the derived
-- figures by itself.
-- ============================================================

CREATE SCHEMA IF NOT EXISTS archive;
REVOKE ALL ON SCHEMA archive FROM PUBLIC;

DO $$
DECLARE
  v_bad   TEXT;
  v_n     INT;
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    EXECUTE 'REVOKE ALL ON SCHEMA archive FROM anon';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    EXECUTE 'REVOKE ALL ON SCHEMA archive FROM authenticated';
  END IF;

  -- ----------------------------------------------------------
  -- The sheet, transcribed. Emails lower-cased to match the database, which
  -- normalised them in 20260828130000. "DonLow26@ gmail.com" in the sheet has
  -- a stray space; it is written here without one.
  -- ----------------------------------------------------------
  CREATE TEMP TABLE _doc (
    email       TEXT PRIMARY KEY,
    name        TEXT,
    credits     BIGINT,
    spent       NUMERIC(15,2),
    credit_date DATE,
    phase       TEXT,
    bonus       TEXT,
    prior_sales TEXT
  ) ON COMMIT DROP;

  INSERT INTO _doc (email, name, credits, spent, credit_date, phase, bonus, prior_sales) VALUES
    ('aaaemergency@gmail.com',      'Bernard Davis',       3500,   500.00,   '2026-11-03', 'Phase 1', NULL,                   NULL),
    ('hshack13@gmail.com',          'Howard Shackelford',  100000, 4000.00,  '2026-11-04', 'Phase 2', '20,000 extra credits', '8/27, 9/7, 10/21'),
    ('rburden77victory@gmail.com',  'Randall Burden',      80000,  3000.00,  '2026-11-06', 'Phase 2', '20,000 extra credits', '9/25 & 10/12'),
    ('addmeup5@aol.com',            'Kamala Hunter',       120000, 5000.00,  '2026-11-07', 'Phase 2', '20,000 extra credits', '8/25, 8/27 & 9/28'),
    ('kennedyg6767@gmail.com',      'Gerald Kennedy',      120000, 5000.00,  '2026-11-07', 'Phase 2', '20,000 extra credits', '8/25 & 8/26'),
    ('surway1.ds@gmail.com',        'Doug Staniszewski',   160000, 5000.00,  '2026-11-07', 'Phase 2', '20,000 extra credits', '8/25, 8/27, 8/28 & 9/28'),
    ('pbeyes362@gmail.com',         'Kimra Rowlett',       290000, 13500.00, '2026-11-09', 'Phase 2', '20,000 extra credits', '8/18, 8/27, 9/16, 9/19, 10/2, 10/6 & 10/22'),
    ('neilhoffman@charter.net',     'Neil Hoffman',        100000, 4000.00,  '2026-11-09', 'Phase 2', '20,000 extra credits', '10/6 & 10/14'),
    ('knightbreeze01@hotmail.com',  'Andre Harris',        50000,  1500.00,  '2026-11-10', 'Phase 2', '20,000 extra credits', '10/19'),
    ('chigilbertfru@gmail.com',     'Gilbert Fru',         90000,  3500.00,  '2026-11-10', 'Phase 2', '20,000 extra credits', '10/11 & 10/16'),
    ('postgm@yahoo.com',            'Gary Post',           61500,  2000.00,  '2026-11-12', 'Phase 2', '21,500 extra credits', '10/2'),
    ('stanleyfyi@gmail.com',        'Stanley & Anna Gentry', 71500, 2500.00, '2026-11-12', 'Phase 2', '21,500 extra credits', '10/11 & 10/15'),
    ('dezwhite1010@gmail.com',      'Elbert White',        3500,   0.00,     '2026-11-13', 'Phase 1', 'Starter, paid by Howard Shackelford', 'no previous sales'),
    ('mchspeed99@gmail.com',        'Michael Speed',       60000,  2000.00,  '2026-11-13', 'Phase 2', '20,000 extra credits', '10/14 & 10/26'),
    ('njayray@yahoo.com',           'Raymond Brown',       320000, 16000.00, '2026-11-17', 'Phase 2', '20,000 extra credits', '9/2, 9/4 & 9/21'),
    ('donlow26@gmail.com',          'Donald Low',          71500,  2500.00,  '2026-11-17', 'Phase 2', '21,500 extra credits', '8/26 & 9/10'),
    ('treada35@gmail.com',          'Sarahnetta Upshaw',   61500,  2000.00,  '2026-11-18', 'Phase 2', '21,500 extra credits', '8/27'),
    ('valmeyer1234@gmail.com',      'Val Meyer',           60000,  3000.00,  NULL,         NULL,      NULL,                   NULL);

  SELECT COUNT(*) INTO v_n FROM _doc;
  IF v_n <> 18 THEN
    RAISE EXCEPTION 'Expected 18 applicable sheet rows (19 less Carmen Mercer), transcribed %.', v_n;
  END IF;

  -- A credit count of zero would make the derived price undefined.
  SELECT string_agg(email, ', ' ORDER BY email) INTO v_bad FROM _doc WHERE COALESCE(credits, 0) <= 0;
  IF v_bad IS NOT NULL THEN
    RAISE EXCEPTION 'Sheet rows with no credits: %', v_bad;
  END IF;

  -- ----------------------------------------------------------
  -- Resolve each sheet row to exactly one investor, by email.
  -- ----------------------------------------------------------
  CREATE TEMP TABLE _m ON COMMIT DROP AS
  SELECT d.*, i.id AS investor_id
  FROM _doc d
  LEFT JOIN public.investors i ON LOWER(TRIM(i.email)) = d.email;

  SELECT string_agg(format('%s (%s)', email, name), E'\n  ' ORDER BY email)
  INTO v_bad FROM _m WHERE investor_id IS NULL;
  IF v_bad IS NOT NULL THEN
    RAISE EXCEPTION E'No investor on the database for these sheet rows:\n  %\nNothing was changed.', v_bad;
  END IF;

  SELECT string_agg(format('%s matches %s investors', email, n), ', ') INTO v_bad
  FROM (SELECT d.email, COUNT(i.id) AS n
        FROM _doc d JOIN public.investors i ON LOWER(TRIM(i.email)) = d.email
        GROUP BY d.email HAVING COUNT(i.id) > 1) x;
  IF v_bad IS NOT NULL THEN
    RAISE EXCEPTION E'Ambiguous email match: %\nNothing was changed.', v_bad;
  END IF;

  -- ----------------------------------------------------------
  -- Archive, in this transaction, everything the change overwrites.
  -- ----------------------------------------------------------
  CREATE TABLE archive.investors_before_doc_20261119 AS
  SELECT i.* FROM public.investors i WHERE i.id IN (SELECT investor_id FROM _m);

  CREATE TABLE archive.stake_transactions_replaced_20261119 AS
  SELECT t.* FROM public.stake_transactions t WHERE t.investor_id IN (SELECT investor_id FROM _m);

  SELECT COUNT(*) INTO v_n FROM archive.stake_transactions_replaced_20261119;
  RAISE NOTICE 'Archived % existing ledger row(s) for the 18 investors.', v_n;

  -- ----------------------------------------------------------
  -- Replace the ledger: every type goes, one purchase row comes back.
  -- ----------------------------------------------------------
  DELETE FROM public.stake_transactions WHERE investor_id IN (SELECT investor_id FROM _m);

  INSERT INTO public.stake_transactions (
    investor_id, transaction_type, number_of_stakes, price_per_stake,
    gross_amount, transaction_date, round, notes)
  SELECT
    m.investor_id,
    'purchase',
    m.credits,
    ROUND(m.spent / m.credits, 8),
    m.spent,
    COALESCE(m.credit_date, i.join_date, CURRENT_DATE),
    COALESCE(m.phase, NULLIF(i.round, ''), 'Phase 2'),
    'Restated from the ChewNetwork Partners credits sheet on 2026-11-19: '
      || to_char(m.credits, 'FM999,999,999') || ' credits for $'
      || to_char(m.spent, 'FM999,999,990.00') || '.'
      || COALESCE(' Includes ' || m.bonus || '.', '')
      || COALESCE(' Previous sales: ' || m.prior_sales || '.', '')
  FROM _m m
  JOIN public.investors i ON i.id = m.investor_id;

  -- Keep the headline credit price on the record consistent with the row.
  UPDATE public.investors i
  SET original_stake_price = ROUND(m.spent / m.credits, 8)
  FROM _m m
  WHERE i.id = m.investor_id;

  -- ----------------------------------------------------------
  -- Assert the two figures the sheet is the authority on.
  -- ----------------------------------------------------------
  SELECT string_agg(
           format(E'\n  %s: credits %s (sheet %s), total $%s (sheet $%s)',
                  m.email, i.current_stakes_owned, m.credits,
                  i.total_investment, m.spent),
           '' ORDER BY m.email)
  INTO v_bad
  FROM _m m
  JOIN public.investors i ON i.id = m.investor_id
  WHERE i.current_stakes_owned IS DISTINCT FROM m.credits
     OR i.total_investment     IS DISTINCT FROM m.spent;

  IF v_bad IS NOT NULL THEN
    RAISE EXCEPTION E'Rolled back - these investors do not match the sheet:%', v_bad;
  END IF;

  -- Exactly one ledger row each, and it is a purchase.
  SELECT string_agg(format('%s has %s rows', m.email, c.n), ', ' ORDER BY m.email)
  INTO v_bad
  FROM _m m
  JOIN (SELECT investor_id, COUNT(*) AS n FROM public.stake_transactions
        GROUP BY investor_id) c ON c.investor_id = m.investor_id
  WHERE c.n <> 1;

  IF v_bad IS NOT NULL THEN
    RAISE EXCEPTION E'Rolled back - expected one ledger row each: %', v_bad;
  END IF;

  SELECT COUNT(*) INTO v_n
  FROM public.stake_transactions t
  WHERE t.investor_id IN (SELECT investor_id FROM _m)
    AND t.transaction_type <> 'purchase';
  IF v_n > 0 THEN
    RAISE EXCEPTION 'Rolled back - % non-purchase row(s) survived.', v_n;
  END IF;

  RAISE NOTICE 'Restated 18 investors from the partners sheet. Credits and total investment now match columns C and E. Carmen Mercer excluded - no matching record.';
END;
$$;
