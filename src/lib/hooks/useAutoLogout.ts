'use client';

import { useEffect, useRef } from 'react';

/**
 * Signs a user out after a period of inactivity, and again at a hard ceiling no
 * amount of activity can extend.
 *
 * Both deadlines live in localStorage rather than in memory, for two reasons:
 * a reload must not hand the user a fresh 30 minutes, and two open tabs must
 * share one clock instead of each keeping its own.
 */

export const IDLE_LIMIT_MS = 30 * 60 * 1000; // 30 minutes without interaction
export const SESSION_LIMIT_MS = 24 * 60 * 60 * 1000; // 24 hours since sign-in

const LAST_ACTIVITY_KEY = 'cn.auth.lastActivityAt';
const SESSION_START_KEY = 'cn.auth.sessionStartedAt';

/** localStorage throws in some privacy modes; never let that break auth. */
const readStamp = (key: string): number | null => {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
};

const writeStamp = (key: string, value: number): void => {
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    /* ignore */
  }
};

export const clearAutoLogoutStamps = (): void => {
  try {
    window.localStorage.removeItem(LAST_ACTIVITY_KEY);
    window.localStorage.removeItem(SESSION_START_KEY);
  } catch {
    /* ignore */
  }
};

const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'touchstart', 'scroll', 'click'] as const;

// Writing on every mousemove would hammer localStorage; once every 15s is
// plenty when the shortest deadline is 30 minutes.
const WRITE_THROTTLE_MS = 15 * 1000;
const CHECK_INTERVAL_MS = 30 * 1000;

export function useAutoLogout(enabled: boolean, onExpire: (reason: 'idle' | 'max-session') => void) {
  // Kept in a ref so re-renders don't tear down the listeners below.
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const firedRef = useRef(false);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    firedRef.current = false;
    const now = Date.now();

    // Start the session clock once, and keep it across reloads.
    if (readStamp(SESSION_START_KEY) === null) writeStamp(SESSION_START_KEY, now);
    if (readStamp(LAST_ACTIVITY_KEY) === null) writeStamp(LAST_ACTIVITY_KEY, now);

    let lastWrite = 0;
    const markActivity = () => {
      const stamp = Date.now();
      if (stamp - lastWrite < WRITE_THROTTLE_MS) return;
      lastWrite = stamp;
      writeStamp(LAST_ACTIVITY_KEY, stamp);
    };

    const check = () => {
      if (firedRef.current) return;
      const stamp = Date.now();
      const lastActivity = readStamp(LAST_ACTIVITY_KEY) ?? stamp;
      const sessionStart = readStamp(SESSION_START_KEY) ?? stamp;

      if (stamp - sessionStart >= SESSION_LIMIT_MS) {
        firedRef.current = true;
        onExpireRef.current('max-session');
        return;
      }
      if (stamp - lastActivity >= IDLE_LIMIT_MS) {
        firedRef.current = true;
        onExpireRef.current('idle');
      }
    };

    const onVisible = () => {
      // A tab left in the background gets no timer ticks, so re-check on return
      // before treating the visit itself as activity.
      if (document.visibilityState === 'visible') {
        check();
        markActivity();
      }
    };

    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, markActivity, { passive: true })
    );
    document.addEventListener('visibilitychange', onVisible);
    const timer = window.setInterval(check, CHECK_INTERVAL_MS);

    check(); // catch a session that already expired while the tab was closed

    return () => {
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, markActivity));
      document.removeEventListener('visibilitychange', onVisible);
      window.clearInterval(timer);
    };
  }, [enabled]);
}
