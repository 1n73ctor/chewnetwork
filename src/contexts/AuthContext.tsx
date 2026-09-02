'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { getClient } from '@/lib/supabase/client';
import { investorService, type Investor } from '@/lib/services/investorService';
import { isAdminUser } from '@/lib/authRedirect';
import { useAutoLogout, clearAutoLogoutStamps } from '@/lib/hooks/useAutoLogout';
import { BLOCKED_MESSAGE, BLOCKED_REASON, MAINTENANCE_MESSAGE, isAccountActive } from '@/lib/accountStatus';

interface AuthContextType {
  user: any;
  session: any;
  loading: boolean;
  /** Investor record for the signed-in user, or null for public/non-investor accounts. */
  investorProfile: Investor | null;
  isAdmin: boolean;
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<any>;
  isEmailVerified: () => boolean;
  getUserProfile: () => Promise<any>;
  refreshInvestorProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

/**
 * Records the sign-in in the audit log. The route reads the client IP from the
 * edge headers, which is the only place it can be learned honestly — the
 * browser has no idea what its own public address is.
 *
 * Fire-and-forget on purpose: a failed audit write must never block a login.
 */
/**
 * Records a rejected sign-in. Separate from the success path because there is
 * no session to authenticate with — the attempt is the thing that failed — so
 * the attempt is keyed on the email that was tried instead.
 */
const recordFailedLogin = (email: string, reason: string) => {
  void fetch('/api/auth/login-failed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, reason }),
  }).catch(() => {});
};

