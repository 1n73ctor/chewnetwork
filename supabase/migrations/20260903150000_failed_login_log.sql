-- ============================================================
-- Log failed sign-in attempts too
-- ============================================================
--
-- Successful sign-ins alone show who got in, not who tried. A run of failures
-- against one investor's address from one IP is the signal worth having, and it
-- is the half that only exists if it is recorded at the moment of refusal.
--
-- Nothing is authenticated here — the attempt failed, so there is no session and
-- no auth.uid() to attribute it to. The row is keyed on the attempted email
-- instead, resolved to an investor where one matches.

CREATE OR REPLACE FUNCTION public.record_failed_login(
  p_email TEXT,
  p_ip TEXT,
  p_user_agent TEXT,
  p_reason TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email TEXT := lower(trim(p_email));
  v_ip TEXT := NULLIF(left(p_ip, 100), '');
  v_investor_id UUID;
  v_recent INTEGER;
BEGIN
  IF v_email IS NULL OR v_email = '' THEN
    RETURN;
  END IF;

  -- This function is callable by anon — it has to be, since the caller has no
  -- session — so it is also the one endpoint someone could hammer to bloat the
  -- audit table. A burst from one address is recorded up to the cap and then
  -- quietly dropped: the first ten rows already carry the evidence.
  IF v_ip IS NOT NULL THEN
    SELECT count(*) INTO v_recent
    FROM public.audit_logs
    WHERE action = 'Login Failed'
      AND ip_address = v_ip
      AND created_at > now() - interval '1 minute';

    IF v_recent >= 10 THEN
      RETURN;
    END IF;
  END IF;

  SELECT id INTO v_investor_id
  FROM public.investors
  WHERE lower(email) = v_email
  LIMIT 1;

  INSERT INTO public.audit_logs (
    admin_user_id, action, investor_id, ip_address, session_info, new_value
  ) VALUES (
    NULL, -- no session: nobody is signed in when an attempt fails
    'Login Failed',
    v_investor_id,
    v_ip,
    NULLIF(left(p_user_agent, 500), ''),
    jsonb_build_object(
      'email', v_email,
      'ip', v_ip,
      'userAgent', NULLIF(p_user_agent, ''),
      'reason', COALESCE(NULLIF(p_reason, ''), 'invalid_credentials'),
      -- Distinguishes "wrong password for a real investor" from "address we
      -- have never seen", which is the difference between a locked-out investor
      -- and someone guessing.
      'knownInvestor', v_investor_id IS NOT NULL
    )
  );
END;
$$;

COMMENT ON FUNCTION public.record_failed_login(TEXT, TEXT, TEXT, TEXT) IS
  'Records a rejected sign-in attempt. Called from the server, which supplies '
  'the client IP from the edge request headers. Rate-limited per IP.';

REVOKE ALL ON FUNCTION public.record_failed_login(TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_failed_login(TEXT, TEXT, TEXT, TEXT) TO anon, authenticated, service_role;

-- Supports the rate-limit count above, which runs on every failed attempt.
CREATE INDEX IF NOT EXISTS audit_logs_failed_login_ip_idx
  ON public.audit_logs (ip_address, created_at DESC)
  WHERE action = 'Login Failed';
