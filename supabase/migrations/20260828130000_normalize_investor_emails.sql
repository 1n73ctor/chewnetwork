-- ============================================================
-- Normalise existing investor emails to lowercase
-- ============================================================
--
-- Supabase Auth stores addresses lowercased. Investor rows created before
-- normalisation kept whatever capitalisation an admin typed, so a row could
-- read "PBeyes362@gmail.com" while its own login is "pbeyes362@gmail.com".
-- Anything matching the two on email then fails.
--
-- `investors.email` is a plain TEXT UNIQUE column, which is case-sensitive, so
-- it also permitted "Alex@x.com" and "alex@x.com" as two separate investors for
-- one person.
--
-- Application-side normalisation is already in place for new and edited
-- investors; this brings existing rows in line and adds a database-level guard
-- so case-duplicates cannot reappear through any other path.

-- ------------------------------------------------------------
-- 1. Refuse to run if normalising would merge two people
-- ------------------------------------------------------------
-- If two rows differ only by case they are either one person entered twice or
-- two genuinely different records. Either way that is a human decision, not
-- something this migration should silently pick a winner for.
DO $$
DECLARE
  v_collisions TEXT;
BEGIN
  SELECT string_agg(dupe.email_lower || ' (' || dupe.n || ' rows)', ', ')
  INTO v_collisions
  FROM (
    SELECT LOWER(TRIM(email)) AS email_lower, COUNT(*) AS n
    FROM public.investors
    WHERE email IS NOT NULL
    GROUP BY LOWER(TRIM(email))
    HAVING COUNT(*) > 1
  ) dupe;

  IF v_collisions IS NOT NULL THEN
    RAISE EXCEPTION
      'Cannot normalise investor emails: these collide once lowercased: %. '
      'Resolve the duplicate investors first, then re-run this migration.',
      v_collisions;
  END IF;
END;
$$;

-- ------------------------------------------------------------
-- 2. Normalise
-- ------------------------------------------------------------
UPDATE public.investors
SET email = LOWER(TRIM(email)),
    updated_at = CURRENT_TIMESTAMP
WHERE email IS NOT NULL
  AND email IS DISTINCT FROM LOWER(TRIM(email));

-- ------------------------------------------------------------
-- 3. Keep it that way
-- ------------------------------------------------------------
-- The existing UNIQUE on email is case-sensitive; this one is not, so a
-- differently-cased duplicate is rejected by the database regardless of which
-- code path inserts it.
CREATE UNIQUE INDEX IF NOT EXISTS investors_email_lower_key
  ON public.investors (LOWER(email));

-- Beneficiary addresses are contact details with no login behind them, so they
-- are deliberately left as entered.
