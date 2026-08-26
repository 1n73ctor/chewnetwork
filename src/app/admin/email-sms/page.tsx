'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminService, type Investor } from '@/lib/services/investorService';
import { AdminLayout } from '../certificates/page';
import { EnvelopeIcon, DevicePhoneMobileIcon, MagnifyingGlassIcon, CheckIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

export default function AdminEmailSmsPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [messageForm, setMessageForm] = useState({
    subject: '',
    message: '',
    audience: 'all',
    sendEmail: true,
    sendSms: false,
    selectedInvestorId: '',
  });

  useEffect(() => {
    if (!loading && !isAdmin) router.push('/');
  }, [isAdmin, loading]);

  useEffect(() => {
    if (isAdmin) {
      adminService.getAllInvestors().then((data) => { setInvestors(data); setDataLoading(false); });
    }
  }, [isAdmin]);

  const filteredInvestors = investors.filter((inv) => {
    const q = search.toLowerCase();
    return !q || inv.firstName?.toLowerCase().includes(q) || inv.lastName?.toLowerCase().includes(q) || inv.investorId?.toLowerCase().includes(q);
  });

  const getAudienceCount = () => {
    if (messageForm.audience === 'all') return investors.length;
    if (messageForm.audience === 'phase_1') return investors.filter(i => i.round?.toLowerCase().includes('phase 1') || i.round?.toLowerCase().includes('1')).length;
    if (messageForm.audience === 'phase_2') return investors.filter(i => i.round?.toLowerCase().includes('phase 2') || i.round?.toLowerCase().includes('2')).length;
    if (messageForm.audience === 'selected') return messageForm.selectedInvestorId ? 1 : 0;
    return 0;
  };

  const handleSend = async () => {
    if (!messageForm.subject || !messageForm.message) {
      setErrorMsg('Please enter a subject and message.');
      return;
    }
    if (messageForm.audience === 'selected' && !messageForm.selectedInvestorId) {
      setErrorMsg('Please select an investor for targeted messaging.');
      return;
    }
    if (!messageForm.sendEmail && !messageForm.sendSms) {
      setErrorMsg('Pick at least one channel to send through.');
      return;
    }
    setSending(true);
    setErrorMsg('');
    setSuccessMsg('');

    let emailResult: { sent: number; failedCount: number; total: number } | null = null;

    if (messageForm.sendEmail) {
      try {
        const res = await fetch('/api/admin/messages/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: messageForm.subject,
            message: messageForm.message,
            audience: messageForm.audience,
            selectedInvestorId: messageForm.selectedInvestorId || undefined,
          }),
        });
        const body = await res.json();
        if (!res.ok) {
          setErrorMsg(body?.error || 'Could not send the email.');
          setSending(false);
          return;
        }
        emailResult = body;
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Network error while sending.');
        setSending(false);
        return;
      }
    }

    // Audit only what actually happened, once it has happened.
    await adminService.createAuditLog('MESSAGE_SENT', messageForm.selectedInvestorId || undefined, null, {
      subject: messageForm.subject,
      audience: messageForm.audience,
      sendEmail: messageForm.sendEmail,
      sendSms: messageForm.sendSms,
      emailsSent: emailResult?.sent ?? 0,
      emailsFailed: emailResult?.failedCount ?? 0,
    });

    const parts: string[] = [];
    if (emailResult) {
      parts.push(`Emailed ${emailResult.sent} of ${emailResult.total} investor(s)`);
      if (emailResult.failedCount > 0) parts.push(`${emailResult.failedCount} failed`);
    }
    if (messageForm.sendSms) parts.push('SMS is not wired up yet, so no texts were sent');

    setSuccessMsg(`${parts.join(' — ')}. Logged in the audit trail.`);
    setMessageForm({ ...messageForm, subject: '', message: '' });
    setTimeout(() => setSuccessMsg(''), 8000);
    setSending(false);
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!isAdmin) return null;

  return (
    <AdminLayout activeId="email-sms">
      <div className="p-4 lg:p-6 space-y-5">
        <div>
          <h1 className="text-white text-2xl font-bold">Email / SMS</h1>
          <p className="text-muted-foreground text-sm mt-1">Send communications to investors</p>
        </div>

        {successMsg && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 flex items-center gap-2">
            <CheckIcon className="w-4 h-4 text-green-400" />
            <p className="text-green-400 text-sm">{successMsg}</p>
          </div>
        )}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
            <p className="text-red-400 text-sm">{errorMsg}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Compose */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 space-y-4">
            <h2 className="text-white font-bold text-sm">Compose Message</h2>

            {/* Audience */}
            <div>
              <label className="text-xs text-muted-foreground font-medium mb-2 block">Audience</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: 'all', label: 'All Investors' },
                  { value: 'phase_1', label: 'Phase 1' },
                  { value: 'phase_2', label: 'Phase 2' },
                  { value: 'selected', label: 'Selected' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setMessageForm({ ...messageForm, audience: opt.value })}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${messageForm.audience === opt.value ? 'bg-primary border-primary text-white' : 'bg-background border-border text-muted-foreground hover:border-primary/50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected investor */}
            {messageForm.audience === 'selected' && (
              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Select Investor</label>
                <div className="relative mb-2">
                  <MagnifyingGlassIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search investors..."
                    className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="bg-background border border-border rounded-xl max-h-40 overflow-y-auto">
                  {filteredInvestors.map((inv) => (
                    <button
                      key={inv.id}
                      onClick={() => setMessageForm({ ...messageForm, selectedInvestorId: inv.id })}
                      className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-primary/5 transition-colors text-left ${messageForm.selectedInvestorId === inv.id ? 'bg-primary/10' : ''}`}
                    >
                      <span className="text-white text-sm">{inv.firstName} {inv.lastName}</span>
                      <span className="text-muted-foreground text-xs">{inv.investorId}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Subject */}
            <div>
              <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Subject</label>
              <input
                type="text"
                value={messageForm.subject}
                onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                placeholder="e.g. Chew Network Investor Update"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
              />
            </div>

            {/* Message */}
            <div>
              <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Message</label>
              <textarea
                value={messageForm.message}
                onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                placeholder="Enter your message to investors..."
                rows={5}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">Note: Sensitive financial details should remain inside the secure dashboard. Do not include private investor data in SMS messages.</p>
            </div>

            {/* Channels */}
            <div>
              <label className="text-xs text-muted-foreground font-medium mb-2 block">Send Via</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setMessageForm({ ...messageForm, sendEmail: !messageForm.sendEmail })}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${messageForm.sendEmail ? 'bg-primary/10 border-primary text-primary' : 'bg-background border-border text-muted-foreground'}`}
                >
                  <EnvelopeIcon className="w-4 h-4" />
                  Email Notification
                  {messageForm.sendEmail && <CheckIcon className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setMessageForm({ ...messageForm, sendSms: !messageForm.sendSms })}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${messageForm.sendSms ? 'bg-primary/10 border-primary text-primary' : 'bg-background border-border text-muted-foreground'}`}
                >
                  <DevicePhoneMobileIcon className="w-4 h-4" />
                  SMS Notification
                  {messageForm.sendSms && <CheckIcon className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={sending || !messageForm.subject || !messageForm.message}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
              {sending ? 'Sending...' : `Send to ${getAudienceCount()} Investor${getAudienceCount() !== 1 ? 's' : ''}`}
            </button>
          </div>

          {/* Info panel */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-white font-bold text-sm mb-3">SMS Template</h3>
              <div className="bg-background rounded-xl p-3 border border-border/50">
                <p className="text-muted-foreground text-xs leading-relaxed italic">
                  &quot;Chew Network Investor Update: A new company milestone has been posted to your Investor Portal. Log in to view the update.&quot;
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Sensitive details remain inside the secure dashboard.</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-white font-bold text-sm mb-3">Investor Summary</h3>
              <div className="space-y-2">
                {[
                  { label: 'Total Investors', value: investors.length },
                  { label: 'Active', value: investors.filter(i => i.accountStatus === 'active').length },
                  { label: 'Phase 1', value: investors.filter(i => i.round?.toLowerCase().includes('1')).length },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="text-white font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
              <p className="text-amber-300/80 text-xs leading-relaxed">
                <strong className="text-amber-300">SMS Setup:</strong> Twilio integration requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER as Supabase Edge Function secrets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
