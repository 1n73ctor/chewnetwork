'use client';

import { useEffect, useState, useCallback } from 'react';
import { getClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Notification {
  id: string;
  recipientId: string;
  actorId: string | null;
  notificationType: 'new_follower' | 'recipe_saved' | 'comment';
  title: string;
  body: string;
  referenceId: string;
  referenceType: string;
  isRead: boolean;
  createdAt: string;
}

function rowToNotification(row: Record<string, unknown>): Notification {
  return {
    id: row.id as string,
    recipientId: row.recipient_id as string,
    actorId: (row.actor_id as string) || null,
    notificationType: row.notification_type as Notification['notificationType'],
    title: (row.title as string) || '',
    body: (row.body as string) || '',
    referenceId: (row.reference_id as string) || '',
    referenceType: (row.reference_type as string) || '',
    isRead: (row.is_read as boolean) ?? false,
    createdAt: row.created_at as string,
  };
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  // Lazy — see getClient(): constructing during render breaks prerendering.
  const getSupabase = () => getClient();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await getSupabase()
        .from('notifications')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30);

      if (!error && data) {
        setNotifications(data.map(rowToNotification));
      }
    } catch {
      // silently fail — notifications are non-critical
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Mark a single notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user?.id) return;
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
    await getSupabase()
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('recipient_id', user.id);
  }, [user?.id]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await getSupabase().rpc('mark_all_notifications_read', { p_user_id: user.id });
  }, [user?.id]);

  // Real-time subscription
  useEffect(() => {
    if (!user?.id) {
      setNotifications([]);
      return;
    }

    fetchNotifications();

    const channel = getSupabase()
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotif = rowToNotification(payload.new as Record<string, unknown>);
          setNotifications((prev) => [newNotif, ...prev].slice(0, 30));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          const updated = rowToNotification(payload.new as Record<string, unknown>);
          setNotifications((prev) =>
            prev.map((n) => (n.id === updated.id ? updated : n))
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((prev) =>
            prev.filter((n) => n.id !== (payload.old as Record<string, unknown>)?.id)
          );
        }
      )
      .subscribe();

    return () => {
      getSupabase().removeChannel(channel);
    };
  }, [user?.id, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  };
}
