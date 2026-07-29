'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useNotifications, Notification } from '@/lib/hooks/useNotifications';
import Icon from '@/components/ui/AppIcon';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function notifIcon(type: Notification['notificationType']): string {
  switch (type) {
    case 'new_follower': return 'UserPlusIcon';
    case 'recipe_saved': return 'BookmarkIcon';
    case 'comment': return 'ChatBubbleLeftIcon';
    default: return 'BellIcon';
  }
}

function notifColor(type: Notification['notificationType']): string {
  switch (type) {
    case 'new_follower': return 'text-violet-500 bg-violet-50';
    case 'recipe_saved': return 'text-amber-500 bg-amber-50';
    case 'comment': return 'text-emerald-500 bg-emerald-50';
    default: return 'text-primary bg-primary/10';
  }
}

export default function NotificationBell({ scrolled }: { scrolled: boolean }) {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleNotifClick = (n: Notification) => {
    if (!n.isRead) markAsRead(n.id);
  };

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        className={`relative p-2 rounded-full transition-all duration-200 hover:bg-white/10 ${
          scrolled ? 'text-foreground hover:bg-muted' : 'text-white/90 hover:text-white'
        }`}
      >
        <Icon name="BellIcon" size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-border z-50 overflow-hidden"
          role="dialog"
          aria-label="Notifications panel"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="font-semibold text-foreground text-sm">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary hover:underline font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-border">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
                <Icon name="BellSlashIcon" size={28} />
                <p className="text-sm">No notifications yet</p>
              </div>
            )}

            {!loading && notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => handleNotifClick(n)}
                className={`w-full text-left flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50 ${
                  !n.isRead ? 'bg-primary/5' : ''
                }`}
              >
                {/* Icon */}
                <span className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${notifColor(n.notificationType)}`}>
                  <Icon name={notifIcon(n.notificationType)} size={16} />
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-snug ${!n.isRead ? 'font-semibold text-foreground' : 'text-foreground/80'}`}>
                    {n.title}
                  </p>
                  {n.body && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{n.body}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{timeAgo(n.createdAt)}</p>
                </div>

                {/* Unread dot */}
                {!n.isRead && (
                  <span className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
