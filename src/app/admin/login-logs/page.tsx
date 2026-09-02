'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminService, type Investor } from '@/lib/services/investorService';
import { AdminLayout } from '../certificates/page';
import { MagnifyingGlassIcon, XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

type Outcome = 'All' | 'Successful' | 'Failed';

const FAILED = 'Login Failed';

/** Turns a user-agent string into something readable at a glance. */
const describeDevice = (ua?: string | null): string => {
  if (!ua) return '—';
  const os = /iPhone|iPad/.test(ua) ? 'iOS'
    : /Android/.test(ua) ? 'Android'
    : /Mac OS X/.test(ua) ? 'macOS'
    : /Windows/.test(ua) ? 'Windows'
    : /Linux/.test(ua) ? 'Linux'
    : 'Unknown OS';
  const browser = /Edg\//.test(ua) ? 'Edge'
    : /OPR\//.test(ua) ? 'Opera'
    : /Chrome\//.test(ua) ? 'Chrome'
    : /Safari\//.test(ua) ? 'Safari'
    : /Firefox\//.test(ua) ? 'Firefox'
    : 'Unknown browser';
  return `${browser} · ${os}`;
};

const REASON_LABEL: Record<string, string> = {
  invalid_credentials: 'Wrong email or password',
  account_blocked: 'Account deactivated',
};

export default function AdminLoginLogsPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [outcome, setOutcome] = useState<Outcome>('All');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    if (!loading && !isAdmin) router.push('/');
  }, [isAdmin, loading]);

  useEffect(() => {
    if (!isAdmin) return;
    // Names live on the investors table. user_profiles is readable only by its
    // own owner, so that is the only source an admin has for anyone but
    // themselves — which is also why admin sign-ins fall back to the address.
    Promise.all([adminService.getLoginLogs(), adminService.getAllInvestors()])
      .then(([logRows, investorRows]) => {
        setLogs(logRows);
        setInvestors(investorRows);
      })
      .finally(() => setDataLoading(false));
  }, [isAdmin]);

  /** Investor lookups, keyed both ways: successes carry a row id, failures an email. */
  const byId = useMemo(
    () => new Map(investors.map((i) => [i.id, i])),
    [investors]
  );
  const byEmail = useMemo(
    () => new Map(investors.map((i) => [(i.email || '').toLowerCase(), i])),
    [investors]
  );

  /** The person behind a log row: a name where we have one, the address otherwise. */
  const describeAccount = (log: any): { name: string; detail: string } => {
    const email = (log.new_value?.email || '').toLowerCase();
    const investor = (log.investor_id && byId.get(log.investor_id)) || (email && byEmail.get(email)) || null;

    if (investor) {
      const name = `${investor.firstName} ${investor.lastName}`.trim();
      return {
        name: name || investor.email || '—',
        detail: investor.investorId || investor.email || '',
      };
    }
    // No investor row: an admin, or an address that has never belonged to one.
    return { name: email || '—', detail: email ? '' : 'unknown account' };
  };

  const clearFilters = () => {
    setOutcome('All');
    setSearch('');
    setDateFrom('');
    setDateTo('');
  };

  const hasFilters = outcome !== 'All' || search || dateFrom || dateTo;

  const filtered = useMemo(() => logs.filter((log) => {
    const failed = log.action === FAILED;
    if (outcome === 'Successful' && failed) return false;
    if (outcome === 'Failed' && !failed) return false;

    if (search) {
      const q = search.toLowerCase();
      const account = describeAccount(log);
      const haystack = [
        log.ip_address,
        log.new_value?.email,
        log.investor_id,
        log.session_info,
        account.name,
        account.detail,
      ].filter(Boolean).join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (dateFrom && new Date(log.created_at) < new Date(dateFrom)) return false;
    if (dateTo && new Date(log.created_at) > new Date(dateTo + 'T23:59:59')) return false;
    return true;
  }), [logs, outcome, search, dateFrom, dateTo, byId, byEmail]);

  const failedCount = useMemo(() => logs.filter((l) => l.action === FAILED).length, [logs]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!isAdmin) return null;

  return (
    <AdminLayout activeId="login-logs">
      <div className="p-4 lg:p-6 space-y-4">
        <div>
          <h1 className="text-white text-2xl font-bold">Login Logs</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Every sign-in and refused attempt, with the address it came from
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total Recorded', value: logs.length },
            { label: 'Successful', value: logs.length - failedCount },
            { label: 'Failed Attempts', value: failedCount },
            { label: 'Distinct IPs', value: new Set(logs.map((l) => l.ip_address).filter(Boolean)).size },
          ].map((stat) => (
            <div key={stat.label} className="stat-card">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-white font-bold text-lg">{dataLoading ? '...' : stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Outcome</label>
              <select
                value={outcome}
                onChange={(e) => setOutcome(e.target.value as Outcome)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              >
                {['All', 'Successful', 'Failed'].map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Email / IP</label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Email address or IP..."
                  className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2.5 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Date From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Date To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
          {hasFilters && (
            <div className="flex items-center gap-3 mt-3">
              <span className="text-muted-foreground text-xs">
                Showing <span className="text-white font-semibold">{filtered.length}</span> of {logs.length}
              </span>
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-white transition-colors">
                <XMarkIcon className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl">
          {dataLoading ? (
            <div className="p-4 space-y-3">{[1, 2, 3, 4, 5].map((i) => <div key={i} className="animate-pulse h-10 bg-border/30 rounded" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground text-sm">
                {logs.length === 0
                  ? 'No sign-ins recorded yet. Logging begins once the login-log migration is applied.'
                  : 'No entries match the current filters.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto overscroll-x-contain rounded-xl [-webkit-overflow-scrolling:touch]">
              <table className="min-w-full w-max text-xs">
                <thead>
                  <tr className="border-b border-border bg-background/30">
                    {['Outcome', 'Account', 'IP Address', 'Device', 'Detail', 'Date/Time'].map((h) => (
                      <th key={h} className="text-left px-4 py-2.5 text-muted-foreground font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((log) => {
                    const failed = log.action === FAILED;
                    return (
                      <tr key={log.id} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 font-semibold ${failed ? 'text-red-400' : 'text-green-400'}`}>
                            {failed
                              ? <ExclamationTriangleIcon className="w-3.5 h-3.5" />
                              : <CheckCircleIcon className="w-3.5 h-3.5" />}
                            {failed ? 'Failed' : log.action === 'Admin Login' ? 'Admin' : 'Investor'}
                          </span>
                        </td>
                        {/* A failed attempt has no session, so it is keyed on the
                            address that was tried; a success is keyed on the row. */}
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          {(() => {
                            const account = describeAccount(log);
                            return (
                              <>
                                <span className="text-white font-medium">{account.name}</span>
                                {account.detail && (
                                  <span className="block text-[11px] text-muted-foreground">{account.detail}</span>
                                )}
                              </>
                            );
                          })()}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-white whitespace-nowrap">{log.ip_address || '—'}</td>
                        <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap" title={log.session_info || ''}>
                          {describeDevice(log.session_info)}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">
                          {failed
                            ? (REASON_LABEL[log.new_value?.reason] || log.new_value?.reason || '—')
                            : log.new_value?.knownInvestor === false ? 'Unrecognised address' : '—'}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
