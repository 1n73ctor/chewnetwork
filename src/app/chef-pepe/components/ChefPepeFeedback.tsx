'use client';

import React, { useState } from 'react';

export default function ChefPepeFeedback() {
  const [feedbackGiven, setFeedbackGiven] = useState<'helpful' | 'not-helpful' | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const handleReport = () => {
    setReportSubmitted(true);
    setTimeout(() => {
      setShowReport(false);
      setReportSubmitted(false);
      setReportReason('');
    }, 2000);
  };

  return (
    <section className="py-16 px-4 bg-background" aria-labelledby="feedback-heading">
      <div className="max-w-2xl mx-auto text-center">
        <h2 id="feedback-heading" className="text-2xl font-extrabold text-foreground mb-3">
          How is Chef Pepe doing?
        </h2>
        <p className="text-muted-foreground mb-8">
          Your feedback helps us improve Chef Pepe&apos;s responses and keep the experience safe and accurate.
        </p>

        {feedbackGiven ? (
          <div className="bg-muted rounded-2xl p-6 inline-block">
            <span className="text-2xl block mb-2">{feedbackGiven === 'helpful' ? '🙏' : '📝'}</span>
            <p className="font-semibold text-foreground">
              {feedbackGiven === 'helpful' ? 'Thanks! Glad Chef Pepe helped.' : 'Thanks for the feedback. We\'ll use it to improve.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setFeedbackGiven('helpful')}
              className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200"
            >
              👍 Helpful
            </button>
            <button
              onClick={() => setFeedbackGiven('not-helpful')}
              className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border-2 border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-all duration-200"
            >
              👎 Not Helpful
            </button>
            <button
              onClick={() => setShowReport(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border-2 border-border text-muted-foreground hover:border-red-400 hover:text-red-500 transition-all duration-200"
            >
              ⚑ Report an Issue
            </button>
          </div>
        )}

        {/* Report modal */}
        {showReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" role="dialog" aria-modal="true" aria-label="Report an issue">
            <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
              {reportSubmitted ? (
                <div className="text-center py-4">
                  <span className="text-3xl block mb-3">✅</span>
                  <p className="font-bold text-foreground">Report submitted. Thank you.</p>
                </div>
              ) : (
                <>
                  <h3 className="font-extrabold text-foreground text-lg mb-4">Report an Issue</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Help us keep Chef Pepe safe and accurate. What&apos;s the issue?
                  </p>
                  <div className="space-y-2 mb-4">
                    {['Unsafe or harmful content', 'Incorrect information', 'Inappropriate response', 'Other']?.map((reason) => (
                      <label key={reason} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-muted transition-colors">
                        <input
                          type="radio"
                          name="report-reason"
                          value={reason}
                          checked={reportReason === reason}
                          onChange={() => setReportReason(reason)}
                          className="accent-primary"
                        />
                        <span className="text-sm text-foreground">{reason}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowReport(false)}
                      className="flex-1 btn-secondary text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReport}
                      disabled={!reportReason}
                      className="flex-1 btn-primary text-sm disabled:opacity-50"
                    >
                      Submit Report
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
