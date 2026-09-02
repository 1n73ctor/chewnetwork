'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AdminLayout } from '../certificates/page';
import { createClient } from '@/lib/supabase/client';
import { adminService, investorService } from '@/lib/services/investorService';
import { Cog6ToothIcon, CheckIcon, XMarkIcon, ShieldCheckIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

export default function AdminSettingsPage() {
  const { isAdmin, loading, user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'account' | 'security' | 'portal'>('account');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });
  const [portalForm, setPortalForm] = useState({
    portalName: '',
    supportEmail: '',
    maintenanceMode: false,
    maintenanceMessage: '',
    allowNewRegistrations: false,
  });
  const [portalLoading, setPortalLoading] = useState(true);
  const [portalError, setPortalError] = useState('');

  useEffect(() => {
    if (!loading && !isAdmin) router.push('/');
  }, [isAdmin, loading]);

  // These used to be hardcoded defaults in state, so the form showed values
  // that had nothing to do with what the portal was actually doing.
  useEffect(() => {
    if (!isAdmin) return;
    investorService.getPortalSettings().then((data) => {
      if (data) {
        setPortalForm({
          portalName: data.portalName,
          supportEmail: data.supportEmail,
          maintenanceMode: data.maintenanceMode,
          maintenanceMessage: data.maintenanceMessage,
          allowNewRegistrations: data.allowNewRegistrations,
        });
      } else {
        // Better than a silently blank form, which would look editable and
        // then save nothing.
        setPortalError('Portal settings could not be loaded. Check that the portal_settings migration has been applied.');
      }
      setPortalLoading(false);
    });
  }, [isAdmin]);

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
    const supabase = createClient();
    const { error: pwError } = await supabase.auth.updateUser({ password: passwordForm.newPassword });
    if (pwError) {
      setError(pwError.message);
    } else {
      await adminService.createAuditLog('ADMIN_PASSWORD_CHANGED', undefined, undefined, { admin: user?.email });
      setSuccess('Password updated successfully.');
      setPasswordForm({ newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    }
    setSaving(false);
  };

  const handleSavePortalSettings = async () => {
    setSaving(true);
    setError('');
    const ok = await adminService.updatePortalSettings(portalForm);
    if (!ok) {
      setError('Could not save portal settings. Please try again.');
      setSaving(false);
      return;
    }
    await adminService.createAuditLog('PORTAL_SETTINGS_UPDATED', undefined, undefined, { settings: portalForm });
    setSuccess(
      portalForm.maintenanceMode
        ? 'Settings saved. The portal is now in maintenance mode — investors are being shown the maintenance page.'
        : 'Portal settings saved successfully.'
    );
    setTimeout(() => setSuccess(''), 5000);
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!isAdmin) return null;

  const tabs = [
    { id: 'account' as const, label: 'Account', icon: <Cog6ToothIcon className="w-4 h-4" /> },
    { id: 'security' as const, label: 'Security', icon: <ShieldCheckIcon className="w-4 h-4" /> },
    { id: 'portal' as const, label: 'Portal Config', icon: <GlobeAltIcon className="w-4 h-4" /> },
  ];

  return (
    <AdminLayout activeId="settings">
      <div className="p-4 lg:p-6 max-w-2xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Cog6ToothIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold">Admin Settings</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Manage admin account and portal configuration</p>
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
              <span className="hidden sm:inline">{tab.label}</span>
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

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h2 className="text-white font-bold text-sm">Admin Account Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Email', value: user?.email || '—' },
                { label: 'Role', value: 'Super Admin' },
                { label: 'Account Created', value: user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—' },
                { label: 'Last Sign In', value: user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : '—' },
              ].map((field, i) => (
                <div key={i} className="bg-background rounded-xl p-3 border border-border/50">
                  <p className="text-xs text-muted-foreground font-semibold tracking-widest mb-1">{field.label.toUpperCase()}</p>
                  <p className="text-white text-sm font-medium">{field.value}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4">
              <h3 className="text-white font-semibold text-sm mb-2">Session Information</h3>
              <div className="space-y-2">
                {[
                  'Admin sessions are protected by Supabase row-level security',
                  'All admin actions are recorded in the audit log',
                  'Session tokens expire automatically after inactivity',
                  'Admin access is restricted to users with the admin role',
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

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h2 className="text-white font-bold text-sm">Change Admin Password</h2>
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
          </div>
        )}

        {/* Portal Config Tab */}
        {activeTab === 'portal' && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h2 className="text-white font-bold text-sm">Portal Configuration</h2>

            {portalError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{portalError}</p>
              </div>
            )}

            {portalForm.maintenanceMode && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
                <p className="text-amber-300 text-sm font-semibold mb-0.5">Maintenance mode is on</p>
                <p className="text-amber-300/80 text-xs leading-relaxed">
                  Investors are shown the maintenance page and cannot sign in. Admins are unaffected,
                  so you can always come back here to switch it off.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Portal Name</label>
                <input
                  type="text"
                  value={portalForm.portalName}
                  onChange={(e) => setPortalForm({ ...portalForm, portalName: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Support Email</label>
                <input
                  type="email"
                  value={portalForm.supportEmail}
                  onChange={(e) => setPortalForm({ ...portalForm, supportEmail: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-3 pt-2 border-t border-border">
                <h3 className="text-white font-semibold text-sm">Portal Toggles</h3>
                {[
                  { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Temporarily disable investor access to the portal' },
                  { key: 'allowNewRegistrations', label: 'Allow New Registrations', desc: 'Allow new investors to self-register via the portal' },
                ].map((toggle) => (
                  <div key={toggle.key} className="flex items-center justify-between bg-background rounded-xl p-4 border border-border/50">
                    <div>
                      <p className="text-white text-sm font-medium">{toggle.label}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">{toggle.desc}</p>
                    </div>
                    <button
                      onClick={() => setPortalForm({ ...portalForm, [toggle.key]: !(portalForm as any)[toggle.key] })}
                      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${(portalForm as any)[toggle.key] ? 'bg-primary' : 'bg-border'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${(portalForm as any)[toggle.key] ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                ))}

                {portalForm.maintenanceMode && (
                  <div>
                    <label className="text-xs text-muted-foreground font-medium mb-1.5 block">
                      Message shown to investors
                    </label>
                    <textarea
                      value={portalForm.maintenanceMessage}
                      onChange={(e) => setPortalForm({ ...portalForm, maintenanceMessage: e.target.value })}
                      rows={3}
                      placeholder="The investor portal is temporarily unavailable while we carry out scheduled maintenance. Please check back shortly."
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors resize-y"
                    />
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleSavePortalSettings}
              disabled={saving || portalLoading || Boolean(portalError)}
              className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
            >
              {portalLoading ? 'Loading...' : saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
