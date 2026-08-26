'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/portal/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { investorService, type InvestorDocument } from '@/lib/services/investorService';
import { FolderIcon, DocumentArrowDownIcon, EyeIcon } from '@heroicons/react/24/outline';

const docTypeLabels: Record<string, string> = {
  signed_agreement: 'Signed Agreement',
  investment_certificate: 'Investment Certificate',
  welcome_kit: 'Welcome Kit',
  payment_receipt: 'Payment Receipt',
  ownership_document: 'Ownership Document',
  quarterly_report: 'Quarterly Report',
  transaction_document: 'Transaction Document',
  beneficiary_document: 'Beneficiary Document',
  other: 'Other',
};

const docTypeColors: Record<string, string> = {
  signed_agreement: 'text-green-400 bg-green-400/10',
  investment_certificate: 'text-primary bg-primary/10',
  welcome_kit: 'text-amber-400 bg-amber-400/10',
  payment_receipt: 'text-blue-400 bg-blue-400/10',
  ownership_document: 'text-purple-400 bg-purple-400/10',
  quarterly_report: 'text-cyan-400 bg-cyan-400/10',
  transaction_document: 'text-yellow-400 bg-yellow-400/10',
  beneficiary_document: 'text-pink-400 bg-pink-400/10',
  other: 'text-gray-400 bg-gray-400/10',
};

export default function MyDocumentsPage() {
  const { investorProfile } = useAuth();
  const [documents, setDocuments] = useState<InvestorDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    investorService.getMyDocuments().then((data) => {
      setDocuments(data);
      setLoading(false);
    });
  }, []);

  const grouped = documents.reduce((acc, doc) => {
    const key = doc.documentType;
    if (!acc[key]) acc[key] = [];
    acc[key].push(doc);
    return acc;
  }, {} as Record<string, InvestorDocument[]>);

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-4">
        <div>
          <h1 className="text-white text-2xl font-bold">My Documents</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Private document vault — {investorProfile?.investorId || ''}
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-card border border-border rounded-xl h-20" />
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <FolderIcon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-white font-semibold mb-1">No Documents Yet</p>
            <p className="text-muted-foreground text-sm">Your documents will appear here when uploaded by Chew Network.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([type, docs]) => (
              <div key={type} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                  <span className={`text-xs font-bold tracking-widest px-2 py-0.5 rounded-full ${docTypeColors[type] || 'text-gray-400 bg-gray-400/10'}`}>
                    {docTypeLabels[type] || type.toUpperCase()}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">{docs.length} file{docs.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="divide-y divide-border/50">
                  {docs.map((doc) => (
                    <div key={doc.id} className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-primary/5 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{doc.documentTitle}</p>
                        <p className="text-muted-foreground text-xs mt-0.5">Uploaded: {doc.uploadDate}</p>
                      </div>
                      {doc.fileUrl ? (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 bg-background border border-border hover:border-primary/50 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                          >
                            <EyeIcon className="w-3.5 h-3.5" />
                            View
                          </a>
                          <a
                            href={doc.fileUrl}
                            download
                            className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                          >
                            <DocumentArrowDownIcon className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Pending</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
