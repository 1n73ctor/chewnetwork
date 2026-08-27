'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AppLogo from '@/components/ui/AppLogo';
import { resolveLandingPathForUser } from '@/lib/authRedirect';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

/**
 * The investor back-office sign-in, carried over from the portal app. It is dark
 * by design in both themes, so it pins the portal's own palette (navy #0D0D1B,
 * orange #F97316) rather than using the site's theme tokens, which would invert
 * this white text on the public site's light theme.
 */

const FIELD =
  'w-full bg-[#0D0D1B] border border-[#1F1F2E] rounded-xl pl-10 py-3 text-white text-sm placeholder:text-[#9CA3AF]/50 focus:outline-none focus:border-[#F97316] transition-colors';

// ?next= is set by the middleware when it bounces an anonymous visitor off a portal page.
const getNextPath = () =>
  typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('next');

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Set by the auto-logout in AuthContext, so an unexpected sign-out is explained.
  const [signedOutReason, setSignedOutReason] = useState<'idle' | 'max-session' | null>(null);
  const { signIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const reason = new URLSearchParams(window.location.search).get('reason');
    if (reason === 'idle' || reason === 'max-session') setSignedOutReason(reason);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await signIn(email, password);
      const { createClient } = await import('@/lib/supabase/client');
      const landing = getNextPath() ?? await resolveLandingPathForUser(createClient(), data?.user);
      router.push(landing);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D1B] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #F97316 0%, transparent 70%)' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <AppLogo size={48} />
            <div className="text-left">
              <div className="text-white font-extrabold text-2xl tracking-widest leading-tight">CHEW</div>
              <div className="text-white font-extrabold text-2xl tracking-widest leading-tight">NETWORK</div>
            </div>
          </div>
          <p className="text-[#F97316] text-sm font-semibold tracking-widest">INVESTOR BACK OFFICE</p>
          <p className="text-[#9CA3AF] text-xs mt-1">See It. Cook It. Own the Future.</p>
        </div>

        {/* Card */}
        <div className="bg-[#13131F] border border-[#1F1F2E] rounded-2xl p-8 shadow-2xl">
          <h2 className="text-white text-xl font-bold mb-1">Welcome Back</h2>
          <p className="text-[#9CA3AF] text-sm mb-6">Sign in to your investor portal</p>

          {signedOutReason && (
            <div className="bg-[#F97316]/10 border border-[#F97316]/30 rounded-xl px-4 py-3 mb-5">
              <p className="text-[#F97316] text-sm">
                {signedOutReason === 'idle'
                  ? 'You were signed out after 30 minutes of inactivity. Please sign in again.'
                  : 'Your session reached its 24-hour limit. Please sign in again.'}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-xs text-[#9CA3AF] font-medium mb-1.5 block">Email Address</label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className={`${FIELD} pr-4`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-[#9CA3AF] font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`${FIELD} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F97316] hover:bg-[#F97316]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all text-sm tracking-wide"
            >
              {loading ? 'Signing In...' : 'Sign In to Portal'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#9CA3AF] mt-6">
          This portal is exclusively for authorized Chew Network investors.
        </p>
      </div>
    </div>
  );
}
