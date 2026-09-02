-- ============================================================
-- Record the email on successful sign-ins too
-- ============================================================
--
-- The Login Logs table shows who signed in, and "who" reads better as a name
-- than as a truncated UUID. Investor names come from the investors table, which
-- admins can already read, but that only covers investors: user_profiles is
-- readable only by its own owner, so an admin sign-in had nothing to show.
--
-- Failed attempts already carried the address that was tried. This puts the
-- same field on the success path, taken from the verified JWT rather than from
-- anything the caller supplied.

CREATE OR REPLACE FUNCTION public.record_login_event(
  p_ip TEXT,
  p_user_agent TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_investor_id UUID;
  v_email TEXT := lower(nullif(auth.jwt() ->> 'email', ''));
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'record_login_event requires an authenticated session';
  END IF;

  SELECT id INTO v_investor_id
  FROM public.investors
  WHERE user_id = auth.uid()
  LIMIT 1;

  INSERT INTO public.audit_logs (
    admin_user_id, action, investor_id, ip_address, session_info, new_value
  ) VALUES (
    -- Looked up rather than assigned straight from auth.uid(): the column has a
    -- foreign key onto user_profiles, and a signed-in user missing that row
    -- would otherwise fail the insert and lose the log entry entirely. The real
    -- uid is kept in new_value either way.
    (SELECT id FROM public.user_profiles WHERE id = auth.uid()),
    CASE WHEN v_investor_id IS NULL THEN 'Admin Login' ELSE 'Investor Login' END,
    v_investor_id,
    NULLIF(left(p_ip, 100), ''),
    NULLIF(left(p_user_agent, 500), ''),
    jsonb_build_object(
      'userId', auth.uid(),
      'email', v_email,
      'ip', NULLIF(p_ip, ''),
      'userAgent', NULLIF(p_user_agent, '')
    )
  );
END;
$$;

REVOKE ALL ON FUNCTION public.record_login_event(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_login_event(TEXT, TEXT) TO authenticated, service_role;
