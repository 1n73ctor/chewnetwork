'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/AuthContext';
import { adminService, type Investor, type InvestorDocument } from '@/lib/services/investorService';
import { AdminLayout } from '../certificates/page';
import { PlusIcon, XMarkIcon, CheckIcon, FolderOpenIcon } from '@heroicons/react/24/outline';

const docTypes = ['signed_agreement', 'investment_certificate', 'welcome_kit', 'payment_receipt', 'ownership_document', 'quarterly_report', 'transaction_document', 'beneficiary_document', 'other'];
const docTypeLabels: Record<string, string> = {
  signed_agreement: 'Signed Agreement', investment_certificate: 'Investment Certificate',
  welcome_kit: 'Welcome Kit', payment_receipt: 'Payment Receipt',
  ownership_document: 'Ownership Document', quarterly_report: 'Quarterly Report',
  transaction_document: 'Transaction Document', beneficiary_document: 'Beneficiary Document', other: 'Other',
};

export default function AdminDocumentsPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [documents, setDocuments] = useState<InvestorDocument[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [filterInvestorId, setFilterInvestorId] = useState('');
  const [form, setForm] = useState({ investorId: '', documentType: 'signed_agreement', documentTitle: '', fileUrl: '', isGlobal: false });

  useEffect(() => { if (!loading && !isAdmin) router.push('/'); }, [isAdmin, loading]);
  useEffect(() => {
    if (isAdmin) {
      adminService.getAllInvestors().then(setInvestors);
      loadDocuments();
    }
  }, [isAdmin]);

  const loadDocuments = async () => {
    setDocsLoading(true);
    const supabase = (await import('@/lib/supabase/client')).createClient();
    const { data, error } = await supabase
      .from('investor_documents')
      .select('*')
      .order('upload_date', { ascending: false });
    if (!error && data) {
      setDocuments(data.map((row: any) => ({
        id: row.id,
        investorId: row.investor_id,
        documentType: row.document_type,
        documentTitle: row.document_title,
        fileUrl: row.file_url || '',
        uploadDate: row.upload_date,
        visibility: row.visibility,
        isGlobal: row.is_global,
      })));
    }
    setDocsLoading(false);
  };

  const handleAdd = async () => {
    setSaving(true);
    const ok = await adminService.uploadDocument({
      investorId: form.investorId || undefined,
      documentType: form.documentType,
      documentTitle: form.documentTitle,
      fileUrl: form.fileUrl,
      isGlobal: form.isGlobal,
    });
    if (ok) {
      await adminService.createAuditLog('Document Uploaded', form.investorId || undefined, undefined, { title: form.documentTitle, type: form.documentType });
      await loadDocuments();
      setShowForm(false);
      setSuccessMsg('Document uploaded successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
    setSaving(false);
  };

  const getInvestorName = (investorId: string | null) => {
    if (!investorId) return null;
    const inv = investors.find(i => i.id === investorId);
    return inv ? `${inv.firstName} ${inv.lastName} (${inv.investorId})` : investorId.slice(0, 8) + '...';
  };

  const filteredDocs = filterInvestorId
    ? documents.filter(d => d.investorId === filterInvestorId || (filterInvestorId === '__global__' && d.isGlobal))
    : documents;

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!isAdmin) return null;

  return (
    <AdminLayout activeId="documents">
      <div className="p-4 lg:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div><h1 className="text-white text-2xl font-bold">Documents</h1><p className="text-muted-foreground text-sm mt-1">Upload and manage investor documents</p></div>
            <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
              <PlusIcon className="w-4 h-4" />Upload Document
            </button>
          </div>

          {successMsg && <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 flex items-center gap-2"><CheckIcon className="w-4 h-4 text-green-400" /><p className="text-green-400 text-sm">{successMsg}</p></div>}

          {showForm && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4"><h3 className="text-white font-bold">Upload Document</h3><button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-white"><XMarkIcon className="w-5 h-5" /></button></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Investor (leave blank for global)</label>
                  <select value={form.investorId} onChange={(e) => setForm({ ...form, investorId: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors">
                    <option value="">All Investors (Global)</option>
                    {investors.map((inv) => <option key={inv.id} value={inv.id}>{inv.investorId} — {inv.firstName} {inv.lastName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Document Type</label>
                  <select value={form.documentType} onChange={(e) => setForm({ ...form, documentType: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors">
                    {docTypes.map((t) => <option key={t} value={t}>{docTypeLabels[t]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Document Title</label>
                  <input type="text" value={form.documentTitle} onChange={(e) => setForm({ ...form, documentTitle: e.target.value })} placeholder="Document title..."
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">File URL</label>
                  <input type="url" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} placeholder="https://..."
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isGlobal" checked={form.isGlobal} onChange={(e) => setForm({ ...form, isGlobal: e.target.checked })} className="w-4 h-4 accent-primary" />
                  <label htmlFor="isGlobal" className="text-sm text-muted-foreground cursor-pointer">Visible to all investors</label>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowForm(false)} className="flex-1 bg-background border border-border text-white py-2.5 rounded-xl text-sm font-medium">Cancel</button>
                <button onClick={handleAdd} disabled={saving} className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-bold">{saving ? 'Uploading...' : 'Upload Document'}</button>
              </div>
            </div>
          )}

          {/* Filter by investor */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <select
                value={filterInvestorId}
                onChange={(e) => setFilterInvestorId(e.target.value)}
                className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              >
                <option value="">All Documents ({documents.length})</option>
                <option value="__global__">Global Documents ({documents.filter(d => d.isGlobal).length})</option>
                {investors.map((inv) => {
                  const count = documents.filter(d => d.investorId === inv.id).length;
                  return <option key={inv.id} value={inv.id}>{inv.investorId} — {inv.firstName} {inv.lastName} ({count})</option>;
                })}
              </select>
            </div>
          </div>

          {/* Documents listing */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <FolderOpenIcon className="w-4 h-4 text-primary" />
                Document Library
              </h3>
              <span className="text-xs text-muted-foreground">{filteredDocs.length} documents</span>
            </div>
            {docsLoading ? (
              <div className="p-4 space-y-3">{[1,2,3].map((i) => <div key={i} className="animate-pulse h-12 bg-border/30 rounded" />)}</div>
            ) : filteredDocs.length === 0 ? (
              <div className="p-8 text-center">
                <FolderOpenIcon className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">No documents found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {['Title', 'Type', 'Investor', 'Upload Date', 'Visibility', 'Link'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocs.map((doc) => (
                      <tr key={doc.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                        <td className="px-4 py-3 text-white text-sm font-medium max-w-xs truncate">{doc.documentTitle}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {docTypeLabels[doc.documentType] || doc.documentType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {doc.isGlobal ? (
                            <span className="text-primary font-semibold">Global</span>
                          ) : (
                            getInvestorName(doc.investorId) || '—'
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                          {doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${doc.isGlobal ? 'badge-green' : 'bg-primary/10 text-primary'}`}>
                            {doc.isGlobal ? 'All Investors' : 'Private'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {doc.fileUrl ? (
                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                              View
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
    </AdminLayout>
  );
}
