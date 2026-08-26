'use client';

import React from 'react';
import Link from 'next/link';
import {
  DocumentTextIcon,
  GiftIcon,
  DocumentChartBarIcon,
  EnvelopeIcon,
  FolderIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

const quickItems = [
  { id: 'qa-certificate', label: 'My Certificate', href: '/investor/certificate', icon: <DocumentTextIcon className="w-6 h-6" />, color: 'text-primary' },
  { id: 'qa-welcome', label: 'Welcome Kit', href: '/investor/welcome-kit', icon: <GiftIcon className="w-6 h-6" />, color: 'text-amber-400' },
  { id: 'qa-reports', label: 'Investor Reports', href: '/investor/reports', icon: <DocumentChartBarIcon className="w-6 h-6" />, color: 'text-blue-400' },
  { id: 'qa-messages', label: 'Messages', href: '/investor/updates', icon: <EnvelopeIcon className="w-6 h-6" />, color: 'text-green-400' },
  { id: 'qa-documents', label: 'My Documents', href: '/investor/documents', icon: <FolderIcon className="w-6 h-6" />, color: 'text-purple-400' },
  { id: 'qa-beneficiary', label: 'Beneficiary Info', href: '/investor/beneficiary-info', icon: <UserGroupIcon className="w-6 h-6" />, color: 'text-pink-400' },
  { id: 'qa-build', label: 'Build With Chew', href: '/investor/build-with-chew', icon: <BuildingStorefrontIcon className="w-6 h-6" />, color: 'text-cyan-400' },
  { id: 'qa-faqs', label: 'FAQs', href: '/investor/faqs', icon: <QuestionMarkCircleIcon className="w-6 h-6" />, color: 'text-yellow-400' },
];

export default function QuickAccessGrid() {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h3 className="text-white font-bold text-sm mb-3">Quick Access</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {quickItems?.map((item) => (
          <Link
            key={item?.id}
            href={item?.href}
            className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all group"
          >
            <div className={`${item?.color} group-hover:scale-110 transition-transform`}>{item?.icon}</div>
            <span className="text-white text-xs font-medium text-center leading-tight">{item?.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}