import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const transactions = [
  {
    id: 'txn-001',
    date: 'May 20, 2025',
    type: 'Purchase',
    stakes: 50000,
    pricePerStake: '$0.01',
    totalAmount: '$500.00',
    round: 'Phase 1',
    cert: 'CERT-CN-000184',
    status: 'Completed',
  },
];

export default function TransactionHistory() {
  return (
    <div className="card-surface p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-sm">Transaction History</h3>
        <span className="text-muted-foreground text-xs">1 transaction</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {['Date', 'Type', 'Stakes', 'Price / Stake', 'Total', 'Round', 'Certificate', 'Status']?.map((col) => (
                <th key={`th-${col}`} className="text-left text-xs text-muted-foreground font-medium pb-3 pr-4 whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions?.map((tx) => (
              <tr key={tx?.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-3 pr-4 text-white text-xs font-medium whitespace-nowrap">{tx?.date}</td>
                <td className="py-3 pr-4">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">{tx?.type}</span>
                </td>
                <td className="py-3 pr-4 text-white text-xs font-tabular whitespace-nowrap">{tx?.stakes?.toLocaleString()}</td>
                <td className="py-3 pr-4 text-white text-xs font-tabular">{tx?.pricePerStake}</td>
                <td className="py-3 pr-4 text-white text-xs font-tabular font-semibold">{tx?.totalAmount}</td>
                <td className="py-3 pr-4 text-muted-foreground text-xs whitespace-nowrap">{tx?.round}</td>
                <td className="py-3 pr-4 text-muted-foreground text-xs font-mono whitespace-nowrap">{tx?.cert}</td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-1">
                    <CheckCircleIcon className="w-3.5 h-3.5 text-green-400" />
                    <span className="badge-green text-[11px]">{tx?.status}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}