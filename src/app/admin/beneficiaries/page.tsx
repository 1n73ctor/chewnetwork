'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminService, type Investor } from '@/lib/services/investorService';
import { AdminLayout } from '../certificates/page';
import { MagnifyingGlassIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function AdminBeneficiariesPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [editForm, setEditForm] = useState({
    beneficiaryName: '',
    beneficiaryRelationship: '',
    beneficiaryEmail: '',
    beneficiaryPhone: '',
    beneficiaryAddress: '',
  });

  useEffect(() => {
    if (!loading && !isAdmin) router.push('/');
  }, [isAdmin, loading]);

  useEffect(() => {
    if (isAdmin) {
      adminService.getAllInvestors().then((data) => { setInvestors(data); setDataLoading(false); });
    }
  }, [isAdmin]);

  const withBeneficiary = investors.filter((inv) => inv.beneficiaryName);
  const withoutBeneficiary = investors.filter((inv) => !inv.beneficiaryName);

  const filtered = (withBeneficiary.concat(withoutBeneficiary)).filter((inv) => {
    const q = search.toLowerCase();
    return !q || inv.firstName?.toLowerCase().includes(q) || inv.lastName?.toLowerCase().includes(q) ||
      inv.investorId?.toLowerCase().includes(q) || inv.beneficiaryName?.toLowerCase().includes(q);
  });

  const openEdit = (inv: Investor) => {
    setEditingId(inv.id);
    setEditForm({
      beneficiaryName: inv.beneficiaryName || '',
      beneficiaryRelationship: inv.beneficiaryRelationship || '',
      beneficiaryEmail: inv.beneficiaryEmail || '',
      beneficiaryPhone: inv.beneficiaryPhone || '',
      beneficiaryAddress: inv.beneficiaryAddress || '',
    });
  };

  const handleSave = async (inv: Investor) => {
    setSaving(true);
    const supabase = (await import('@/lib/supabase/client')).createClient();
    const { error } = await supabase
      .from('investors')
      .update({
        beneficiary_name: editForm.beneficiaryName,
        beneficiary_relationship: editForm.beneficiaryRelationship,
        beneficiary_email: editForm.beneficiaryEmail,
        beneficiary_phone: editForm.beneficiaryPhone,
        beneficiary_address: editForm.beneficiaryAddress,
        beneficiary_updated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', inv.id);

    if (!error) {
      await adminService.createAuditLog('Beneficiary Updated', inv.id,
        { beneficiaryName: inv.beneficiaryName },
        { beneficiaryName: editForm.beneficiaryName, relationship: editForm.beneficiaryRelationship }
      );
      const updated = await adminService.getAllInvestors();
      setInvestors(updated);
      setEditingId(null);
      setSuccessMsg('Beneficiary information updated successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!isAdmin) return null;

  return (
    <AdminLayout activeId="beneficiaries">
      <div className="p-4 lg:p-6 space-y-5">
        <div>
          <h1 className="text-white text-2xl font-bold">Beneficiaries</h1>
          <p className="text-muted-foreground text-sm mt-1">View and edit beneficiary designations for all investors</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Total Investors', value: investors.length },
            { label: 'With Beneficiary', value: withBeneficiary.length },
            { label: 'Without Beneficiary', value: withoutBeneficiary.length },
          ].map((stat, i) => (
            <div key={i} className="stat-card">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-white font-bold text-xl">{stat.value}</p>
            </div>
          ))}
        </div>

        {successMsg && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 flex items-center gap-2">
            <CheckIcon className="w-4 h-4 text-green-400" />
            <p className="text-green-400 text-sm">{successMsg}</p>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by investor name, ID, or beneficiary name..."
            className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
          />
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {dataLoading ? (
            <div className="p-4 space-y-3">{[1,2,3].map(i => <div key={i} className="animate-pulse h-12 bg-border/30 rounded" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center"><p className="text-muted-foreground text-sm">No investors found.</p></div>
          ) : (
            <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
              <table className="min-w-full w-max text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">Investor ID</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">Investor Name</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">Beneficiary Name</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">Relationship</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">Email</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">Phone</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">Last Updated</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inv) => (
                    <React.Fragment key={inv.id}>
                      <tr className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                        <td className="px-4 py-3 text-primary font-bold text-xs">{inv.investorId}</td>
                        <td className="px-4 py-3 text-white text-sm">{inv.firstName} {inv.lastName}</td>
                        <td className="px-4 py-3">
                          {inv.beneficiaryName ? (
                            <span className="text-white text-sm">{inv.beneficiaryName}</span>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">Not designated</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{inv.beneficiaryRelationship || '—'}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{inv.beneficiaryEmail || '—'}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{inv.beneficiaryPhone || '—'}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {inv.beneficiaryUpdatedAt ? new Date(inv.beneficiaryUpdatedAt).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => editingId === inv.id ? setEditingId(null) : openEdit(inv)}
                            className="flex items-center gap-1.5 text-xs bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1.5 rounded-lg transition-all"
                          >
                            <PencilIcon className="w-3.5 h-3.5" />
                            Edit
                          </button>
                        </td>
                      </tr>
                      {/* Inline edit row */}
                      {editingId === inv.id && (
                        <tr className="border-b border-border/50 bg-primary/5">
                          <td colSpan={8} className="px-4 py-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                              {[
                                { key: 'beneficiaryName', label: 'Beneficiary Name', placeholder: 'Full name' },
                                { key: 'beneficiaryRelationship', label: 'Relationship', placeholder: 'e.g. Spouse, Child' },
                                { key: 'beneficiaryEmail', label: 'Email', placeholder: 'email@example.com' },
                                { key: 'beneficiaryPhone', label: 'Phone', placeholder: '+1-555-0100' },
                                { key: 'beneficiaryAddress', label: 'Address', placeholder: 'Street address' },
                              ].map((field) => (
                                <div key={field.key}>
                                  <label className="text-xs text-muted-foreground font-medium mb-1 block">{field.label}</label>
                                  <input
                                    type="text"
                                    value={(editForm as any)[field.key]}
                                    onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })}
                                    placeholder={field.placeholder}
                                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                                  />
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => setEditingId(null)} className="flex items-center gap-1.5 bg-background border border-border text-white px-4 py-2 rounded-xl text-xs font-medium">
                                <XMarkIcon className="w-3.5 h-3.5" />Cancel
                              </button>
                              <button onClick={() => handleSave(inv)} disabled={saving} className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold">
                                <CheckIcon className="w-3.5 h-3.5" />{saving ? 'Saving...' : 'Save Changes'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <p className="text-amber-300/80 text-xs leading-relaxed">
            <strong className="text-amber-300">Important:</strong> Beneficiary information is recorded for reference only. Legal ownership transfers are controlled by Chew Network&apos;s official documents and records. This portal does not automatically transfer ownership.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
