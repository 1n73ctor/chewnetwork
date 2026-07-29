import React from 'react';

export default function SICSafetyNote() {
  return (
    <section className="py-12 px-4" aria-label="Safety and accuracy note">
      <div className="max-w-3xl mx-auto">
        <div
          className="rounded-2xl border p-6 flex gap-4"
          style={{ backgroundColor: '#FFF8EF', borderColor: '#E8C9A0' }}
        >
          <span className="text-2xl shrink-0 mt-0.5">⚠️</span>
          <div>
            <h3 className="font-bold text-foreground mb-2">Safety & Accuracy Note</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#4A6B5A' }}>
              Chef Pepe provides helpful cooking guidance, but image recognition and recipe estimates may not be exact. Always verify cooking temperatures, allergen information, and ingredient quantities before preparing food. Do not rely on AI-generated nutritional data as medical advice. When in doubt, consult a professional.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
