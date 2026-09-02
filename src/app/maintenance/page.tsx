'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { investorService, type PortalSettings } from '@/lib/services/investorService';
import { WrenchScrewdriverIcon, ArrowPathIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

/**
 * Where investors land while maintenance mode is on.
 *
 * Pinned to the portal's own dark palette, like the login page, rather than the
 * public site's theme tokens — this is the back office, and it should not
 * invert to white on the marketing site's light theme.
 *
 * Public by design: someone who never got as far as signing in still needs to
 * be told why they cannot.
 */
export default function MaintenancePage() {
  const [settings, setSettings] = useState<PortalSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    investorService.getPortalSettings()
      .then((data) => {
        setSettings(data);
        // Maintenance has been lifted since they were sent here — don't strand
        // them on a page that no longer applies.
        if (data && !data.maintenanceMode) window.location.href = '/login';
      })
      .catch(() => setSettings(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0D1B] flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 bg-[#F97316]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <WrenchScrewdriverIcon className="w-8 h-8 text-[#F97316]" />
        </div>

        <p className="text-xs font-bold tracking-[0.3em] text-[#F97316] mb-3">SCHEDULED MAINTENANCE</p>
        <h1 className="text-white text-2xl font-bold mb-3">
          {loading ? 'Checking…' : (settings?.portalName || 'The investor portal')} is temporarily offline
        </h1>

        <div className="bg-[#13131F] border border-[#1F1F2E] rounded-2xl p-6 mb-5">
          <p className="text-[#9CA3AF] text-sm leading-relaxed">
            {loading
              ? 'One moment…'
              : (settings?.maintenanceMessage
                || 'The investor portal is temporarily unavailable while we carry out scheduled maintenance. Please check back shortly.')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA6C10] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Check again
          </button>
          {settings?.supportEmail && (
            <a
              href={`mailto:${settings.supportEmail}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent border border-[#1F1F2E] hover:border-[#F97316] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all"
            >
              <EnvelopeIcon className="w-4 h-4" />
              Contact support
            </a>
          )}
        </div>

        <Link href="/" className="inline-block mt-6 text-[#9CA3AF] hover:text-white text-xs transition-colors">
          Back to main website
        </Link>
      </div>
    </div>
  );
}
