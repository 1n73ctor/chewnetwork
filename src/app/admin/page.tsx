'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { adminService, type Investor } from '@/lib/services/investorService';
import { createClient } from '@/lib/supabase/client';
import { AdminLayout } from './certificates/page';
import { PlusIcon, CircleStackIcon, NewspaperIcon, DocumentChartBarIcon, FolderIcon, PhoneIcon, ClipboardDocumentListIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function AdminDashboardPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    }
  }, [isAdmin, loading]);

  const fetchInvestors = useCallback(async () => {
    const data = await adminService.getAllInvestors();
    setInvestors(data);
    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    fetchInvestors();

    const supabase = createClient();
    const channel = supabase
      .channel('admin-dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'investors' }, () => { fetchInvestors(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stake_transactions' }, () => { fetchInvestors(); })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isAdmin, fetchInvestors]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!isAdmin) return null;

  const totalStakes = investors.reduce((sum, inv) => sum + (inv.currentStakesOwned || 0), 0);
  const totalInvestment = investors.reduce((sum, inv) => sum + (inv.originalInvestment || 0), 0);
  const activeInvestors = investors.filter((inv) => inv.accountStatus === 'active').length;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  const formatStakes = (val: number) => new Intl.NumberFormat('en-US').format(val);

  return (
    <AdminLayout activeId="dashboard">
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-white text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Chew Network Investor Back Office — Admin View</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total Investors', value: dataLoading ? '...' : investors.length.toString(), sub: 'Registered' },
            { label: 'Active Investors', value: dataLoading ? '...' : activeInvestors.toString(), sub: 'Active accounts' },
            { label: 'Total Stakes Issued', value: dataLoading ? '...' : formatStakes(totalStakes), sub: 'Ecosystem Stakes' },
            { label: 'Total Investment', value: dataLoading ? '...' : formatCurrency(totalInvestment), sub: 'USD raised' },
          ].map((stat, i) => (
            <div key={i} className="stat-card">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-white font-bold text-xl">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-white font-bold text-sm mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { label: 'Add Investor', href: '/admin/investors?action=add', icon: <PlusIcon className="w-5 h-5" /> },
              { label: 'Add Transaction', href: '/admin/transactions?action=add', icon: <CircleStackIcon className="w-5 h-5" /> },
              { label: 'Publish Update', href: '/admin/updates?action=add', icon: <NewspaperIcon className="w-5 h-5" /> },
              { label: 'Upload Report', href: '/admin/reports?action=add', icon: <DocumentChartBarIcon className="w-5 h-5" /> },
              { label: 'Upload Document', href: '/admin/documents?action=add', icon: <FolderIcon className="w-5 h-5" /> },
              { label: 'Hotline Settings', href: '/admin/hotline', icon: <PhoneIcon className="w-5 h-5" /> },
              { label: 'Audit Logs', href: '/admin/audit', icon: <ClipboardDocumentListIcon className="w-5 h-5" /> },
              { label: 'Export Ledger', href: '/admin/exports', icon: <ArrowDownTrayIcon className="w-5 h-5" /> },
            ].map((action, i) => (
              <Link
                key={i}
                href={action.href}
                className="bg-card border border-border hover:border-primary/50 hover:bg-primary/5 rounded-xl p-4 flex flex-col items-center gap-2 transition-all group"
              >
                <div className="text-primary group-hover:scale-110 transition-transform">{action.icon}</div>
                <span className="text-white text-xs font-medium text-center">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Investor list */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-bold text-sm">All Investors</h2>
            <Link href="/admin/investors" className="text-xs text-primary hover:underline">View All →</Link>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {dataLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => <div key={i} className="animate-pulse h-12 bg-border/30 rounded" />)}
              </div>
            ) : investors.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground text-sm">No investors yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">Investor ID</th>
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">Name</th>
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">Stakes</th>
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">Ownership</th>
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">Status</th>
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">Round</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investors.map((inv) => (
                      <tr key={inv.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                        <td className="px-4 py-3 text-primary font-bold text-xs">{inv.investorId}</td>
                        <td className="px-4 py-3 text-white">{inv.firstName} {inv.lastName}</td>
                        <td className="px-4 py-3 text-white">{new Intl.NumberFormat('en-US').format(inv.currentStakesOwned)}</td>
                        <td className="px-4 py-3 text-white text-xs">{(inv.ownershipPercentage || 0).toFixed(7)}%</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${inv.accountStatus === 'active' ? 'badge-green' : 'bg-gray-500/20 text-gray-400'}`}>
                            {inv.accountStatus?.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{inv.round}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
