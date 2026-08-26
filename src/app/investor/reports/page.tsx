'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/portal/AppLayout';
import { investorService, type InvestorReport } from '@/lib/services/investorService';
import { DocumentChartBarIcon, EyeIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

export default function InvestorReportsPage() {
  const [reports, setReports] = useState<InvestorReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    investorService.getReports().then((data) => {
      setReports(data);
      setLoading(false);
    });
  }, []);

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-4">
        <div>
          <h1 className="text-white text-2xl font-bold">Investor Reports</h1>
          <p className="text-muted-foreground text-sm mt-1">Official quarterly and annual reports from Chew Network</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-card border border-border rounded-xl h-40" />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <DocumentChartBarIcon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-white font-semibold mb-1">No Reports Yet</p>
            <p className="text-muted-foreground text-sm">Investor reports will appear here when published.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all group">
                <div className="h-1 bg-gradient-to-r from-primary to-amber-400" />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <DocumentChartBarIcon className="w-5 h-5 text-primary" />
                    <span className="text-xs font-bold text-primary tracking-widest">
                      {report.quarter} {report.year}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1 group-hover:text-primary transition-colors">
                    {report.title}
                  </h3>
                  <p className="text-muted-foreground text-xs mb-4">
                    Published: {report.datePublished}
                  </p>
                  <div className="flex gap-2">
                    {report.fileUrl ? (
                      <>
                        <a
                          href={report.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 bg-background border border-border hover:border-primary/50 text-white px-3 py-2 rounded-lg text-xs font-medium transition-all flex-1 justify-center"
                        >
                          <EyeIcon className="w-3.5 h-3.5" />
                          View PDF
                        </a>
                        <a
                          href={report.fileUrl}
                          download
                          className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all"
                        >
                          <DocumentArrowDownIcon className="w-3.5 h-3.5" />
                        </a>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">Report coming soon</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
