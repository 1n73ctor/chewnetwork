import React from 'react';
import {
  ShieldCheckIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  IdentificationIcon,
  LinkIcon,
  ChartPieIcon,
} from '@heroicons/react/24/outline';

const metaItems = [
  { id: 'meta-status', icon: <ShieldCheckIcon className="w-4 h-4 text-primary" />, label: 'Certificate Status', value: 'Active & Valid' },
  { id: 'meta-cert', icon: <DocumentTextIcon className="w-4 h-4 text-primary" />, label: 'Certificate Number', value: 'CERT-CN-000184' },
  { id: 'meta-issued', icon: <CalendarDaysIcon className="w-4 h-4 text-primary" />, label: 'Issue Date', value: 'May 20, 2025' },
  { id: 'meta-investor', icon: <IdentificationIcon className="w-4 h-4 text-primary" />, label: 'Investor ID', value: 'CN-000184' },
  { id: 'meta-stakes', icon: <ChartPieIcon className="w-4 h-4 text-primary" />, label: 'Linked Stakes', value: '50,000 Ecosystem Stakes' },
  { id: 'meta-round', icon: <LinkIcon className="w-4 h-4 text-primary" />, label: 'Linked Round', value: 'Phase 1 — Round One' },
];

export default function CertificateMetaPanel() {
  return (
    <div className="space-y-4">
      <div className="card-surface p-5">
        <h3 className="text-white font-semibold text-sm mb-4">Certificate Details</h3>
        <div className="space-y-4">
          {metaItems?.map((item) => (
            <div key={item?.id} className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">{item?.icon}</div>
              <div>
                <p className="text-muted-foreground text-xs">{item?.label}</p>
                <p className="text-white text-sm font-semibold font-tabular">{item?.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Validity notice */}
      <div className="card-surface p-4 border-l-2 border-green-500">
        <div className="flex items-start gap-2">
          <ShieldCheckIcon className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white text-xs font-semibold mb-1">Certificate Verified</p>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              This certificate is digitally verified and linked to your Chew Network investor account. Ownership is recorded in the official investor registry.
            </p>
          </div>
        </div>
      </div>
      {/* Transfer status */}
      <div className="card-surface p-4">
        <p className="text-muted-foreground text-xs mb-2">Transfer / Liquidity Status</p>
        <span className="badge-gray">NOT YET OPEN</span>
        <p className="text-muted-foreground text-[11px] mt-2 leading-relaxed">
          Transfers will open in Phase 2 (2027) subject to Offering Documents.
        </p>
      </div>
    </div>
  );
}