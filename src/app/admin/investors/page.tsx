'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/AuthContext';
import { adminService, type Investor } from '@/lib/services/investorService';
import { AdminLayout } from '../certificates/page';
import { PlusIcon, MagnifyingGlassIcon, XMarkIcon, CheckIcon, PencilIcon, NoSymbolIcon, KeyIcon } from '@heroicons/react/24/outline';

export default function AdminInvestorsPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [confirmDeactivate, setConfirmDeactivate] = useState<Investor | null>(null);

  const [resetBusy, setResetBusy] = useState('');

  const [addForm, setAddForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '',
    round: 'Phase 1', originalInvestment: '', originalStakePrice: '0.01',
    joinDate: new Date().toISOString().split('T')[0],
  });

  const [editForm, setEditForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', round: '', notes: '',
  });

  useEffect(() => {
    if (!loading && !isAdmin) router.push('/');
  }, [isAdmin, loading]);

  useEffect(() => {
    if (isAdmin) {
      adminService.getAllInvestors().then((data) => { setInvestors(data); setDataLoading(false); });
    }
  }, [isAdmin]);

  const filtered = investors.filter((inv) => {
    const q = search.toLowerCase();
    return !q || inv.firstName?.toLowerCase().includes(q) || inv.lastName?.toLowerCase().includes(q) ||
      inv.email?.toLowerCase().includes(q) || inv.investorId?.toLowerCase().includes(q);
  });

  const handleAddInvestor = async () => {
    setSaving(true);
    const investment = parseFloat(addForm.originalInvestment) || 0;
    const stakePrice = parseFloat(addForm.originalStakePrice) || 0.01;
    const stakes = stakePrice > 0 ? Math.floor(investment / stakePrice) : 0;
    const inv = await adminService.createInvestor({
      firstName: addForm.firstName,
      lastName: addForm.lastName,
      email: addForm.email,
      phone: addForm.phone,
      round: addForm.round,
      originalInvestment: investment,
      originalStakePrice: stakePrice,
      originalStakesPurchased: stakes,
      currentStakesOwned: stakes,
      joinDate: addForm.joinDate,
    });
    if (inv) {
      await adminService.createAuditLog('Investor Created', inv.id, null, { investorId: inv.investorId, email: inv.email });

      // An investor row on its own cannot sign in — provision the auth account too.
      const account = await adminService.createInvestorAccount(inv.id, addForm.email, addForm.password);
      if (account.ok && account.mustSetOwnPassword) {
        await adminService.sendPasswordReset(addForm.email);
      }

      const updated = await adminService.getAllInvestors();
      setInvestors(updated);
      setShowAddForm(false);
      setAddForm({
        firstName: '', lastName: '', email: '', phone: '', password: '',
        round: 'Phase 1', originalInvestment: '', originalStakePrice: '0.01',
        joinDate: new Date().toISOString().split('T')[0],
      });
      setSuccessMsg(
        account.ok
          ? `Investor ${inv.investorId} created${account.mustSetOwnPassword ? ' — a set-password email was sent.' : ' with a login.'}`
          : `Investor ${inv.investorId} created, but the login could not be set up: ${account.error}`
      );
      setTimeout(() => setSuccessMsg(''), 6000);
    }
    setSaving(false);
  };

  const openEditMode = (inv: Investor) => {
    setEditForm({
      firstName: inv.firstName || '',
      lastName: inv.lastName || '',
      email: inv.email || '',
      phone: inv.phone || '',
      round: inv.round || '',
      notes: inv.notes || '',
    });
    setEditMode(true);
  };

  const handleSendReset = async (inv: Investor) => {
    if (!inv.email) return;
    setResetBusy(inv.id);
    const res = await adminService.sendPasswordReset(inv.email);
    await adminService.createAuditLog('Password Reset Sent', inv.id, null, { email: inv.email });
    setSuccessMsg(res.ok ? `Password reset email sent to ${inv.email}.` : `Could not send reset: ${res.error}`);
    setResetBusy('');
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const handleSaveEdit = async () => {
    if (!selectedInvestor) return;
    setSaving(true);
    const ok = await adminService.updateInvestor(selectedInvestor.id, {
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      email: editForm.email,
      phone: editForm.phone,
      round: editForm.round,
      notes: editForm.notes,
    });
    if (ok) {
      await adminService.createAuditLog('Investor Updated', selectedInvestor.id,
        { firstName: selectedInvestor.firstName, lastName: selectedInvestor.lastName, email: selectedInvestor.email },
        { firstName: editForm.firstName, lastName: editForm.lastName, email: editForm.email }
      );
      const updated = await adminService.getAllInvestors();
      setInvestors(updated);
      const refreshed = updated.find(i => i.id === selectedInvestor.id) || null;
      setSelectedInvestor(refreshed);
      setEditMode(false);
      setSuccessMsg('Investor updated successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
    setSaving(false);
  };

  const handleDeactivate = async (inv: Investor) => {
    setSaving(true);
    const newStatus = inv.accountStatus === 'active' ? 'inactive' : 'active';
    const ok = await adminService.updateInvestor(inv.id, { accountStatus: newStatus });
    if (ok) {
      await adminService.createAuditLog(
        newStatus === 'inactive' ? 'Investor Deactivated' : 'Investor Activated',
        inv.id, { accountStatus: inv.accountStatus }, { accountStatus: newStatus }
      );
      const updated = await adminService.getAllInvestors();
      setInvestors(updated);
      const refreshed = updated.find(i => i.id === inv.id) || null;
      setSelectedInvestor(refreshed);
      setConfirmDeactivate(null);
      setSuccessMsg(`Investor ${newStatus === 'inactive' ? 'deactivated' : 'activated'} successfully.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!isAdmin) return null;

  const formatStakes = (val: number) => new Intl.NumberFormat('en-US').format(val || 0);
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

  return (
    <AdminLayout activeId="investors">
      <div className="p-4 lg:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white text-2xl font-bold">Investors</h1>
              <p className="text-muted-foreground text-sm mt-1">{investors.length} total investors</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
            >
              <PlusIcon className="w-4 h-4" />
              Add Investor
            </button>
          </div>

          {successMsg && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-green-400" />
              <p className="text-green-400 text-sm">{successMsg}</p>
            </div>
          )}

          {/* Add investor form */}
          {showAddForm && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold">Add New Investor</h3>
                <button onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-white">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {[
                  { key: 'firstName', label: 'First Name', placeholder: 'Alex' },
                  { key: 'lastName', label: 'Last Name', placeholder: 'Rivera' },
                  { key: 'email', label: 'Email', placeholder: 'alex@example.com' },
                  { key: 'phone', label: 'Phone', placeholder: '+1-555-0100' },
                  { key: 'password', label: 'Password (blank = email them a set-password link)', placeholder: 'At least 8 characters', type: 'password' },
                  { key: 'round', label: 'Round', placeholder: 'Phase 1' },
                  { key: 'joinDate', label: 'Join Date', placeholder: '', type: 'date' },
                  { key: 'originalInvestment', label: 'Investment Amount ($)', placeholder: '500.00' },
                  { key: 'originalStakePrice', label: 'Stake Price ($)', placeholder: '0.01' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-xs text-muted-foreground font-medium mb-1.5 block">{field.label}</label>
                    <input
                      type={field.type || 'text'}
                      value={(addForm as any)[field.key]}
                      onChange={(e) => setAddForm({ ...addForm, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                ))}
              </div>
              {addForm.originalInvestment && addForm.originalStakePrice && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 mb-4">
                  <p className="text-sm text-muted-foreground">
                    Calculated Stakes:{' '}
                    <span className="text-white font-bold">
                      {formatStakes(Math.floor(parseFloat(addForm.originalInvestment) / parseFloat(addForm.originalStakePrice)))}
                    </span>
                    {' '}Ecosystem Stakes
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Ownership:{' '}
                    <span className="text-primary font-bold">
                      {((Math.floor(parseFloat(addForm.originalInvestment) / parseFloat(addForm.originalStakePrice)) / 800000000) * 5).toFixed(7)}%
                    </span>
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setShowAddForm(false)} className="flex-1 bg-background border border-border text-white py-2.5 rounded-xl text-sm font-medium transition-all">Cancel</button>
                <button onClick={handleAddInvestor} disabled={saving} className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-bold transition-all">
                  {saving ? 'Creating...' : 'Create Investor'}
                </button>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or investor ID..."
              className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Investor table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {dataLoading ? (
              <div className="p-4 space-y-3">{[1,2,3].map((i) => <div key={i} className="animate-pulse h-12 bg-border/30 rounded" />)}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {['Investor ID', 'Name', 'Email', 'Stakes', 'Ownership %', 'Investment', 'Round', 'Status'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((inv) => (
                      <tr key={inv.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors cursor-pointer" onClick={() => { setSelectedInvestor(inv); setEditMode(false); }}>
                        <td className="px-4 py-3 text-primary font-bold text-xs">{inv.investorId}</td>
                        <td className="px-4 py-3 text-white whitespace-nowrap">{inv.firstName} {inv.lastName}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{inv.email}</td>
                        <td className="px-4 py-3 text-white">{formatStakes(inv.currentStakesOwned)}</td>
                        <td className="px-4 py-3 text-white text-xs">{(inv.ownershipPercentage || 0).toFixed(7)}%</td>
                        <td className="px-4 py-3 text-white text-xs">{formatCurrency(inv.originalInvestment)}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{inv.round}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${inv.accountStatus === 'active' ? 'badge-green' : 'bg-gray-500/20 text-gray-400'}`}>
                            {inv.accountStatus?.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="p-8 text-center"><p className="text-muted-foreground text-sm">No investors found.</p></div>
                )}
              </div>
            )}
          </div>

          {/* Investor detail panel */}
          {selectedInvestor && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold">{selectedInvestor.firstName} {selectedInvestor.lastName} — {selectedInvestor.investorId}</h3>
                <div className="flex items-center gap-2">
                  {!editMode && (
                    <>
                      <button
                        onClick={() => openEditMode(selectedInvestor)}
                        className="flex items-center gap-1.5 text-xs bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-lg transition-all"
                      >
                        <PencilIcon className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleSendReset(selectedInvestor)}
                        disabled={resetBusy === selectedInvestor.id || !selectedInvestor.email}
                        title={selectedInvestor.userId ? 'Email a password reset link' : 'This investor has no login yet'}
                        className="flex items-center gap-1.5 text-xs bg-white/5 hover:bg-white/10 disabled:opacity-50 text-muted-foreground hover:text-white px-3 py-1.5 rounded-lg transition-all"
                      >
                        <KeyIcon className="w-3.5 h-3.5" />
                        {resetBusy === selectedInvestor.id ? 'Sending...' : 'Reset Password'}
                      </button>
                      <button
                        onClick={() => setConfirmDeactivate(selectedInvestor)}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all ${
                          selectedInvestor.accountStatus === 'active' ?'bg-red-500/10 hover:bg-red-500/20 text-red-400' :'bg-green-500/10 hover:bg-green-500/20 text-green-400'
                        }`}
                      >
                        <NoSymbolIcon className="w-3.5 h-3.5" />
                        {selectedInvestor.accountStatus === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </>
                  )}
                  <button onClick={() => { setSelectedInvestor(null); setEditMode(false); }} className="text-muted-foreground hover:text-white ml-1">
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Confirm deactivate dialog */}
              {confirmDeactivate && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
                  <p className="text-red-300 text-sm font-semibold mb-2">
                    {confirmDeactivate.accountStatus === 'active' ? 'Deactivate' : 'Activate'} {confirmDeactivate.firstName} {confirmDeactivate.lastName}?
                  </p>
                  <p className="text-muted-foreground text-xs mb-3">
                    {confirmDeactivate.accountStatus === 'active' ?'This will prevent the investor from logging in. Their data and stakes will be preserved.' :'This will restore the investor\'s access to the portal.'}
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => setConfirmDeactivate(null)} className="flex-1 bg-background border border-border text-white py-2 rounded-xl text-xs font-medium">Cancel</button>
                    <button
                      onClick={() => handleDeactivate(confirmDeactivate)}
                      disabled={saving}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold disabled:opacity-50 ${confirmDeactivate.accountStatus === 'active' ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                    >
                      {saving ? 'Processing...' : (confirmDeactivate.accountStatus === 'active' ? 'Confirm Deactivate' : 'Confirm Activate')}
                    </button>
                  </div>
                </div>
              )}

              {/* Edit form */}
              {editMode ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { key: 'firstName', label: 'First Name' },
                      { key: 'lastName', label: 'Last Name' },
                      { key: 'email', label: 'Email' },
                      { key: 'phone', label: 'Phone' },
                      { key: 'round', label: 'Round' },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="text-xs text-muted-foreground font-medium mb-1.5 block">{field.label}</label>
                        <input
                          type="text"
                          value={(editForm as any)[field.key]}
                          onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })}
                          className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Notes</label>
                      <textarea
                        value={editForm.notes}
                        onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                        rows={2}
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setEditMode(false)} className="flex-1 bg-background border border-border text-white py-2.5 rounded-xl text-sm font-medium">Cancel</button>
                    <button onClick={handleSaveEdit} disabled={saving} className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-bold">
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Certificate #', value: selectedInvestor.certificateNumber },
                    { label: 'Email', value: selectedInvestor.email },
                    { label: 'Phone', value: selectedInvestor.phone || '—' },
                    { label: 'Join Date', value: selectedInvestor.joinDate },
                    { label: 'Original Investment', value: formatCurrency(selectedInvestor.originalInvestment) },
                    { label: 'Stake Price', value: `$${selectedInvestor.originalStakePrice?.toFixed(4)}` },
                    { label: 'Original Stakes', value: formatStakes(selectedInvestor.originalStakesPurchased) },
                    { label: 'Additional Stakes', value: formatStakes(selectedInvestor.additionalStakesPurchased) },
                    { label: 'Current Stakes', value: formatStakes(selectedInvestor.currentStakesOwned) },
                    { label: 'Stakes Sold', value: formatStakes(selectedInvestor.stakesSold) },
                    { label: 'Repurchased', value: formatStakes(selectedInvestor.stakesRepurchased) },
                    { label: 'Ownership %', value: `${(selectedInvestor.ownershipPercentage || 0).toFixed(7)}%` },
                    { label: 'Beneficiary', value: selectedInvestor.beneficiaryName || '—' },
                    { label: 'Creator Program', value: selectedInvestor.creatorProgramStatus ? 'Active' : 'Not Active' },
                  ].map((field, i) => (
                    <div key={i} className="border-b border-border/30 pb-3">
                      <p className="text-xs text-muted-foreground font-semibold tracking-widest mb-0.5">{field.label.toUpperCase()}</p>
                      <p className="text-white text-sm">{field.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
    </AdminLayout>
  );
}
