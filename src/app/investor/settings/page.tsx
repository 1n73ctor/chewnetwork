'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/portal/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { investorService } from '@/lib/services/investorService';
import { Cog6ToothIcon, UserCircleIcon, BellIcon, ShieldCheckIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const { investorProfile, user, refreshInvestorProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (investorProfile) {
      setProfileForm({
        firstName: investorProfile.firstName || '',
        lastName: investorProfile.lastName || '',
        phone: investorProfile.phone || '',
      });
    }
  }, [investorProfile]);

  const handleSaveProfile = async () => {
    if (!investorProfile?.id) return;
    setSaving(true);
    setError('');
    setSuccess('');
    const ok = await investorService.updateInvestorContact(investorProfile.id, {
      phone: profileForm.phone,
    });
    if (ok) {
      await refreshInvestorProfile();
      setSuccess('Profile updated successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError('Failed to update profile. Please try again.');
    }
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    const supabase = createClient();
    const { error: pwError } = await supabase.auth.updateUser({ password: passwordForm.newPassword });
    if (pwError) {
      setError(pwError.message);
    } else {
      setSuccess('Password updated successfully.');
      setPasswordForm({ newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    }
    setSaving(false);
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: <UserCircleIcon className="w-4 h-4" /> },
    { id: 'security' as const, label: 'Security', icon: <ShieldCheckIcon className="w-4 h-4" /> },
    { id: 'notifications' as const, label: 'Notifications', icon: <BellIcon className="w-4 h-4" /> },
  ];

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Cog6ToothIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Manage your account preferences</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-card border border-border rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSuccess(''); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-primary text-white' : 'text-muted-foreground hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Feedback */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 flex items-center gap-2">
            <CheckIcon className="w-4 h-4 text-green-400" />
            <p className="text-green-400 text-sm">{success}</p>
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-center gap-2">
            <XMarkIcon className="w-4 h-4 text-red-400" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h2 className="text-white font-bold text-sm">Account Information</h2>

            {/* Read-only fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Investor ID', value: investorProfile?.investorId || '—' },
                { label: 'Certificate Number', value: investorProfile?.certificateNumber || '—' },
                { label: 'Email', value: user?.email || '—' },
                { label: 'Account Status', value: investorProfile?.accountStatus?.toUpperCase() || '—' },
                { label: 'Round', value: investorProfile?.round || '—' },
                { label: 'Join Date', value: investorProfile?.joinDate ? new Date(investorProfile.joinDate).toLocaleDateString() : '—' },
              ].map((field, i) => (
                <div key={i} className="bg-background rounded-xl p-3 border border-border/50">
                  <p className="text-xs text-muted-foreground font-semibold tracking-widest mb-1">{field.label.toUpperCase()}</p>
                  <p className="text-white text-sm font-medium">{field.value}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="text-white font-semibold text-sm mb-3">Update Contact Info</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">First Name</label>
                  <input
                    type="text"
                    value={profileForm.firstName}
                    disabled
                    className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-muted-foreground text-sm cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Name changes require admin approval. Contact investor support.</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Last Name</label>
                  <input
                    type="text"
                    value={profileForm.lastName}
                    disabled
                    className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-muted-foreground text-sm cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Phone Number</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+1-555-0100"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="mt-4 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h2 className="text-white font-bold text-sm">Change Password</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Re-enter new password"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
            <button
              onClick={handleChangePassword}
              disabled={saving || !passwordForm.newPassword}
              className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
            >
              {saving ? 'Updating...' : 'Update Password'}
            </button>

            <div className="border-t border-border pt-4">
              <h3 className="text-white font-semibold text-sm mb-2">Security Information</h3>
              <div className="space-y-2">
                {[
                  'Your session automatically expires after inactivity',
                  'All login attempts are logged for security',
                  'Your data is encrypted and protected by row-level security',
                  'Only you can access your investment information',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckIcon className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground text-xs">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h2 className="text-white font-bold text-sm">Notification Preferences</h2>
            <p className="text-muted-foreground text-sm">
              Investor updates and reports are published to your dashboard. Email and SMS notifications are managed by Chew Network administration.
            </p>
            <div className="space-y-3">
              {[
                { label: 'Dashboard Updates', desc: 'New investor updates appear on your dashboard', enabled: true },
                { label: 'Email Notifications', desc: 'Receive email when new updates are published', enabled: true },
                { label: 'SMS Notifications', desc: 'Receive SMS alerts for important announcements', enabled: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-background rounded-xl border border-border/50">
                  <div>
                    <p className="text-white text-sm font-medium">{item.label}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{item.desc}</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-all ${item.enabled ? 'bg-primary justify-end' : 'bg-border justify-start'}`}>
                    <div className="w-4 h-4 rounded-full bg-white" />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">To change notification preferences, contact the Investor Hotline.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
