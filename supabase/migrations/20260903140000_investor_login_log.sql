-- ============================================================
-- Log investor sign-ins, with the IP they came from
-- ============================================================
--
-- audit_logs has carried ip_address and session_info columns since it was
-- created, but nothing ever wrote to them, and sign-ins were not recorded at
-- all — the log covered admin actions only. An investor could sign in from
-- anywhere and leave no trace.
--
-- The address itself has to be captured server-side: the browser does not know
-- its own public IP, and a value it supplied would be worthless in an audit
-- log. /api/auth/login-log reads it from the edge headers and calls this.

-- SECURITY DEFINER because audit_logs is admin-only under RLS, and the person
-- being logged is an investor. The signature is deliberately narrow: the caller
-- chooses neither the action nor whose row it lands on, both of which are fixed
-- here from auth.uid().
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
    -- Repeated into new_value so the audit table's existing Details column
    -- shows something useful without needing to know about the new columns.
    jsonb_build_object(
      'userId', auth.uid(),
      'ip', NULLIF(p_ip, ''),
      'userAgent', NULLIF(p_user_agent, '')
    )
  );
END;
$$;

COMMENT ON FUNCTION public.record_login_event(TEXT, TEXT) IS
  'Records a sign-in against the calling user. Called only from the server, '
  'which supplies the client IP from the edge request headers.';

REVOKE ALL ON FUNCTION public.record_login_event(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_login_event(TEXT, TEXT) TO authenticated, service_role;

-- The audit page reads newest-first and filters by action, and login rows will
-- quickly become the bulk of the table.
CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx
  ON public.audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_action_created_at_idx
  ON public.audit_logs (action, created_at DESC);
