'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { adminService, type Investor } from '@/lib/services/investorService';
import AppLogo from '@/components/ui/AppLogo';
import { HomeIcon, UsersIcon, CircleStackIcon, FolderIcon, DocumentChartBarIcon, NewspaperIcon, PhoneIcon, ClipboardDocumentListIcon, ArrowDownTrayIcon, ArrowRightOnRectangleIcon, GiftIcon, DocumentTextIcon, UserGroupIcon, BuildingStorefrontIcon, EnvelopeIcon, MagnifyingGlassIcon, ArrowPathIcon, Cog6ToothIcon, UserCircleIcon, FingerPrintIcon,  } from '@heroicons/react/24/outline';

export const adminNavItems = [
  { id: 'dashboard', label: 'Dashboard', href: '/admin', icon: <HomeIcon className="w-4 h-4" /> },
  { id: 'investors', label: 'Investors', href: '/admin/investors', icon: <UsersIcon className="w-4 h-4" /> },
  { id: 'transactions', label: 'Stake Transactions', href: '/admin/transactions', icon: <CircleStackIcon className="w-4 h-4" /> },
  { id: 'certificates', label: 'Certificates', href: '/admin/certificates', icon: <DocumentTextIcon className="w-4 h-4" /> },
  { id: 'documents', label: 'Documents', href: '/admin/documents', icon: <FolderIcon className="w-4 h-4" /> },
  { id: 'reports', label: 'Investor Reports', href: '/admin/reports', icon: <DocumentChartBarIcon className="w-4 h-4" /> },
  { id: 'updates', label: 'Investor Updates', href: '/admin/updates', icon: <NewspaperIcon className="w-4 h-4" /> },
  { id: 'beneficiaries', label: 'Beneficiaries', href: '/admin/beneficiaries', icon: <UserGroupIcon className="w-4 h-4" /> },
  { id: 'creators', label: 'Creator Programs', href: '/admin/creators', icon: <BuildingStorefrontIcon className="w-4 h-4" /> },
  { id: 'email-sms', label: 'Email / SMS', href: '/admin/email-sms', icon: <EnvelopeIcon className="w-4 h-4" /> },
  { id: 'hotline', label: 'Hotline Settings', href: '/admin/hotline', icon: <PhoneIcon className="w-4 h-4" /> },
  { id: 'welcome', label: 'Welcome Kit', href: '/admin/welcome-kit', icon: <GiftIcon className="w-4 h-4" /> },
  { id: 'login-logs', label: 'Login Logs', href: '/admin/login-logs', icon: <FingerPrintIcon className="w-4 h-4" /> },
  { id: 'audit', label: 'Audit Logs', href: '/admin/audit', icon: <ClipboardDocumentListIcon className="w-4 h-4" /> },
  { id: 'exports', label: 'Master Ledger Export', href: '/admin/exports', icon: <ArrowDownTrayIcon className="w-4 h-4" /> },
  { id: 'admin-users', label: 'Admin Users', href: '/admin/admin-users', icon: <UserCircleIcon className="w-4 h-4" /> },
  { id: 'settings', label: 'Settings', href: '/admin/settings', icon: <Cog6ToothIcon className="w-4 h-4" /> },
];

export function AdminLayout({ children, activeId }: { children: React.ReactNode; activeId: string }) {
  const { signOut } = useAuth();
  const router = useRouter();
  const handleLogout = async () => { await signOut(); router.push('/login'); };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border fixed left-0 top-0 h-full z-30 overflow-y-auto">
        <div className="px-4 pt-5 pb-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <AppLogo size={32} />
            <div>
              <div className="text-white font-extrabold text-xs tracking-widest">CHEW NETWORK</div>
              <div className="text-primary text-xs font-semibold">ADMIN PANEL</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {adminNavItems.map((item) => (
            <Link key={item.id} href={item.href} className={`nav-item ${activeId === item.id ? 'nav-item-active' : ''}`}>
              {item.icon}
              <span className="flex-1 truncate text-xs">{item.label}</span>
            </Link>
          ))}
          <div className="pt-2 border-t border-border mt-2">
            <button onClick={handleLogout} className="nav-item w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/10">
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              <span className="flex-1 truncate text-xs">Log Out</span>
            </button>
          </div>
        </nav>
      </aside>
      {/* min-w-0: as a flex child this defaults to min-width:auto, so a wide
          table (the master ledger's sixteen columns) stretches it instead of
          scrolling inside its own overflow-x container, and the whole page ends
          up scrolling sideways. The portal's AppLayout does the same. */}
      <main className="flex-1 min-w-0 lg:ml-64 min-h-screen">{children}</main>
    </div>
  );
}

export default function AdminCertificatesPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [regenerating, setRegenerating] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

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
      inv.investorId?.toLowerCase().includes(q) || inv.certificateNumber?.toLowerCase().includes(q);
  });

  const handleRegenerate = async (inv: Investor) => {
    setRegenerating(inv.id);
    await adminService.createAuditLog('CERTIFICATE_REGENERATED', inv.id, { certificateNumber: inv.certificateNumber }, { action: 'regenerated' });
    setSuccessMsg(`Certificate for ${inv.firstName} ${inv.lastName} marked for regeneration. Transaction history unchanged.`);
    setTimeout(() => setSuccessMsg(''), 4000);
    setRegenerating(null);
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!isAdmin) return null;

  return (
    <AdminLayout activeId="certificates">
      <div className="p-4 lg:p-6 space-y-5">
        <div>
          <h1 className="text-white text-2xl font-bold">Certificates</h1>
          <p className="text-muted-foreground text-sm mt-1">View and manage investor ownership certificates</p>
        </div>

        {successMsg && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
            <p className="text-green-400 text-sm">{successMsg}</p>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, investor ID, or certificate number..."
            className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
          />
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {dataLoading ? (
            <div className="p-4 space-y-3">{[1,2,3].map(i => <div key={i} className="animate-pulse h-12 bg-border/30 rounded" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center"><p className="text-muted-foreground text-sm">No investors found.</p></div>
          ) : (
            <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
              <table className="min-w-full w-max text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">Investor ID</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">Name</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">Certificate #</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">Stakes</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">Ownership</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">Status</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inv) => (
                    <tr key={inv.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                      <td className="px-4 py-3 text-primary font-bold text-xs">{inv.investorId}</td>
                      <td className="px-4 py-3 text-white text-sm">{inv.firstName} {inv.lastName}</td>
                      <td className="px-4 py-3 text-white text-xs font-mono">{inv.certificateNumber}</td>
                      <td className="px-4 py-3 text-white text-xs">{new Intl.NumberFormat('en-US').format(inv.currentStakesOwned)}</td>
                      <td className="px-4 py-3 text-white text-xs">{(inv.ownershipPercentage || 0).toFixed(7)}%</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${inv.accountStatus === 'active' ? 'badge-green' : 'bg-gray-500/20 text-gray-400'}`}>
                          {inv.accountStatus?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/certificates/${inv.id}`}
                            className="text-xs text-primary hover:underline"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleRegenerate(inv)}
                            disabled={regenerating === inv.id}
                            className="flex items-center gap-1 text-xs bg-primary/10 hover:bg-primary/20 text-primary px-2 py-1 rounded-lg transition-all disabled:opacity-50"
                          >
                            <ArrowPathIcon className="w-3 h-3" />
                            {regenerating === inv.id ? 'Processing...' : 'Reissue'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <p className="text-amber-300/80 text-xs leading-relaxed">
            <strong className="text-amber-300">Note:</strong> Reissuing a certificate creates a new certificate record and audit log entry. It does not modify, delete, or alter any transaction history or ownership records.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