const recordLoginEvent = (accessToken?: string) => {
  void fetch('/api/auth/login-log', {
    method: 'POST',
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  }).catch(() => {});
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [investorProfile, setInvestorProfile] = useState<Investor | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  // Lazy: building the client in the render body also ran it during
  // prerendering, where NEXT_PUBLIC_* may be missing, which failed the build.
  const clientRef = useRef<ReturnType<typeof getClient> | null>(null);
  const getSupabase = () => (clientRef.current ??= getClient());

  // Guards against a second sign-out firing while the first is still in flight
  // — the realtime handler and the initial load can both notice at once.
  const signingOutRef = useRef(false);

  /** Drops the session everywhere and lands on the login page with the reason. */
  const forceSignOut = (reason: string) => {
    if (signingOutRef.current) return;
    signingOutRef.current = true;
    clearAutoLogoutStamps();
    getSupabase()
      .auth.signOut({ scope: 'global' })
      .catch(() => {})
      .finally(() => {
        if (typeof window === 'undefined') return;
        // Already on /login (a blocked sign-in attempt) — the form shows the
        // message itself, so navigating would only wipe it.
        if (window.location.pathname === '/login') {
          signingOutRef.current = false;
          return;
        }
        window.location.href = `/login?reason=${reason}`;
      });
  };

  const loadInvestorProfile = async () => {
    try {
      const profile = await investorService.getMyInvestorProfile();
      setInvestorProfile(profile);
      // An admin deactivating someone has to reach the tab they already have
      // open, not just their next sign-in. This runs on load and again on every
      // realtime change to their investors row.
      if (profile && !isAccountActive(profile.accountStatus)) forceSignOut(BLOCKED_REASON);
    } catch {
      setInvestorProfile(null);
    }
  };

  const applySession = (session: any) => {
    setSession(session);
    setUser(session?.user ?? null);
    if (session?.user) {
      setIsAdmin(isAdminUser(session.user));
      loadInvestorProfile();
    } else {
      setInvestorProfile(null);
      setIsAdmin(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Get initial session
    getSupabase().auth.getSession().then(({ data: { session } }) => applySession(session));

    // Listen for auth changes
    const {
      data: { subscription }
    } = getSupabase().auth.onAuthStateChange((_event, session) => applySession(session));

    return () => subscription.unsubscribe();
  }, []);

  // Real-time subscription: refresh investor profile when the investor row changes
  useEffect(() => {
    if (!user) return;

    const channel = getSupabase()
      .channel('auth-investor-profile')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'investors', filter: `user_id=eq.${user.id}` },
        () => { loadInvestorProfile(); }
      )
      // Maintenance mode flipping should reach an open tab straight away, not
      // at the next poll. Admins stay put — they are the ones toggling it.
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'portal_settings' },
        (payload) => {
          const on = (payload.new as { maintenance_mode?: boolean })?.maintenance_mode;
          if (on && !isAdminUser(user) && window.location.pathname !== '/maintenance') {
            window.location.href = '/maintenance';
          }
        }
      )
      .subscribe();

    return () => { getSupabase().removeChannel(channel); };
  }, [user?.id]);

  // Fallback for the tab that just sits there. The middleware re-checks status
  // on every portal navigation and realtime covers the rest, but a page left
  // open navigates nowhere and realtime can drop its socket — so poll, and
  // check again whenever the tab is brought back to the front.
  useEffect(() => {
    if (!user || isAdmin) return;

    const check = async () => {
      if (document.visibilityState === 'hidden' || signingOutRef.current) return;

      // Maintenance switched on while they had the portal open. Their session
      // stays valid — they are not in trouble, the portal is — so send them to
      // the maintenance page rather than signing them out.
      const settings = await investorService.getPortalSettings();
      if (settings?.maintenanceMode && window.location.pathname !== '/maintenance') {
        window.location.href = '/maintenance';
        return;
      }

      const status = await investorService.getMyAccountStatus();
      if (status !== null && !isAccountActive(status)) forceSignOut(BLOCKED_REASON);
    };

    const interval = setInterval(check, 60_000);
    document.addEventListener('visibilitychange', check);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', check);
    };
  }, [user?.id, isAdmin]);

  // Email/Password Sign Up
  const signUp = async (email: string, password: string, metadata: Record<string, unknown> = {}) => {
    const { data, error } = await getSupabase().auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: (metadata?.fullName as string) || (metadata?.first_name as string) || '',
          first_name: (metadata?.first_name as string) || '',
          avatar_url: (metadata?.avatarUrl as string) || '',
          account_type: (metadata?.account_type as string) || 'food-lover',
          country: (metadata?.country as string) || '',
          skill_level: (metadata?.skill_level as string) || '',
          chef_pepe_mode: (metadata?.chef_pepe_mode as string) || 'beginner',
          dietary_preferences: (metadata?.dietary_preferences as string) || '',
          goals: metadata?.goals || [],
          favourite_cuisines: metadata?.favourite_cuisines || [],
          marketing_consent: metadata?.marketing_consent || false,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;
    return data;
  };

  // Email/Password Sign In
  const signIn = async (email: string, password: string) => {
    const { data, error } = await getSupabase().auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      recordFailedLogin(email, 'invalid_credentials');
      throw error;
    }

    // The password is still correct for a deactivated investor — Supabase has
    // no opinion on account_status — so the block is enforced here, before the
    // session is handed back to the caller to route on.
    if (!isAdminUser(data?.user)) {
      // The portal being closed is checked first: it is the broader refusal,
      // and it applies whatever the state of this particular account.
      const settings = await investorService.getPortalSettings();
      if (settings?.maintenanceMode) {
        await getSupabase().auth.signOut({ scope: 'global' }).catch(() => {});
        throw new Error(settings.maintenanceMessage || MAINTENANCE_MESSAGE);
      }

      const status = await investorService.getMyAccountStatus();
      if (status !== null && !isAccountActive(status)) {
        // Right credentials, refused account — worth logging as an attempt, and
        // distinguishable from a wrong password by its reason.
        recordFailedLogin(email, 'account_blocked');
        await getSupabase().auth.signOut({ scope: 'global' }).catch(() => {});
        throw new Error(BLOCKED_MESSAGE);
      }
    }

    recordLoginEvent(data?.session?.access_token);
    return data;
  };

  // Sign Out
  const signOut = async () => {
    // Cleared first so a failed sign-out can't leave a stale clock behind that
    // would expire the next session early.
    clearAutoLogoutStamps();
    const { error } = await getSupabase().auth.signOut();
    if (error) throw error;
  };

  // Idle and absolute session limits. Sends the user to the login page with a
  // note about why, rather than dropping them somewhere with no explanation.
  useAutoLogout(Boolean(user), (reason) => {
    clearAutoLogoutStamps();
    getSupabase()
      .auth.signOut()
      .finally(() => {
        if (typeof window !== 'undefined') {
          window.location.href = `/login?reason=${reason}`;
        }
      });
  });

  // Get Current User
  const getCurrentUser = async () => {
    const { data: { user }, error } = await getSupabase().auth.getUser();
    if (error) throw error;
    return user;
  };

  // Check if Email is Verified
  const isEmailVerified = () => {
    return user?.email_confirmed_at !== null;
  };

  // Get User Profile from Database
  const getUserProfile = async () => {
    if (!user) return null;
    const { data, error } = await getSupabase()
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) throw error;
    return data;
  };

  const refreshInvestorProfile = async () => {
    await loadInvestorProfile();
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    investorProfile,
    isAdmin,
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    isEmailVerified,
    getUserProfile,
    refreshInvestorProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
