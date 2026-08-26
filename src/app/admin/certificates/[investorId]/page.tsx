'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminService, type Investor } from '@/lib/services/investorService';
import { AdminLayout } from '../../certificates/page';
import { ArrowLeftIcon, ArrowPathIcon, PrinterIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function AdminCertificateViewPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const investorId = params?.investorId as string;
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!loading && !isAdmin) router.push('/');
  }, [isAdmin, loading]);

  useEffect(() => {
    if (isAdmin && investorId) {
      adminService.getInvestorById(investorId).then((data) => {
        setInvestor(data);
        setDataLoading(false);
      });
    }
  }, [isAdmin, investorId]);

  const handleRegenerate = async () => {
    if (!investor) return;
    setRegenerating(true);
    await adminService.createAuditLog('CERTIFICATE_REGENERATED', investor.id, { certificateNumber: investor.certificateNumber }, { action: 'regenerated', adminView: true });
    setSuccessMsg('Certificate marked for regeneration. Transaction history unchanged.');
    setTimeout(() => setSuccessMsg(''), 4000);
    setRegenerating(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || dataLoading) return (
    <AdminLayout activeId="certificates">
      <div className="p-6 flex items-center justify-center min-h-64">
        <p className="text-muted-foreground">Loading certificate...</p>
      </div>
    </AdminLayout>
  );
  if (!isAdmin) return null;
  if (!investor) return (
    <AdminLayout activeId="certificates">
      <div className="p-6">
        <p className="text-muted-foreground">Investor not found.</p>
        <Link href="/admin/certificates" className="text-primary text-sm hover:underline mt-2 inline-block">← Back to Certificates</Link>
      </div>
    </AdminLayout>
  );

  const formatStakes = (val: number) => new Intl.NumberFormat('en-US').format(val || 0);

  return (
    <AdminLayout activeId="certificates">
      <div className="p-4 lg:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/certificates" className="text-muted-foreground hover:text-white transition-colors">
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-white text-2xl font-bold">Certificate View</h1>
              <p className="text-muted-foreground text-sm mt-0.5">{investor.firstName} {investor.lastName} — {investor.investorId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-card border border-border hover:border-primary text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
            >
              <PrinterIcon className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
            >
              <ArrowPathIcon className="w-4 h-4" />
              {regenerating ? 'Processing...' : 'Reissue Certificate'}
            </button>
          </div>
        </div>

        {successMsg && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 print:hidden">
            <p className="text-green-400 text-sm">{successMsg}</p>
          </div>
        )}

        {/* Admin Info Panel */}
        <div className="bg-card border border-border rounded-xl p-4 print:hidden">
          <h3 className="text-white font-bold text-sm mb-3">Investor Details</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Account Status', value: investor.accountStatus?.toUpperCase() },
              { label: 'Round', value: investor.round },
              { label: 'Join Date', value: investor.joinDate },
              { label: 'Original Investment', value: `$${investor.originalInvestment?.toLocaleString()}` },
            ].map((f, i) => (
              <div key={i} className="bg-background rounded-lg p-3 border border-border/50">
                <p className="text-xs text-muted-foreground font-semibold tracking-widest mb-0.5">{f.label.toUpperCase()}</p>
                <p className="text-white text-sm font-medium">{f.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Certificate Document */}
        <div className="bg-card border border-border rounded-xl overflow-hidden border-2 border-primary/30 shadow-2xl shadow-primary/10">
          {/* Header band */}
          <div className="bg-primary px-8 py-5 flex items-center justify-between">
            <div>
              <p className="text-white text-xs font-bold tracking-widest uppercase opacity-80">Official Certificate of</p>
              <p className="text-white text-xl font-extrabold tracking-wide">Ecosystem Stake Ownership</p>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-xs font-semibold tracking-widest">CHEW NETWORK</p>
              <p className="text-white/70 text-[10px] tracking-wider">See It. Cook It.</p>
            </div>
          </div>

          {/* Certificate body */}
          <div className="px-8 py-8 bg-gradient-to-br from-[#1A1A2A] to-[#13131F]">
            <div className="border border-primary/20 rounded-xl p-6 relative">
              {/* Corner ornaments */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary/60 rounded-tl" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary/60 rounded-tr" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary/60 rounded-bl" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary/60 rounded-br" />

              <div className="text-center mb-6">
                <p className="text-muted-foreground text-xs tracking-widest uppercase mb-2">This certifies that</p>
                <p className="text-white text-3xl font-extrabold tracking-tight">{investor.firstName} {investor.lastName}</p>
                <p className="text-primary text-sm font-semibold mt-1">Founding Owner &amp; Investor</p>
              </div>

              <div className="text-center mb-6">
                <p className="text-muted-foreground text-xs mb-1">is the registered owner of</p>
                <p className="text-white text-5xl font-extrabold tracking-tight">{formatStakes(investor.currentStakesOwned)}</p>
                <p className="text-primary text-base font-semibold mt-1">Ecosystem Stakes</p>
                <p className="text-muted-foreground text-xs mt-1">
                  representing <span className="text-white font-semibold">{(investor.ownershipPercentage || 0).toFixed(7)}%</span> of Chew Network
                </p>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                <div className="bg-card/60 rounded-lg p-3">
                  <p className="text-muted-foreground text-[10px] uppercase tracking-widest mb-1">Certificate Number</p>
                  <p className="text-white text-sm font-bold font-mono">{investor.certificateNumber}</p>
                </div>
                <div className="bg-card/60 rounded-lg p-3">
                  <p className="text-muted-foreground text-[10px] uppercase tracking-widest mb-1">Investor ID</p>
                  <p className="text-white text-sm font-bold font-mono">{investor.investorId}</p>
                </div>
                <div className="bg-card/60 rounded-lg p-3">
                  <p className="text-muted-foreground text-[10px] uppercase tracking-widest mb-1">Issue Date</p>
                  <p className="text-white text-sm font-bold">{investor.joinDate ? new Date(investor.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</p>
                </div>
                <div className="bg-card/60 rounded-lg p-3">
                  <p className="text-muted-foreground text-[10px] uppercase tracking-widest mb-1">Investment Round</p>
                  <p className="text-white text-sm font-bold">{investor.round}</p>
                </div>
              </div>

              {/* QR + signature row */}
              <div className="flex items-end justify-between mt-2">
                <div className="w-20 h-20 bg-white rounded-lg p-1.5 flex-shrink-0">
                  <div className="w-full h-full bg-black rounded grid grid-cols-5 gap-0.5 p-1">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={`qr-${i}`}
                        className="rounded-sm"
                        style={{ background: [0,1,2,3,4,5,6,7,10,12,14,17,18,19,20,21,22,23,24].includes(i) ? '#FFFFFF' : '#000000' }}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-32 border-b border-primary/40 mb-1 mx-auto" />
                  <p className="text-muted-foreground text-[10px]">Authorized Signature</p>
                  <p className="text-white text-xs font-semibold mt-0.5">Chew Network Inc.</p>
                </div>
                <div className="w-16 h-16 rounded-full border-2 border-primary/60 flex items-center justify-center flex-shrink-0">
                  <div className="w-12 h-12 rounded-full border border-primary/40 flex items-center justify-center">
                    <span className="text-2xl">🍴</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-3 bg-card/50 border-t border-border flex items-center justify-between">
            <p className="text-muted-foreground text-[10px]">This certificate is issued by Chew Network Inc. and is subject to the terms of the Offering Documents.</p>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ml-4 ${investor.accountStatus === 'active' ? 'badge-green' : 'bg-gray-500/20 text-gray-400'}`}>
              {investor.accountStatus === 'active' ? 'Verified Active' : investor.accountStatus?.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 print:hidden">
          <p className="text-amber-300/80 text-xs leading-relaxed">
            <strong className="text-amber-300">Admin View:</strong> This is the admin-specific certificate view for {investor.firstName} {investor.lastName}. Reissuing creates an audit log entry without modifying transaction history.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
