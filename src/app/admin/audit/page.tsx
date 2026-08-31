'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminService } from '@/lib/services/investorService';
import { AdminLayout } from '../certificates/page';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ACTION_OPTIONS = [
  'All Actions',
  'Investor Created', 'Investor Updated', 'Investor Deactivated', 'Investor Activated',
  'Beneficiary Updated', 'Document Uploaded', 'CERTIFICATE_REGENERATED',
  'LEDGER_EXPORTED', 'ADMIN_PASSWORD_CHANGED', 'ADMIN_USER_INVITED',
  'PORTAL_SETTINGS_UPDATED', 'Hotline Updated', 'Welcome Kit Updated',
  'Report Published', 'Update Published', 'Transaction Added',
];

export default function AdminAuditPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Filters
  const [filterAction, setFilterAction] = useState('All Actions');
  const [filterInvestorId, setFilterInvestorId] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) router.push('/');
  }, [isAdmin, loading]);

  useEffect(() => {
    if (isAdmin) {
      adminService.getAuditLogs().then((data) => { setLogs(data); setDataLoading(false); });
    }
  }, [isAdmin]);

  const clearFilters = () => {
    setFilterAction('All Actions');
    setFilterInvestorId('');
    setFilterDateFrom('');
    setFilterDateTo('');
  };

  const hasActiveFilters = filterAction !== 'All Actions' || filterInvestorId || filterDateFrom || filterDateTo;

  const filteredLogs = logs.filter((log) => {
    if (filterAction !== 'All Actions' && log.action !== filterAction) return false;
    if (filterInvestorId) {
      const q = filterInvestorId.toLowerCase();
      const invId = (log.investor_id || '').toLowerCase();
      const details = JSON.stringify(log.new_value || {}).toLowerCase();
      if (!invId.includes(q) && !details.includes(q)) return false;
    }
    if (filterDateFrom) {
      const logDate = new Date(log.created_at);
      const fromDate = new Date(filterDateFrom);
      if (logDate < fromDate) return false;
    }
    if (filterDateTo) {
      const logDate = new Date(log.created_at);
      const toDate = new Date(filterDateTo + 'T23:59:59');
      if (logDate > toDate) return false;
    }
    return true;
  });

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!isAdmin) return null;

  return (
    <AdminLayout activeId="audit">
      <div className="p-4 lg:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold">Audit Logs</h1>
            <p className="text-muted-foreground text-sm mt-1">Complete record of all admin actions</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              hasActiveFilters
                ? 'bg-primary text-white' :'bg-card border border-border text-white hover:border-primary'
            }`}
          >
            <FunnelIcon className="w-4 h-4" />
            Filters {hasActiveFilters && `(${[filterAction !== 'All Actions', !!filterInvestorId, !!filterDateFrom, !!filterDateTo].filter(Boolean).length})`}
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-sm">Filter Audit Logs</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors">
                  <XMarkIcon className="w-3.5 h-3.5" />
                  Clear All
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Action Type</label>
                <select
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                >
                  {ACTION_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Investor ID / Search</label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={filterInvestorId}
                    onChange={(e) => setFilterInvestorId(e.target.value)}
                    placeholder="Investor ID or keyword..."
                    className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2.5 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Date From</label>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Date To</label>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              Showing <span className="text-white font-semibold">{filteredLogs.length}</span> of {logs.length} logs
            </span>
          </div>
        )}

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {dataLoading ? (
            <div className="p-4 space-y-3">{[1,2,3,4,5].map((i) => <div key={i} className="animate-pulse h-10 bg-border/30 rounded" />)}</div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground text-sm">{hasActiveFilters ? 'No logs match the current filters.' : 'No audit logs yet.'}</p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="mt-2 text-primary text-sm hover:underline">Clear filters</button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
              <table className="min-w-full w-max text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['Action', 'Investor ID', 'Details', 'Date/Time'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                      <td className="px-4 py-3 text-primary font-semibold text-xs">{log.action}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{log.investor_id ? log.investor_id.slice(0, 8) + '...' : '—'}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs max-w-xs truncate">
                        {log.new_value ? JSON.stringify(log.new_value).slice(0, 80) : '—'}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
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
