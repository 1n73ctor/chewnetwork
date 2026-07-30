import React from 'react';

export default function SICSafetyNote() {
  return (
    <section className="py-12 px-4" aria-label="Safety and accuracy note">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 flex gap-4">
          <span className="text-2xl shrink-0 mt-0.5">⚠️</span>
          <div>
            <h3 className="font-bold text-foreground mb-2">Safety & Accuracy Note</h3>
            <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-300">
              Chef Pepe provides helpful cooking guidance, but image recognition and recipe estimates may not be exact. Always verify cooking temperatures, allergen information, and ingredient quantities before preparing food. Do not rely on AI-generated nutritional data as medical advice. When in doubt, consult a professional.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
