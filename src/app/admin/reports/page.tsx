'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/AuthContext';
import { adminService, investorService, type InvestorReport } from '@/lib/services/investorService';
import { AdminLayout } from '../certificates/page';
import { PlusIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function AdminReportsPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<InvestorReport[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [form, setForm] = useState({ title: '', quarter: 'Q1', year: new Date().getFullYear().toString(), fileUrl: '', datePublished: new Date().toISOString().split('T')[0], audience: 'all_investors' });

  useEffect(() => { if (!loading && !isAdmin) router.push('/'); }, [isAdmin, loading]);
  useEffect(() => {
    if (isAdmin) investorService.getReports().then((data) => { setReports(data); setDataLoading(false); });
  }, [isAdmin]);

  const handleAdd = async () => {
    setSaving(true);
    const ok = await adminService.createReport({ ...form, year: parseInt(form.year) });
    if (ok) {
      await adminService.createAuditLog('Investor Report Published', undefined, undefined, { title: form.title });
      const updated = await investorService.getReports();
      setReports(updated);
      setShowForm(false);
      setSuccessMsg('Report published successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!isAdmin) return null;

  return (
    <AdminLayout activeId="reports">
      <div className="p-4 lg:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div><h1 className="text-white text-2xl font-bold">Investor Reports</h1><p className="text-muted-foreground text-sm mt-1">Manage and publish investor reports</p></div>
            <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
              <PlusIcon className="w-4 h-4" />Add Report
            </button>
          </div>

          {successMsg && <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 flex items-center gap-2"><CheckIcon className="w-4 h-4 text-green-400" /><p className="text-green-400 text-sm">{successMsg}</p></div>}

          {showForm && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4"><h3 className="text-white font-bold">Add Investor Report</h3><button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-white"><XMarkIcon className="w-5 h-5" /></button></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {[
                  { key: 'title', label: 'Report Title', placeholder: 'Q1 2027 Investor Report' },
                  { key: 'quarter', label: 'Quarter', placeholder: 'Q1' },
                  { key: 'year', label: 'Year', placeholder: '2027' },
                  { key: 'fileUrl', label: 'PDF URL', placeholder: 'https://...' },
                  { key: 'datePublished', label: 'Date Published', placeholder: '', type: 'date' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-xs text-muted-foreground font-medium mb-1.5 block">{field.label}</label>
                    <input type={field.type || 'text'} value={(form as any)[field.key]} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} placeholder={field.placeholder}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors" />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Audience</label>
                  <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors">
                    <option value="all_investors">All Investors</option>
                    <option value="phase_1">Phase 1</option>
                    <option value="phase_2">Phase 2</option>
                    <option value="selected">Selected</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowForm(false)} className="flex-1 bg-background border border-border text-white py-2.5 rounded-xl text-sm font-medium">Cancel</button>
                <button onClick={handleAdd} disabled={saving} className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-bold">{saving ? 'Publishing...' : 'Publish Report'}</button>
              </div>
            </div>
          )}

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {dataLoading ? <div className="p-4 space-y-3">{[1,2,3].map((i) => <div key={i} className="animate-pulse h-12 bg-border/30 rounded" />)}</div> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border">{['Title', 'Quarter', 'Year', 'Audience', 'Published'].map((h) => <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">{h}</th>)}</tr></thead>
                  <tbody>
                    {reports.map((r) => (
                      <tr key={r.id} className="border-b border-border/50 hover:bg-primary/5">
                        <td className="px-4 py-3 text-white">{r.title}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{r.quarter}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{r.year}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{r.audience}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{r.datePublished}</td>
                      </tr>
                    ))}
                    {reports.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground text-sm">No reports yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
    </AdminLayout>
  );
}
