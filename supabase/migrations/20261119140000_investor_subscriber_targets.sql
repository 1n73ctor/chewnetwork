-- ============================================================
-- Targeted and total subscribers, per investor
-- ============================================================
--
-- Two figures shown on the investor's My Ecosystem Credits page beside Total
-- Investment, and set by an admin on the investor's record.
--
--   targeted_subscribers  TEXT    the goal, as written. Text rather than a
--                                 number so it can hold a range or an open
--                                 end: '100', '75+', '3-6+'. It is a label to
--                                 display, never arithmetic, so there is
--                                 nothing to gain from a numeric type and a
--                                 range would not fit one.
--   total_subscribers     BIGINT  the count reached so far. A real count, so
--                                 it is a number and formats like every other
--                                 count in the portal.
--
-- Both are nullable/zero for every existing investor and nothing reads them
-- until an admin fills them in: the page shows an em dash for a blank target
-- and 0 for an unset count.
--
-- No row-level security work is needed. The investors table already has its
-- policies and they are per-row, not per-column, so an investor sees these two
-- columns on their own record exactly as they see the rest of it.
-- ============================================================

ALTER TABLE public.investors
  ADD COLUMN IF NOT EXISTS targeted_subscribers TEXT,
  ADD COLUMN IF NOT EXISTS total_subscribers BIGINT DEFAULT 0;

COMMENT ON COLUMN public.investors.targeted_subscribers IS
  'Subscriber goal as displayed, free text so a range fits: 100, 75+, 3-6+.';
COMMENT ON COLUMN public.investors.total_subscribers IS
  'Subscribers reached so far. A count, displayed with thousands separators.';

-- Existing rows get 0 rather than NULL, so the portal never has to decide
-- between "none yet" and "not recorded" for the count.
UPDATE public.investors SET total_subscribers = 0 WHERE total_subscribers IS NULL;

DO $$
DECLARE
  v_missing TEXT;
BEGIN
  SELECT string_agg(c, ', ') INTO v_missing
  FROM (VALUES ('targeted_subscribers'), ('total_subscribers')) AS v(c)
  WHERE NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'investors' AND column_name = v.c);

  IF v_missing IS NOT NULL THEN
    RAISE EXCEPTION 'Rolled back - column(s) missing after the change: %', v_missing;
  END IF;

  IF EXISTS (SELECT 1 FROM public.investors WHERE total_subscribers IS NULL) THEN
    RAISE EXCEPTION 'Rolled back - total_subscribers left NULL on some rows.';
  END IF;

  RAISE NOTICE 'targeted_subscribers and total_subscribers added to investors.';
END;
$$;
