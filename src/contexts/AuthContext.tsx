'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { getClient } from '@/lib/supabase/client';
import { investorService, type Investor } from '@/lib/services/investorService';
import { isAdminUser } from '@/lib/authRedirect';

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

  const loadInvestorProfile = async () => {
    try {
      setInvestorProfile(await investorService.getMyInvestorProfile());
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
      .subscribe();

    return () => { getSupabase().removeChannel(channel); };
  }, [user?.id]);

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
    if (error) throw error;
    return data;
  };

  // Sign Out
  const signOut = async () => {
    const { error } = await getSupabase().auth.signOut();
    if (error) throw error;
  };

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
