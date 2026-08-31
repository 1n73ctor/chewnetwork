'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/AuthContext';
import { adminService, type Investor, type StakeTransaction } from '@/lib/services/investorService';
import { createClient } from '@/lib/supabase/client';
import { AdminLayout } from '../certificates/page';
import { PlusIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

const txTypes = ['purchase', 'additional_purchase', 'transfer_in', 'transfer_out', 'company_repurchase', 'redemption', 'adjustment'];
const txTypeLabels: Record<string, string> = {
  purchase: 'PURCHASE', additional_purchase: 'ADDITIONAL PURCHASE', transfer_in: 'TRANSFER IN',
  transfer_out: 'TRANSFER OUT', company_repurchase: 'COMPANY REPURCHASE', redemption: 'REDEMPTION', adjustment: 'ADJUSTMENT',
};

export default function AdminTransactionsPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [transactions, setTransactions] = useState<StakeTransaction[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [selectedInvestorId, setSelectedInvestorId] = useState('');

  const [form, setForm] = useState({
    investorId: '', transactionType: 'purchase', numberOfStakes: '',
    pricePerStake: '0.01', transactionDate: new Date().toISOString().split('T')[0],
    round: 'Phase 1', notes: '',
  });

  useEffect(() => {
    if (!loading && !isAdmin) router.push('/');
  }, [isAdmin, loading]);

  const fetchInvestors = useCallback(async () => {
    const invs = await adminService.getAllInvestors();
    setInvestors(invs);
    setDataLoading(false);
  }, []);

  const fetchTransactions = useCallback(async (investorId: string) => {
    if (!investorId) return;
    const txs = await adminService.getInvestorTransactions(investorId);
    setTransactions(txs);
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    fetchInvestors();

    const supabase = createClient();
    const channel = supabase
      .channel('admin-transactions-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'investors' }, () => { fetchInvestors(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stake_transactions' }, () => {
        fetchInvestors();
        if (selectedInvestorId) fetchTransactions(selectedInvestorId);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isAdmin, fetchInvestors]);

  useEffect(() => {
    if (selectedInvestorId) {
      fetchTransactions(selectedInvestorId);
    }
  }, [selectedInvestorId, fetchTransactions]);

  const handleAddTransaction = async () => {
    setSaving(true);
    const stakes = parseInt(form.numberOfStakes) || 0;
    const price = parseFloat(form.pricePerStake) || 0;
    const ok = await adminService.addTransaction({
      investorId: form.investorId,
      transactionType: form.transactionType,
      numberOfStakes: stakes,
      pricePerStake: price,
      grossAmount: stakes * price,
      transactionDate: form.transactionDate,
      round: form.round,
      notes: form.notes,
    });
    if (ok) {
      await adminService.createAuditLog('Stake Transaction Added', form.investorId, null, { type: form.transactionType, stakes });
      setSuccessMsg('Transaction recorded successfully.');
      setShowForm(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!isAdmin) return null;

  const formatStakes = (val: number) => new Intl.NumberFormat('en-US').format(val || 0);
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

  return (
    <AdminLayout activeId="transactions">
      <div className="p-4 lg:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white text-2xl font-bold">Stake Transactions</h1>
              <p className="text-muted-foreground text-sm mt-1">Record and view all ownership transactions</p>
            </div>
            <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
              <PlusIcon className="w-4 h-4" />Add Transaction
            </button>
          </div>

          {successMsg && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-green-400" /><p className="text-green-400 text-sm">{successMsg}</p>
            </div>
          )}

          {showForm && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold">Add Stake Transaction</h3>
                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-white"><XMarkIcon className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Investor</label>
                  <select
                    value={form.investorId}
                    onChange={(e) => setForm({ ...form, investorId: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="">Select investor...</option>
                    {investors.map((inv) => (
                      <option key={inv.id} value={inv.id}>{inv.investorId} — {inv.firstName} {inv.lastName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Transaction Type</label>
                  <select
                    value={form.transactionType}
                    onChange={(e) => setForm({ ...form, transactionType: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  >
                    {txTypes.map((t) => <option key={t} value={t}>{txTypeLabels[t]}</option>)}
                  </select>
                </div>
                {[
                  { key: 'numberOfStakes', label: 'Number of Stakes', placeholder: '50000' },
                  { key: 'pricePerStake', label: 'Price Per Stake ($)', placeholder: '0.01' },
                  { key: 'transactionDate', label: 'Transaction Date', placeholder: '', type: 'date' },
                  { key: 'round', label: 'Round', placeholder: 'Phase 1' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-xs text-muted-foreground font-medium mb-1.5 block">{field.label}</label>
                    <input
                      type={field.type || 'text'}
                      value={(form as any)[field.key]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Notes</label>
                  <input
                    type="text"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Optional notes..."
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
              {form.numberOfStakes && form.pricePerStake && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 mb-4">
                  <p className="text-sm text-muted-foreground">
                    Gross Amount: <span className="text-white font-bold">{formatCurrency(parseInt(form.numberOfStakes) * parseFloat(form.pricePerStake))}</span>
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setShowForm(false)} className="flex-1 bg-background border border-border text-white py-2.5 rounded-xl text-sm font-medium">Cancel</button>
                <button onClick={handleAddTransaction} disabled={saving || !form.investorId} className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-bold">
                  {saving ? 'Recording...' : 'Record Transaction'}
                </button>
              </div>
            </div>
          )}

          {/* View transactions by investor */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-white font-bold text-sm mb-3">View Transactions by Investor</h3>
            <select
              value={selectedInvestorId}
              onChange={(e) => setSelectedInvestorId(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors mb-4"
            >
              <option value="">Select investor to view transactions...</option>
              {investors.map((inv) => (
                <option key={inv.id} value={inv.id}>{inv.investorId} — {inv.firstName} {inv.lastName}</option>
              ))}
            </select>

            {selectedInvestorId && (
              transactions.length === 0 ? (
                <p className="text-muted-foreground text-sm">No transactions for this investor.</p>
              ) : (
                <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
                  <table className="min-w-full w-max text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {['Type', 'Stakes', 'Price/Stake', 'Gross Amount', 'Date', 'Round', 'Notes'].map((h) => (
                          <th key={h} className="text-left px-3 py-2 text-xs text-muted-foreground font-semibold whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-border/50">
                          <td className="px-3 py-2 text-xs font-bold text-primary">{txTypeLabels[tx.transactionType] || tx.transactionType.toUpperCase()}</td>
                          <td className="px-3 py-2 text-white">{formatStakes(tx.numberOfStakes)}</td>
                          <td className="px-3 py-2 text-white">${tx.pricePerStake?.toFixed(4)}</td>
                          <td className="px-3 py-2 text-white">{formatCurrency(tx.grossAmount)}</td>
                          <td className="px-3 py-2 text-muted-foreground text-xs">{tx.transactionDate}</td>
                          <td className="px-3 py-2 text-muted-foreground text-xs">{tx.round}</td>
                          <td className="px-3 py-2 text-muted-foreground text-xs">{tx.notes || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        </div>
    </AdminLayout>
  );
}
