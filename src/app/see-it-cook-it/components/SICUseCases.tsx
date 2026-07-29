import React from 'react';

const useCases = [
  { icon: '🍽️', label: 'Restaurant recreations', description: 'Snap a dish you loved and recreate it at home.' },
  { icon: '🌙', label: 'Weeknight meals', description: 'Turn random fridge items into a real dinner.' },
  { icon: '👨‍👩‍👧', label: 'Family recipes', description: 'Identify and preserve dishes passed down through generations.' },
  { icon: '🥦', label: 'Leftover ingredients', description: 'Use what you have before it goes to waste.' },
  { icon: '🎓', label: 'Cooking lessons', description: 'Learn techniques by showing Chef Pepe what you\'re working with.' },
  { icon: '📅', label: 'Meal planning', description: 'Build a week of meals from a single photo of your pantry.' },
];

export default function SICUseCases() {
  return (
    <section className="py-20 px-4 bg-background" aria-labelledby="use-cases-heading">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 id="use-cases-heading" className="text-3xl font-extrabold text-foreground mb-4">
            Useful every day — and for the meals you never forgot.
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From quick weeknight dinners to recreating that dish you had on vacation, See It. Cook It. works for every kind of food moment.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {useCases?.map((uc) => (
            <div
              key={uc?.label}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300"
            >
              <span className="text-3xl block mb-3">{uc?.icon}</span>
              <h3 className="font-bold text-foreground mb-1">{uc?.label}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{uc?.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
