'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/portal/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { investorService } from '@/lib/services/investorService';
import { UserGroupIcon, PencilSquareIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function BeneficiaryInfoPage() {
  const { investorProfile, refreshInvestorProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    beneficiaryName: '',
    beneficiaryRelationship: '',
    beneficiaryEmail: '',
    beneficiaryPhone: '',
    beneficiaryAddress: '',
  });

  useEffect(() => {
    if (investorProfile) {
      setForm({
        beneficiaryName: investorProfile.beneficiaryName || '',
        beneficiaryRelationship: investorProfile.beneficiaryRelationship || '',
        beneficiaryEmail: investorProfile.beneficiaryEmail || '',
        beneficiaryPhone: investorProfile.beneficiaryPhone || '',
        beneficiaryAddress: investorProfile.beneficiaryAddress || '',
      });
    }
  }, [investorProfile]);

  const handleSave = async () => {
    if (!investorProfile?.id) return;
    setSaving(true);
    setError('');
    const ok = await investorService.updateBeneficiary(investorProfile.id, form);
    if (ok) {
      await refreshInvestorProfile();
      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError('Failed to update beneficiary. Please try again.');
    }
    setSaving(false);
  };

  const hasBeneficiary = !!(investorProfile?.beneficiaryName);

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold">Beneficiary Info</h1>
            <p className="text-muted-foreground text-sm mt-1">Designate your Ecosystem Stake beneficiary</p>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
            >
              <PencilSquareIcon className="w-4 h-4" />
              {hasBeneficiary ? 'Update Beneficiary' : 'Add Beneficiary'}
            </button>
          )}
        </div>

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 flex items-center gap-2">
            <CheckIcon className="w-4 h-4 text-green-400" />
            <p className="text-green-400 text-sm">Beneficiary information updated successfully.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Current info */}
        {!editing ? (
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <UserGroupIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-white font-bold">Designated Beneficiary</h3>
                <p className="text-muted-foreground text-xs">For Investor {investorProfile?.investorId || '—'}</p>
              </div>
            </div>

            {hasBeneficiary ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', value: investorProfile?.beneficiaryName },
                  { label: 'Relationship', value: investorProfile?.beneficiaryRelationship },
                  { label: 'Email', value: investorProfile?.beneficiaryEmail },
                  { label: 'Phone', value: investorProfile?.beneficiaryPhone },
                  { label: 'Address', value: investorProfile?.beneficiaryAddress },
                  { label: 'Last Updated', value: investorProfile?.beneficiaryUpdatedAt ? new Date(investorProfile.beneficiaryUpdatedAt).toLocaleDateString() : '—' },
                ].map((field, i) => (
                  <div key={i} className="border-b border-border/30 pb-3">
                    <p className="text-xs text-muted-foreground font-semibold tracking-widest mb-1">{field.label.toUpperCase()}</p>
                    <p className="text-white text-sm">{field.value || '—'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <UserGroupIcon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-white font-semibold mb-1">No Beneficiary Designated</p>
                <p className="text-muted-foreground text-sm">Click &quot;Add Beneficiary&quot; to designate a beneficiary for your Ecosystem Stakes.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-white font-bold mb-4">Update Beneficiary Information</h3>
            <div className="space-y-4">
              {[
                { key: 'beneficiaryName', label: 'Full Name', placeholder: 'Jane Doe', type: 'text' },
                { key: 'beneficiaryRelationship', label: 'Relationship', placeholder: 'Spouse, Child, etc.', type: 'text' },
                { key: 'beneficiaryEmail', label: 'Email Address', placeholder: 'jane@example.com', type: 'email' },
                { key: 'beneficiaryPhone', label: 'Phone Number', placeholder: '+1-555-0100', type: 'tel' },
                { key: 'beneficiaryAddress', label: 'Address', placeholder: '123 Main St, City, State, ZIP', type: 'text' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">{field.label}</label>
                  <input
                    type={field.type}
                    value={(form as any)[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-2 bg-background border border-border hover:border-primary/50 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex-1 justify-center"
              >
                <XMarkIcon className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 justify-center"
              >
                <CheckIcon className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Beneficiary'}
              </button>
            </div>
          </div>
        )}

        {/* Legal notice */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <p className="text-amber-300/80 text-xs leading-relaxed">
            <strong className="text-amber-300">Important Notice:</strong> Recording beneficiary information here does not automatically transfer ownership of Ecosystem Stakes. Legal ownership transfers remain controlled by Chew Network&apos;s official documents and records. This information is recorded for reference purposes only.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
