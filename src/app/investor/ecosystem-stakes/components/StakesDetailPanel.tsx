import React from 'react';
import {
  DocumentTextIcon,
  CalendarDaysIcon,
  IdentificationIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const details = [
  { id: 'det-id', icon: <IdentificationIcon className="w-4 h-4 text-primary" />, label: 'Investor ID', value: 'CN-000184' },
  { id: 'det-cert', icon: <DocumentTextIcon className="w-4 h-4 text-primary" />, label: 'Certificate Number', value: 'CERT-CN-000184' },
  { id: 'det-date', icon: <CalendarDaysIcon className="w-4 h-4 text-primary" />, label: 'Purchase Date', value: 'May 20, 2025' },
  { id: 'det-round', icon: <ShieldCheckIcon className="w-4 h-4 text-primary" />, label: 'Investment Round', value: 'Phase 1 — Round One' },
];

export default function StakesDetailPanel() {
  return (
    <div className="card-surface p-5 space-y-4">
      <h3 className="text-white font-semibold text-sm">Stake Details</h3>
      {details?.map((d) => (
        <div key={d?.id} className="flex items-start gap-3">
          <div className="mt-0.5">{d?.icon}</div>
          <div>
            <p className="text-muted-foreground text-xs">{d?.label}</p>
            <p className="text-white text-sm font-semibold font-tabular">{d?.value}</p>
          </div>
        </div>
      ))}
      <div className="pt-2 border-t border-border">
        <p className="text-muted-foreground text-xs mb-1.5">Account Status</p>
        <span className="badge-green">Active — Founding Owner</span>
      </div>
      <div>
        <p className="text-muted-foreground text-xs mb-1.5">Transfer Status</p>
        <span className="badge-gray">LOCKED — NOT YET OPEN</span>
      </div>
      <button className="w-full mt-2 px-4 py-2.5 rounded-lg border border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-white transition-all duration-150 active:scale-95">
        Download Certificate
      </button>
    </div>
  );
}