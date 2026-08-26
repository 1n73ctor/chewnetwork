'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/portal/AppLayout';
import { ChevronDownIcon, ChevronUpIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    category: 'Ecosystem Stakes',
    question: 'What are Ecosystem Stakes?',
    answer: 'Ecosystem Stakes represent your ownership interest in Chew Network. Each stake corresponds to a fractional share of 5% of the total Chew Network ecosystem, which is divided into 800,000,000 total Ecosystem Stakes.',
  },
  {
    category: 'Ecosystem Stakes',
    question: 'How is my ownership percentage calculated?',
    answer: 'Your ownership percentage is calculated as: (Your Current Stakes Owned ÷ 800,000,000) × 5. For example, if you own 50,000 stakes, your ownership is (50,000 ÷ 800,000,000) × 5 = 0.0003125% of Chew Network.',
  },
  {
    category: 'Ecosystem Stakes',
    question: 'Can I purchase additional Ecosystem Stakes?',
    answer: 'Additional stake purchases are subject to availability and the terms of the current offering round. Please contact the Investor Hotline or your Chew Network representative for information about additional purchase opportunities.',
  },
  {
    category: 'Ecosystem Stakes',
    question: 'What is the original stake price?',
    answer: 'Phase 1 Ecosystem Stakes were offered at $0.01 per stake. Pricing for future rounds will be determined under separate offering documents.',
  },
  {
    category: 'Ownership & Certificates',
    question: 'What is my Ownership Certificate?',
    answer: 'Your Official Ecosystem Stake Ownership Certificate is a formal document that records your investor ID, certificate number, number of stakes owned, ownership percentage, and the round in which you invested. It serves as your official record of ownership.',
  },
  {
    category: 'Ownership & Certificates',
    question: 'How do I download my certificate?',
    answer: 'Navigate to "My Certificate" in the left sidebar. From there you can view, download as PDF, or print your official ownership certificate.',
  },
  {
    category: 'Ownership & Certificates',
    question: 'Can my certificate be reissued?',
    answer: 'Yes. If you need a reissued certificate (e.g., after a name correction or additional purchase), contact Chew Network administration. Certificates can be regenerated without affecting your transaction history.',
  },
  {
    category: 'Transactions & History',
    question: 'How do I view my full ownership history?',
    answer: 'Go to "My Ecosystem Stakes" in the left sidebar and click "View Full Ownership History." This shows every transaction including purchases, additional purchases, transfers, and company repurchases.',
  },
  {
    category: 'Transactions & History',
    question: 'Can transactions be deleted or modified?',
    answer: 'No. All ownership transactions are permanent and immutable records. Historical transactions are never deleted or overwritten. Any corrections are recorded as new adjustment transactions with notes.',
  },
  {
    category: 'Transactions & History',
    question: 'What transaction types exist?',
    answer: 'Transaction types include: PURCHASE (initial investment), ADDITIONAL PURCHASE (buying more stakes), TRANSFER IN (receiving stakes), TRANSFER OUT (sending stakes), COMPANY REPURCHASE (Chew Network buying back stakes), REDEMPTION, and ADJUSTMENT.',
  },
  {
    category: 'Documents & Records',
    question: 'Where can I find my investment documents?',
    answer: 'All your documents are stored in "My Documents" in the left sidebar. This includes your signed agreement, investment certificate, payment receipts, and any other documents uploaded by Chew Network administration.',
  },
  {
    category: 'Documents & Records',
    question: 'Can other investors see my documents?',
    answer: 'No. Your documents are strictly private. Chew Network uses row-level security to ensure each investor can only access their own documents, certificates, and investment information.',
  },
  {
    category: 'Beneficiary',
    question: 'What is beneficiary information?',
    answer: 'Beneficiary information designates who should be considered in the event of your passing. This is recorded for reference purposes only. Actual legal ownership transfers are controlled by Chew Network\'s official documents and legal processes.',
  },
  {
    category: 'Beneficiary',
    question: 'Does recording a beneficiary automatically transfer my stakes?',
    answer: 'No. Recording beneficiary information on this portal does not automatically transfer ownership. Legal ownership transfers remain controlled by Chew Network\'s official documents and records.',
  },
  {
    category: 'Phase 2',
    question: 'What is Phase 2?',
    answer: 'Phase 2 is a future offering round planned for 2027. Details, pricing, and eligibility will be determined under separate offering documents. Phase 2 is not yet open. No projected prices or returns should be assumed from current Phase 1 information.',
  },
  {
    category: 'Phase 2',
    question: 'Will my Phase 1 stakes be affected by Phase 2?',
    answer: 'Your Phase 1 Ecosystem Stakes remain unchanged regardless of future phases. Phase 2 will be a separate offering. Your current ownership records will never be altered by future phase activity.',
  },
  {
    category: 'Account & Security',
    question: 'How do I reset my password?',
    answer: 'On the login page, click "Forgot Password" and enter your email address. You will receive a secure password reset link. If you have trouble, contact the Investor Hotline.',
  },
  {
    category: 'Account & Security',
    question: 'Is my account information secure?',
    answer: 'Yes. Chew Network uses industry-standard security including encrypted connections (HTTPS/SSL), secure password hashing, role-based permissions, session expiration, and audit logging. Your sensitive information is never accessible to other investors.',
  },
  {
    category: 'Contact & Support',
    question: 'How do I contact Chew Network investor support?',
    answer: 'You can reach the private Investor Hotline by navigating to "Investor Hotline" in the left sidebar. The private number and hours are displayed there exclusively for authorized investors.',
  },
  {
    category: 'Contact & Support',
    question: 'How do I receive investor updates?',
    answer: 'Investor updates are posted to your dashboard under "Messages & Updates." You may also receive email or SMS notifications when new updates are published, depending on your notification settings.',
  },
];

const categories = Array.from(new Set(faqs.map((f) => f.category)));

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filtered = activeCategory === 'All' ? faqs : faqs.filter((f) => f.category === activeCategory);

  return (
    <AppLayout>
      <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <QuestionMarkCircleIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold">Investor FAQs</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Frequently asked questions about your Ecosystem Stakes</p>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-white' :'bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ list */}
        <div className="space-y-2">
          {filtered.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="bg-card border border-border rounded-xl overflow-hidden transition-all">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-primary/5 transition-colors"
                >
                  <div className="flex-1">
                    <span className="text-xs text-primary font-semibold tracking-widest block mb-0.5">{faq.category.toUpperCase()}</span>
                    <span className="text-white text-sm font-medium">{faq.question}</span>
                  </div>
                  {isOpen
                    ? <ChevronUpIcon className="w-4 h-4 text-primary flex-shrink-0" />
                    : <ChevronDownIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  }
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 border-t border-border/50">
                    <p className="text-muted-foreground text-sm leading-relaxed pt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 text-center">
          <p className="text-white font-semibold mb-1">Still have questions?</p>
          <p className="text-muted-foreground text-sm mb-3">Contact the private Investor Hotline for personalized support.</p>
          <a href="/investor/hotline" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all">
            Contact Investor Hotline
          </a>
        </div>
      </div>
    </AppLayout>
  );
}
