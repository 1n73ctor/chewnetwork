'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/AuthContext';
import { adminService, investorService, type InvestorReport } from '@/lib/services/investorService';
import { AdminLayout } from '../certificates/page';
import { PlusIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

/**
 * Only the short code is stored, so existing rows keep working and the investor
 * portal can go on rendering "Q1 2027". The date range is a label for whoever
 * is filling the form in — it says which months a quarter covers without
 * anyone having to remember.
 */
const QUARTERS = [
  { value: 'Q1', label: 'Q1 (January 1 to March 31)' },
  { value: 'Q2', label: 'Q2 (April 1 to June 30)' },
  { value: 'Q3', label: 'Q3 (July 1 to September 30)' },
  { value: 'Q4', label: 'Q4 (October 1 to December 31)' },
];

const quarterLabel = (value: string) =>
  QUARTERS.find((q) => q.value === value)?.label ?? value;

const AUDIENCES = [
  { value: 'all_investors', label: 'All Investors' },
  { value: 'phase_1', label: 'Phase 1' },
  { value: 'phase_2', label: 'Phase 2' },
  { value: 'selected', label: 'Selected' },
];

const blankForm = {
  title: '',
  quarter: 'Q1',
  year: new Date().getFullYear().toString(),
  fileUrl: '',
  datePublished: new Date().toISOString().split('T')[0],
  audience: 'all_investors',
};

export default function AdminReportsPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<InvestorReport[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<InvestorReport | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState(blankForm);

  useEffect(() => { if (!loading && !isAdmin) router.push('/'); }, [isAdmin, loading]);
  useEffect(() => {
    if (isAdmin) investorService.getReports().then((data) => { setReports(data); setDataLoading(false); });
  }, [isAdmin]);

  const flash = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 4000); };
  const fail = (msg: string) => { setErrorMsg(msg); setTimeout(() => setErrorMsg(''), 6000); };

  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(blankForm); };

  const openCreate = () => { setEditingId(null); setForm(blankForm); setShowForm(true); };

  const openEdit = (r: InvestorReport) => {
    setEditingId(r.id);
    setForm({
      title: r.title,
      // An older row may hold a quarter the dropdown does not offer; fall back
      // rather than silently rewriting it to Q1 on save.
      quarter: QUARTERS.some((q) => q.value === r.quarter) ? r.quarter : 'Q1',
      year: String(r.year ?? new Date().getFullYear()),
      fileUrl: r.fileUrl || '',
      datePublished: r.datePublished || new Date().toISOString().split('T')[0],
      audience: r.audience || 'all_investors',
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { fail('A report title is required.'); return; }
    setSaving(true);
    setErrorMsg('');
    const payload = { ...form, year: parseInt(form.year, 10) };
    const ok = editingId
      ? await adminService.editReport(editingId, payload)
      : await adminService.createReport(payload);

    if (!ok) {
      fail(editingId ? 'Could not save the report. Please try again.' : 'Could not publish the report. Please try again.');
      setSaving(false);
      return;
    }

    await adminService.createAuditLog(
      editingId ? 'Investor Report Edited' : 'Investor Report Published',
      undefined, undefined, { title: form.title, quarter: form.quarter, year: payload.year }
    );
    setReports(await investorService.getReports());
    flash(editingId ? 'Report saved.' : 'Report published successfully.');
    closeForm();
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    const ok = await adminService.deleteReport(confirmDelete.id);
    if (ok) {
      await adminService.createAuditLog('Investor Report Deleted', undefined, { title: confirmDelete.title }, undefined);
      setReports(await investorService.getReports());
      flash('Report deleted.');
    } else {
      fail('Could not delete the report. Please try again.');
    }
    setConfirmDelete(null);
    setDeleting(false);
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!isAdmin) return null;

  return (
    <AdminLayout activeId="reports">
      <div className="p-4 lg:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div><h1 className="text-white text-2xl font-bold">Investor Reports</h1><p className="text-muted-foreground text-sm mt-1">Manage and publish investor reports</p></div>
            <button onClick={openCreate} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
              <PlusIcon className="w-4 h-4" />Add Report
            </button>
          </div>

          {successMsg && <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 flex items-center gap-2"><CheckIcon className="w-4 h-4 text-green-400" /><p className="text-green-400 text-sm">{successMsg}</p></div>}
          {errorMsg && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3"><p className="text-red-400 text-sm">{errorMsg}</p></div>}

          {showForm && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold">{editingId ? 'Edit Investor Report' : 'Add Investor Report'}</h3>
                <button onClick={closeForm} className="text-muted-foreground hover:text-white"><XMarkIcon className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Report Title</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Q1 2027 Investor Report"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Quarter</label>
                  <select value={form.quarter} onChange={(e) => setForm({ ...form, quarter: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors">
                    {QUARTERS.map((q) => <option key={q.value} value={q.value}>{q.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Year</label>
                  <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2027"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">PDF URL</label>
                  <input type="text" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} placeholder="https://..."
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Date Published</label>
                  <input type="date" value={form.datePublished} onChange={(e) => setForm({ ...form, datePublished: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Audience</label>
                  <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors">
                    {AUDIENCES.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={closeForm} className="flex-1 bg-background border border-border text-white py-2.5 rounded-xl text-sm font-medium">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-bold">
                  {saving ? (editingId ? 'Saving…' : 'Publishing...') : (editingId ? 'Save Changes' : 'Publish Report')}
                </button>
              </div>
            </div>
          )}

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {dataLoading ? <div className="p-4 space-y-3">{[1,2,3].map((i) => <div key={i} className="animate-pulse h-12 bg-border/30 rounded" />)}</div> : (
              <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
                <table className="min-w-full w-max text-sm">
                  <thead><tr className="border-b border-border">{['Title', 'Quarter', 'Year', 'Audience', 'Published', 'Actions'].map((h) => <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold whitespace-nowrap">{h}</th>)}</tr></thead>
                  <tbody>
                    {reports.map((r) => (
                      <tr key={r.id} className="border-b border-border/50 hover:bg-primary/5">
                        <td className="px-4 py-3 text-white">{r.title}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{quarterLabel(r.quarter)}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{r.year}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{r.audience}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{r.datePublished}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button onClick={() => openEdit(r)} className="text-xs text-primary hover:underline mr-3">Edit</button>
                          <button onClick={() => setConfirmDelete(r)} className="text-xs text-red-400 hover:text-red-300 hover:underline">Delete</button>
                        </td>
                      </tr>
                    ))}
                    {reports.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground text-sm">No reports yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {confirmDelete && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
              <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full">
                <h3 className="text-white font-bold text-lg">Delete this report?</h3>
                <p className="text-muted-foreground text-sm mt-2">
                  <span className="text-white font-medium">{confirmDelete.title}</span> will be removed from the
                  investor portal. This cannot be undone.
                </p>
                <div className="flex gap-3 mt-5">
                  <button onClick={() => setConfirmDelete(null)} className="flex-1 bg-background border border-border text-white py-2.5 rounded-xl text-sm font-medium">Cancel</button>
                  <button onClick={handleDelete} disabled={deleting} className="flex-1 bg-red-500 hover:bg-red-500/90 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-bold">
                    {deleting ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
    </AdminLayout>
  );
}
