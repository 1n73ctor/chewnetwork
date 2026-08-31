'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/AuthContext';
import { adminService, type InvestorUpdate } from '@/lib/services/investorService';
import { AdminLayout } from '../certificates/page';
import { PlusIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { createClient } from '@/lib/supabase/client';

const categories = ['see_it_cook_it', 'chef_pepe', 'technology', 'company', 'creators', 'restaurants', 'milestones', 'phase_2', 'general'];
const categoryLabels: Record<string, string> = {
  see_it_cook_it: 'See It. Cook It.', chef_pepe: 'Chef Pepe', technology: 'Technology',
  company: 'Company', creators: 'Creators', restaurants: 'Restaurants',
  milestones: 'Milestones', phase_2: 'Phase 2', general: 'General',
};

export default function AdminUpdatesPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [updates, setUpdates] = useState<InvestorUpdate[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<InvestorUpdate | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    title: '', shortDescription: '', fullContent: '', category: 'general',
    publishDate: new Date().toISOString().split('T')[0], audience: 'all_investors',
    sendSms: false, thumbnailUrl: '',
  });

  useEffect(() => { if (!loading && !isAdmin) router.push('/'); }, [isAdmin, loading]);

  const fetchUpdates = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('investor_updates')
      .select('*')
      .order('publish_date', { ascending: false });
    if (data) {
      setUpdates(data.map((row: any) => ({
        id: row.id, title: row.title, thumbnailUrl: row.thumbnail_url || '',
        shortDescription: row.short_description || '', fullContent: row.full_content || '',
        category: row.category, publishDate: row.publish_date, audience: row.audience,
        isPublished: row.is_published, createdAt: row.created_at,
      })));
    }
    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    fetchUpdates();

    const supabase = createClient();
    const channel = supabase
      .channel('admin-updates-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'investor_updates' }, () => { fetchUpdates(); })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isAdmin, fetchUpdates]);

  const blankForm = {
    title: '', shortDescription: '', fullContent: '', category: 'general',
    publishDate: new Date().toISOString().split('T')[0], audience: 'all_investors',
    sendSms: false, thumbnailUrl: '',
  };

  const openCreate = () => { setEditingId(null); setForm(blankForm); setShowForm(true); };

  const openEdit = (u: InvestorUpdate) => {
    setEditingId(u.id);
    setForm({
      title: u.title || '',
      shortDescription: u.shortDescription || '',
      fullContent: u.fullContent || '',
      category: u.category || 'general',
      publishDate: u.publishDate || new Date().toISOString().split('T')[0],
      audience: u.audience || 'all_investors',
      sendSms: false, // never re-notify on an edit
      thumbnailUrl: u.thumbnailUrl || '',
    });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    const ok = await adminService.deleteUpdate(confirmDelete.id);
    if (ok) {
      await adminService.createAuditLog('Investor Update Deleted', undefined, { title: confirmDelete.title }, undefined);
      await fetchUpdates();
      setSuccessMsg('Update deleted.');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
    setConfirmDelete(null);
    setDeleting(false);
  };

  const handleAdd = async () => {
    setSaving(true);
    // Editing writes only the content fields; sendSms is intentionally not
    // reapplied, so correcting a typo cannot re-notify every investor.
    const ok = editingId
      ? await adminService.editUpdate(editingId, form)
      : await adminService.createUpdate(form);
    if (ok) {
      await adminService.createAuditLog(
        editingId ? 'Investor Update Edited' : 'Investor Update Published',
        undefined, undefined, { title: form.title, sendSms: !editingId && form.sendSms });
      if (form.sendSms) {
        // SMS notification would be sent via Twilio edge function
        // supabase.functions.invoke('send-sms', { body: { to: '+1...', message: `Chew Network Investor Update: ${form.title}` } });
      }
      await fetchUpdates();
      setShowForm(false);
      setSuccessMsg(editingId ? 'Update saved.' : 'Update published successfully.');
      setEditingId(null);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!isAdmin) return null;

  return (
    <AdminLayout activeId="updates">
      <div className="p-4 lg:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div><h1 className="text-white text-2xl font-bold">Investor Updates</h1><p className="text-muted-foreground text-sm mt-1">Publish updates to the investor newsfeed</p></div>
            <button onClick={openCreate} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
              <PlusIcon className="w-4 h-4" />Publish Update
            </button>
          </div>

          {successMsg && <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 flex items-center gap-2"><CheckIcon className="w-4 h-4 text-green-400" /><p className="text-green-400 text-sm">{successMsg}</p></div>}

          {showForm && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4"><h3 className="text-white font-bold">{editingId ? 'Edit Investor Update' : 'Publish Investor Update'}</h3><button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-muted-foreground hover:text-white"><XMarkIcon className="w-5 h-5" /></button></div>
              <div className="space-y-4 mb-4">
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Title</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Update title..."
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Short Description</label>
                  <input type="text" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} placeholder="Brief summary..."
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Full Content</label>
                  <textarea value={form.fullContent} onChange={(e) => setForm({ ...form, fullContent: e.target.value })} placeholder="Full update content..." rows={4}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors">
                      {categories.map((c) => <option key={c} value={c}>{categoryLabels[c]}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Audience</label>
                    <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors">
                      <option value="all_investors">All Investors</option>
                      <option value="phase_1">Phase 1</option>
                      <option value="phase_2">Phase 2</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Publish Date</label>
                    <input type="date" value={form.publishDate} onChange={(e) => setForm({ ...form, publishDate: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.sendSms} onChange={(e) => setForm({ ...form, sendSms: e.target.checked })} className="w-4 h-4 accent-primary" />
                    <span className="text-sm text-muted-foreground">Send SMS Notification</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setShowForm(false); setEditingId(null); }} className="flex-1 bg-background border border-border text-white py-2.5 rounded-xl text-sm font-medium">Cancel</button>
                <button onClick={handleAdd} disabled={saving} className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-bold">{saving ? 'Saving…' : editingId ? 'Save Changes' : 'Publish Update'}</button>
              </div>
            </div>
          )}

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {dataLoading ? <div className="p-4 space-y-3">{[1,2,3].map((i) => <div key={i} className="animate-pulse h-12 bg-border/30 rounded" />)}</div> : (
              <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
                <table className="min-w-full w-max text-sm">
                  <thead><tr className="border-b border-border">{['Title', 'Category', 'Audience', 'Published', 'Status', ''].map((h) => <th key={h || 'actions'} className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">{h}</th>)}</tr></thead>
                  <tbody>
                    {updates.map((u) => (
                      <tr key={u.id} className="border-b border-border/50 hover:bg-primary/5">
                        <td className="px-4 py-3 text-white">{u.title}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{categoryLabels[u.category] || u.category}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{u.audience}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{u.publishDate}</td>
                        <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${u.isPublished ? 'badge-green' : 'bg-gray-500/20 text-gray-400'}`}>{u.isPublished ? 'PUBLISHED' : 'DRAFT'}</span></td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button onClick={() => openEdit(u)} className="text-xs text-primary hover:underline mr-3">Edit</button>
                          <button onClick={() => setConfirmDelete(u)} className="text-xs text-red-400 hover:text-red-300 hover:underline">Delete</button>
                        </td>
                      </tr>
                    ))}
                    {updates.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground text-sm">No updates yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {confirmDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
              <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md">
                <h3 className="text-white font-bold text-lg">Delete this update?</h3>
                <p className="text-muted-foreground text-sm mt-2">
                  <span className="text-white font-medium">{confirmDelete.title}</span> will be removed from the
                  investor newsfeed for everyone. This cannot be undone.
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
