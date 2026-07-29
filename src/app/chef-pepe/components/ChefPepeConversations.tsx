import React from 'react';
import Link from 'next/link';

const conversations = [
  {
    id: 1,
    topic: 'Substitutions',
    emoji: '🔄',
    messages: [
      { role: 'user', text: "I don't have heavy cream. What can I use instead?" },
      { role: 'pepe', text: "Great question! For most recipes, you can use whole milk + 1 tbsp melted butter per cup. For soups, Greek yogurt works beautifully. For whipping, coconut cream is your best bet. What are you making?" },
      { role: 'user', text: 'A pasta sauce.' },
      { role: 'pepe', text: "Perfect — whole milk with a tablespoon of butter will give you a rich, creamy sauce. Add it slowly over low heat and it won't break. 👌" },
    ],
  },
  {
    id: 2,
    topic: 'Technique',
    emoji: '🔪',
    messages: [
      { role: 'user', text: 'How do I know when my pan is hot enough to sear?' },
      { role: 'pepe', text: "The water drop test: flick a few drops of water into the pan. If they sizzle and evaporate immediately — you're ready. If they dance around in a ball (Leidenfrost effect) — it's too hot. Aim for that first sizzle." },
      { role: 'user', text: 'What about for steak?' },
      { role: 'pepe', text: "For steak, you want it screaming hot — cast iron or stainless, 2–3 minutes on high heat. A drop of oil should smoke almost immediately. That's your cue. 🥩" },
    ],
  },
  {
    id: 3,
    topic: 'Meal Planning',
    emoji: '📅',
    messages: [
      { role: 'user', text: "I have chicken, broccoli, and rice. What can I make for the week?" },
      { role: 'pepe', text: "You've got a solid base! Here's a 3-day plan: Monday — Teriyaki chicken bowls. Tuesday — Chicken fried rice (use leftover rice). Wednesday — Broccoli cheddar soup with shredded chicken. Want the recipes for any of these?" },
      { role: 'user', text: 'Yes, the fried rice please!' },
      { role: 'pepe', text: "On it! Day-old rice is key — fresh rice gets mushy. You'll need: cold rice, 2 eggs, soy sauce, sesame oil, garlic, and your chicken. Ready to walk through it step by step? 🍳" },
    ],
  },
];

export default function ChefPepeConversations() {
  return (
    <section className="py-20 px-4 bg-muted" aria-labelledby="conversations-heading">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-accent mb-3 block">Example Conversations</span>
          <h2 id="conversations-heading" className="text-3xl font-extrabold text-foreground mb-4">
            See how Chef Pepe helps.
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Real examples of the kind of help Chef Pepe provides — substitutions, technique, and meal planning.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {conversations?.map((conv) => (
            <div key={conv?.id} className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                <span className="text-xl">{conv?.emoji}</span>
                <span className="font-bold text-foreground text-sm">{conv?.topic}</span>
              </div>
              <div className="p-5 space-y-3">
                {conv?.messages?.map((msg, i) => (
                  <div key={i} className={`flex ${msg?.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                        msg?.role === 'user' ?'bg-primary text-white rounded-br-sm' :'bg-muted text-foreground rounded-bl-sm border border-border'
                      }`}
                    >
                      {msg?.role === 'pepe' && (
                        <span className="font-bold text-accent block mb-1 text-[10px] uppercase tracking-wide">Chef Pepe</span>
                      )}
                      {msg?.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/chef-pepe#demo" className="btn-primary">
            Try Chef Pepe Now
          </Link>
        </div>
      </div>
    </section>
  );
}
