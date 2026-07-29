-- Notifications table for real-time activity notifications
-- Covers: new followers, recipe saves, comments

-- 1. Notification type enum
DROP TYPE IF EXISTS public.notification_type CASCADE;
CREATE TYPE public.notification_type AS ENUM (
  'new_follower',
  'recipe_saved',
  'comment'
);

-- 2. Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  notification_type public.notification_type NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  reference_id TEXT DEFAULT '',
  reference_type TEXT DEFAULT '',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON public.notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_created ON public.notifications(recipient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_unread ON public.notifications(recipient_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_actor_id ON public.notifications(actor_id);

-- 4. Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Recipients can read their own notifications
DROP POLICY IF EXISTS "recipients_can_read_own_notifications" ON public.notifications;
CREATE POLICY "recipients_can_read_own_notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (recipient_id = auth.uid());

-- Recipients can update (mark as read) their own notifications
DROP POLICY IF EXISTS "recipients_can_update_own_notifications" ON public.notifications;
CREATE POLICY "recipients_can_update_own_notifications"
ON public.notifications
FOR UPDATE
TO authenticated
USING (recipient_id = auth.uid())
WITH CHECK (recipient_id = auth.uid());

-- Authenticated users can insert notifications (for triggers / app logic)
DROP POLICY IF EXISTS "authenticated_can_insert_notifications" ON public.notifications;
CREATE POLICY "authenticated_can_insert_notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Recipients can delete their own notifications
DROP POLICY IF EXISTS "recipients_can_delete_own_notifications" ON public.notifications;
CREATE POLICY "recipients_can_delete_own_notifications"
ON public.notifications
FOR DELETE
TO authenticated
USING (recipient_id = auth.uid());

-- 6. Function: mark all notifications as read for a user
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.notifications
  SET is_read = true
  WHERE recipient_id = p_user_id AND is_read = false;
END;
$$;
