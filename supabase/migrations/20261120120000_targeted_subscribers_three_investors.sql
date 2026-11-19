-- ============================================================
-- Targeted subscribers for three investors
-- ============================================================
--
-- From the subscriber sheet dated 2026-11-20, column C:
--
--   Daniel Moran    go2dbq@gmail.com          3
--   Elbert White    dezwhite1010@gmail.com    0
--   Bernard Davis   aaaemergency@gmail.com    0
--
-- Matched on email, never on name. Stored as written: targeted_subscribers is
-- text precisely so a figure survives exactly as the sheet records it.
--
-- ONLY targeted_subscribers is touched. The same sheet also carries a credit
-- amount and an amount paid per row, and those are deliberately left alone
-- here because two of them disagree with what is already recorded:
--
--   Bernard Davis  3,500 credits / $500  - agrees with the ledger, nothing to do
--   Elbert White   3,500 credits / $500  - the ledger holds $0.00, because the
--                                          partners sheet put 0 in its "Amount
--                                          total Spent" column (Howard
--                                          Shackelford paid). Which figure is
--                                          right is a question for the owner,
--                                          not something to guess at here.
--   Daniel Moran   0 credits / $80       - not on the partners sheet at all, so
--                                          his ledger has never been restated.
--                                          Writing 0 credits could erase a real
--                                          holding, so it is not done blind.
--
-- The migration refuses outright if any of the three emails has no investor,
-- rather than applying two of three and staying quiet about the third.
-- ============================================================

DO $$
DECLARE
  v_bad TEXT;
  v_n   INT;
BEGIN
  CREATE TEMP TABLE _subs (
    email  TEXT PRIMARY KEY,
    name   TEXT,
    target TEXT
  ) ON COMMIT DROP;

  INSERT INTO _subs (email, name, target) VALUES
    ('go2dbq@gmail.com',        'Daniel Moran',  '3'),
    ('dezwhite1010@gmail.com',  'Elbert White',  '0'),
    ('aaaemergency@gmail.com',  'Bernard Davis', '0');

  -- Every row must resolve to exactly one investor.
  SELECT string_agg(format('%s (%s)', s.email, s.name), E'\n  ' ORDER BY s.email)
  INTO v_bad
  FROM _subs s
  WHERE NOT EXISTS (
    SELECT 1 FROM public.investors i WHERE LOWER(TRIM(i.email)) = s.email);

  IF v_bad IS NOT NULL THEN
    RAISE EXCEPTION E'No investor on the database for:\n  %\nNothing was changed.', v_bad;
  END IF;

  SELECT string_agg(format('%s matches %s investors', s.email, c.n), ', ') INTO v_bad
  FROM _subs s
  JOIN (SELECT LOWER(TRIM(email)) e, COUNT(*) n FROM public.investors
        GROUP BY LOWER(TRIM(email))) c ON c.e = s.email
  WHERE c.n > 1;

  IF v_bad IS NOT NULL THEN
    RAISE EXCEPTION E'Ambiguous email match: %\nNothing was changed.', v_bad;
  END IF;

  -- Keep what each one held before, so the change is reversible by hand.
  CREATE TABLE IF NOT EXISTS archive.targeted_subscribers_before_20261120 AS
  SELECT i.id, i.email, i.targeted_subscribers
  FROM public.investors i
  JOIN _subs s ON s.email = LOWER(TRIM(i.email));

  UPDATE public.investors i
  SET targeted_subscribers = s.target,
      updated_at = CURRENT_TIMESTAMP
  FROM _subs s
  WHERE LOWER(TRIM(i.email)) = s.email;

  GET DIAGNOSTICS v_n = ROW_COUNT;
  IF v_n <> 3 THEN
    RAISE EXCEPTION 'Rolled back - expected to update 3 investors, updated %.', v_n;
  END IF;

  -- Read it back rather than trust the write.
  SELECT string_agg(format('%s: %s (wanted %s)', s.email,
                           COALESCE(i.targeted_subscribers, 'NULL'), s.target), ', ')
  INTO v_bad
  FROM _subs s
  JOIN public.investors i ON LOWER(TRIM(i.email)) = s.email
  WHERE i.targeted_subscribers IS DISTINCT FROM s.target;

  IF v_bad IS NOT NULL THEN
    RAISE EXCEPTION 'Rolled back - did not store as written: %', v_bad;
  END IF;

  RAISE NOTICE 'Targeted subscribers set for 3 investors.';
END;
$$;
