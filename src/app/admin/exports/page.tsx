'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminService, type Investor } from '@/lib/services/investorService';
import { AdminLayout } from '../certificates/page';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function AdminExportsPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // The hint used to be guessed from a breakpoint (hidden below sm, hidden
  // again from lg up), which meant it was absent on a phone and absent on a
  // desktop — the two places the sixteen columns most obviously run off the
  // edge. Measure the real overflow instead, and hide it once you've scrolled.
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [overflow, setOverflow] = useState({ can: false, atStart: true });

  useEffect(() => {
    if (!loading && !isAdmin) router.push('/');
  }, [isAdmin, loading]);

  useEffect(() => {
    if (isAdmin) {
      adminService.getAllInvestors().then((data) => { setInvestors(data); setDataLoading(false); });
    }
  }, [isAdmin]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const measure = () => setOverflow({
      can: el.scrollWidth > el.clientWidth + 1,
      atStart: el.scrollLeft < 8,
    });

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    el.addEventListener('scroll', measure, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener('scroll', measure);
    };
  }, [dataLoading, investors.length]);

  const formatStakes = (val: number) => new Intl.NumberFormat('en-US').format(val || 0);
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

  const getHeaders = () => [
    'Investor ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Round',
    'Original Investment', 'Total Investment', 'Stake Price', 'Original Stakes', 'Additional Stakes',
    'Transfers In', 'Transfers Out', 'Redeemed / Sold', 'Company Repurchases', 'Current Stakes',
    'Ownership %', 'Join Date', 'Certificate Number', 'Account Status',
  ];

  const getRows = () => investors.map((inv) => [
    inv.investorId, inv.firstName, inv.lastName, inv.email, inv.phone || '',
    inv.round, inv.originalInvestment, inv.totalInvestment, inv.originalStakePrice,
    inv.originalStakesPurchased, inv.additionalStakesPurchased,
    // stakesTransferred is transfers out; stakesSold is redemptions. They were
    // previously the same value, so this column reported the wrong one.
    0, inv.stakesTransferred, inv.stakesSold, inv.stakesRepurchased, inv.currentStakesOwned,
    inv.ownershipPercentage?.toFixed(10), inv.joinDate,
    inv.certificateNumber, inv.accountStatus,
  ]);

  const exportCSV = () => {
    const headers = getHeaders();
    const rows = getRows();
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chew-network-master-ledger-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    adminService.createAuditLog('LEDGER_EXPORTED', undefined, undefined, { format: 'CSV', count: investors.length });
  };

  const exportExcel = () => {
    // Build a simple HTML table that Excel can open
    const headers = getHeaders();
    const rows = getRows();
    let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">';
    html += '<head><meta charset="UTF-8"></head><body><table>';
    html += '<tr>' + headers.map(h => `<th style="background:#f0f0f0;font-weight:bold">${h}</th>`).join('') + '</tr>';
    rows.forEach(row => {
      html += '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
    });
    html += '</table></body></html>';
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chew-network-master-ledger-${new Date().toISOString().split('T')[0]}.xls`;
    a.click();
    URL.revokeObjectURL(url);
    adminService.createAuditLog('LEDGER_EXPORTED', undefined, undefined, { format: 'Excel', count: investors.length });
  };

  const exportPDF = () => {
    const headers = getHeaders();
    const rows = getRows();
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const totalStakes = investors.reduce((s, i) => s + (i.currentStakesOwned || 0), 0);
    const totalInvestment = investors.reduce((s, i) => s + (i.totalInvestment || 0), 0);

    let html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <title>Chew Network Master Ledger</title>
    <style>
      body { font-family: Arial, sans-serif; font-size: 9px; color: #333; margin: 20px; }
      h1 { font-size: 16px; color: #E85D04; margin-bottom: 4px; }
      .subtitle { font-size: 11px; color: #666; margin-bottom: 16px; }
      .stats { display: flex; gap: 20px; margin-bottom: 16px; }
      .stat { background: #f5f5f5; padding: 8px 12px; border-radius: 6px; }
      .stat-label { font-size: 8px; color: #999; text-transform: uppercase; }
      .stat-value { font-size: 13px; font-weight: bold; color: #333; }
      table { width: 100%; border-collapse: collapse; }
      th { background: #E85D04; color: white; padding: 5px 4px; text-align: left; font-size: 8px; white-space: nowrap; }
      td { padding: 4px; border-bottom: 1px solid #eee; font-size: 8px; }
      tr:nth-child(even) td { background: #fafafa; }
      .footer { margin-top: 16px; font-size: 8px; color: #999; }
    </style></head><body>
    <h1>Chew Network — Master Ledger Export</h1>
    <div class="subtitle">Generated: ${dateStr} &nbsp;|&nbsp; ${investors.length} investors</div>
    <div class="stats">
      <div class="stat"><div class="stat-label">Total Investors</div><div class="stat-value">${investors.length}</div></div>
      <div class="stat"><div class="stat-label">Total Stakes</div><div class="stat-value">${formatStakes(totalStakes)}</div></div>
      <div class="stat"><div class="stat-label">Total Investment</div><div class="stat-value">${formatCurrency(totalInvestment)}</div></div>
    </div>
    <table><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>`;
    rows.forEach(row => {
      html += '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
    });
    html += `</tbody></table>
    <div class="footer">This document is confidential and intended for authorized Chew Network personnel only. © Chew Network Inc.</div>
    </body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
        URL.revokeObjectURL(url);
      };
    }
    adminService.createAuditLog('LEDGER_EXPORTED', undefined, undefined, { format: 'PDF', count: investors.length });
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!isAdmin) return null;

  return (
    <AdminLayout activeId="exports">
      <div className="p-4 lg:p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-white text-2xl font-bold">Master Ledger Export</h1>
            <p className="text-muted-foreground text-sm mt-1">Export the complete Ecosystem Stake ownership ledger</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={exportCSV}
              disabled={dataLoading}
              className="flex items-center gap-2 bg-card border border-border hover:border-primary disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              CSV
            </button>
            <button
              onClick={exportExcel}
              disabled={dataLoading}
              className="flex items-center gap-2 bg-card border border-border hover:border-primary disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Excel
            </button>
            <button
              onClick={exportPDF}
              disabled={dataLoading}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              PDF
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total Investors', value: investors.length.toString() },
            { label: 'Total Stakes Issued', value: formatStakes(investors.reduce((s, i) => s + (i.currentStakesOwned || 0), 0)) },
            { label: 'Total Investment', value: formatCurrency(investors.reduce((s, i) => s + (i.totalInvestment || 0), 0)) },
            { label: 'Total Ownership Issued', value: `${investors.reduce((s, i) => s + (i.ownershipPercentage || 0), 0).toFixed(7)}%` },
          ].map((stat, i) => (
            <div key={i} className="stat-card">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-white font-bold text-lg">{dataLoading ? '...' : stat.value}</p>
            </div>
          ))}
        </div>

        {/* Full ledger table */}
        <div className="bg-card border border-border rounded-xl">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-3">
            <h3 className="text-white font-bold text-sm">Complete Ownership Ledger</h3>
            <div className="flex items-center gap-3">
              {overflow.can && overflow.atStart && (
                <span className="text-xs text-primary font-semibold whitespace-nowrap">Scroll for more columns →</span>
              )}
              <span className="text-xs text-muted-foreground whitespace-nowrap">{investors.length} records</span>
            </div>
          </div>
          {/* 16 columns cannot fit any screen. min-w-full + w-max lets the
              table exceed its container so the wrapper below scrolls; w-full
              would shrink it to fit and squash the columns instead. */}
          {dataLoading ? (
            <div className="p-4 space-y-3">{[1,2,3].map((i) => <div key={i} className="animate-pulse h-10 bg-border/30 rounded" />)}</div>
          ) : (
            <div className="relative">
              {/* Fades the cut-off column rather than letting it end mid-glyph,
                  which is what made the table read as broken instead of wide. */}
              {overflow.can && (
                <div className="pointer-events-none absolute right-0 top-0 bottom-2.5 w-12 z-20 bg-gradient-to-l from-card to-transparent" />
              )}
              <div
                ref={scrollRef}
                className="overflow-x-auto overscroll-x-contain scrollbar-visible rounded-b-xl [-webkit-overflow-scrolling:touch]"
              >
              <table className="min-w-full w-max text-xs">
                <thead>
                  <tr className="border-b border-border bg-background/30">
                    {['Investor ID', 'Name', 'Email', 'Round', 'Total Invested', 'Stake Price', 'Orig Stakes', 'Add Stakes', 'Transferred', 'Redeemed', 'Repurchased', 'Current Stakes', 'Ownership %', 'Join Date', 'Cert #', 'Status'].map((h, i) => (
                      <th
                        key={h}
                        className={`text-left px-3 py-2 text-muted-foreground font-semibold whitespace-nowrap ${
                          i === 0 ? 'sticky left-0 z-10 bg-card' : ''
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {investors.map((inv) => (
                    <tr key={inv.id} className="border-b border-border/30 hover:bg-primary/5 transition-colors group">
                      {/* Anchored so the row stays identifiable once the other
                          fifteen columns have scrolled past. */}
                      <td className="px-3 py-2 text-primary font-bold sticky left-0 z-10 bg-card group-hover:bg-card whitespace-nowrap">
                        {inv.investorId}
                      </td>
                      <td className="px-3 py-2 text-white whitespace-nowrap">{inv.firstName} {inv.lastName}</td>
                      <td className="px-3 py-2 text-muted-foreground">{inv.email}</td>
                      <td className="px-3 py-2 text-muted-foreground">{inv.round}</td>
                      <td className="px-3 py-2 text-white">{formatCurrency(inv.totalInvestment)}</td>
                      <td className="px-3 py-2 text-white">${inv.originalStakePrice?.toFixed(4)}</td>
                      <td className="px-3 py-2 text-white">{formatStakes(inv.originalStakesPurchased)}</td>
                      <td className="px-3 py-2 text-white">{formatStakes(inv.additionalStakesPurchased)}</td>
                      <td className="px-3 py-2 text-white">{formatStakes(inv.stakesTransferred)}</td>
                      <td className="px-3 py-2 text-white">{formatStakes(inv.stakesSold)}</td>
                      <td className="px-3 py-2 text-white">{formatStakes(inv.stakesRepurchased)}</td>
                      <td className="px-3 py-2 text-primary font-bold">{formatStakes(inv.currentStakesOwned)}</td>
                      <td className="px-3 py-2 text-white">{(inv.ownershipPercentage || 0).toFixed(7)}%</td>
                      <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{inv.joinDate}</td>
                      <td className="px-3 py-2 text-muted-foreground">{inv.certificateNumber}</td>
                      <td className="px-3 py-2">
                        <span className={`px-1.5 py-0.5 rounded-full font-semibold ${inv.accountStatus === 'active' ? 'badge-green' : 'bg-gray-500/20 text-gray-400'}`}>
                          {inv.accountStatus?.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
