'use client';

import React, { useState, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';
import { Analytics } from '@/lib/analytics';

const examplePrompts = [
  'Give me three dinners using chicken, rice, and broccoli.',
  'How do I know when my steak is medium-rare?',
  'My sauce is too salty. What can I do?',
  'Make this recipe serve eight people.',
  'What can I make with eggs, spinach, and feta?',
  'How do I julienne a carrot?',
];

const mockResponses: Record<string, string> = {
  'Give me three dinners using chicken, rice, and broccoli.': 'Great ingredients! Here are three dinner ideas: 1) Chicken Fried Rice — stir-fry day-old rice with diced chicken, broccoli florets, soy sauce, and a fried egg on top. 2) Chicken and Broccoli Casserole — layer rice in a baking dish, top with chicken and broccoli, cover with a creamy sauce, and bake at 375°F for 25 minutes. 3) Asian Chicken Bowl — poach the chicken, steam the broccoli, and serve over rice with a ginger-sesame dressing. Which one sounds good tonight?',
  'How do I know when my steak is medium-rare?': 'The most reliable way is a meat thermometer: pull the steak at 130–135°F (54–57°C). Without a thermometer, use the touch test — press the center of the steak; medium-rare feels like pressing the base of your thumb when your hand is relaxed. Let it rest for 5 minutes before cutting; the temperature will rise another 5°F as it rests.',
  'My sauce is too salty. What can I do?': 'A few things can help: Add a starch like a peeled potato — simmer it in the sauce for 15 minutes and remove it; it absorbs salt. Add acidity: a squeeze of lemon or a splash of vinegar can balance saltiness. Add sweetness: a small pinch of sugar or honey. Or simply increase the volume — add more unsalted liquid, cream, or tomato to dilute it. What kind of sauce is it?',
};

const defaultResponse = "That's a great question! I'm here to help with recipes, techniques, substitutions, meal planning, and hands-free cooking guidance. Ask me anything about food and I'll do my best to help. What are we working on today?";

export default function ChefPepeDemo() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'pepe'; text: string }[]>([
    { role: 'pepe', text: "Hey! I'm Chef Pepe. What are we cooking today? Ask me about a dish, ingredient, technique, substitution, or meal plan — I'm here to help!" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMessage = text.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setInputValue('');
    setIsTyping(true);
    Analytics.chefPepeDemoMessage();

    setTimeout(() => {
      const response = mockResponses[userMessage] || defaultResponse;
      setMessages((prev) => [...prev, { role: 'pepe', text: response }]);
      setIsTyping(false);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <section id="demo" className="bg-secondary py-16 lg:py-24" aria-labelledby="demo-heading">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-3 px-3 py-1 bg-muted rounded-full">Try It Now</span>
          <h2 id="demo-heading" className="text-hero-md font-extrabold text-foreground mb-3">
            Say hello. Ask anything.
          </h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto">
            Type a question or tap one of the examples below. Chef Pepe is ready.
          </p>
        </div>

        {/* Chat window */}
        <div className="bg-white border border-border rounded-3xl overflow-hidden shadow-xl">
          {/* Chat header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/50">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-xl">🍳</div>
            <div>
              <p className="font-bold text-foreground text-sm">Chef Pepe</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-muted-foreground text-xs">Online · AI cooking companion</span>
              </div>
            </div>
            <div className="ml-auto text-xs text-muted-foreground font-medium bg-accent/10 text-accent px-3 py-1 rounded-full">
              Demo mode
            </div>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-6 space-y-4" role="log" aria-label="Chef Pepe conversation" aria-live="polite">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.role === 'pepe' && (
                  <div className="w-8 h-8 bg-accent rounded-xl flex items-center justify-center text-base shrink-0">🍳</div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user' ?'bg-primary text-white rounded-tr-sm' :'bg-muted text-foreground rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-accent rounded-xl flex items-center justify-center text-base shrink-0">🍳</div>
                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce delay-200" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-4">
            <form onSubmit={handleSubmit} className="flex gap-3" role="form" aria-label="Send message to Chef Pepe">
              <label htmlFor="pepe-input" className="sr-only">Ask Chef Pepe a question</label>
              <input
                id="pepe-input"
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about a dish, ingredient, technique, substitution, or meal plan..."
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm transition-all"
                aria-label="Ask Chef Pepe a question"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="btn-primary px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Icon name="PaperAirplaneIcon" size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Example prompts */}
        <div className="mt-6">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest mb-3 text-center">Try asking:</p>
          <div className="flex flex-wrap gap-2 justify-center" role="list" aria-label="Example questions for Chef Pepe">
            {examplePrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="px-4 py-2 bg-white border border-border rounded-full text-foreground text-xs font-medium hover:border-primary hover:text-primary transition-all duration-200"
                role="listitem"
                aria-label={`Ask Chef Pepe: ${prompt}`}
              >
                {prompt.length > 40 ? prompt.slice(0, 40) + '...' : prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}