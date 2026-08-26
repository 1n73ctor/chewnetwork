'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminService, investorService } from '@/lib/services/investorService';
import { AdminLayout } from '../certificates/page';
import { CheckIcon } from '@heroicons/react/24/outline';

export default function AdminHotlinePage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hours, setHours] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !isAdmin) router?.push('/');
  }, [isAdmin, loading]);

  useEffect(() => {
    if (isAdmin) {
      investorService?.getHotlineSettings()?.then((data) => {
        if (data) { setPhoneNumber(data?.phoneNumber); setHours(data?.hours); }
      });
    }
  }, [isAdmin]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    const ok = await adminService?.updateHotlineSettings(phoneNumber, hours);
    if (ok) {
      await adminService?.createAuditLog('HOTLINE_SETTINGS_UPDATED', undefined, undefined, { phoneNumber, hours });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError('Failed to update hotline settings.');
    }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!isAdmin) return null;

  return (
    <AdminLayout activeId="hotline">
      <div className="p-4 lg:p-6 max-w-xl space-y-4">
        <div>
          <h1 className="text-white text-2xl font-bold">Hotline Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Update the private investor hotline number and hours</p>
        </div>

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 flex items-center gap-2">
            <CheckIcon className="w-4 h-4 text-green-400" /><p className="text-green-400 text-sm">Hotline settings updated successfully.</p>
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e?.target?.value)}
              placeholder="+1-800-CHEW-NET"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Hours</label>
            <input
              type="text"
              value={hours}
              onChange={(e) => setHours(e?.target?.value)}
              placeholder="Monday – Friday, 9:00 AM – 6:00 PM EST"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white py-3 rounded-xl text-sm font-bold transition-all"
          >
            {saving ? 'Saving...' : 'Save Hotline Settings'}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
