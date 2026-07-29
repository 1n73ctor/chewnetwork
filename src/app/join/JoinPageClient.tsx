'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Analytics } from '@/lib/analytics';

type AccountType = 'food-lover' | 'creator' | 'restaurant' | 'teacher' | 'partner' | '';
type Step = 'account-type' | 'details' | 'onboarding' | 'welcome';

const accountTypes = [
  { id: 'food-lover' as AccountType, emoji: '🍽️', label: 'I love food', description: 'Save recipes, cook with Chef Pepe, join challenges' },
  { id: 'creator' as AccountType, emoji: '📸', label: 'I create food content', description: 'Publish recipes, grow followers, build your brand' },
  { id: 'restaurant' as AccountType, emoji: '🏪', label: 'I represent a restaurant', description: 'Claim your profile, showcase dishes, connect with creators' },
  { id: 'teacher' as AccountType, emoji: '🎓', label: 'I want to teach', description: 'Share expertise through Creator Academy' },
  { id: 'partner' as AccountType, emoji: '🤝', label: 'I want to partner with Chew', description: 'Business partnerships and brand opportunities' },
];

const cookingGoals = ['Get better at cooking', 'Discover new recipes', 'Follow food creators', 'Find great restaurants', 'Build a food brand'];
const skillLevels = [
  { id: 'beginner', label: 'Beginner', description: 'Still learning the basics' },
  { id: 'comfortable', label: 'Comfortable', description: 'Confident with most recipes' },
  { id: 'advanced', label: 'Advanced', description: 'Experienced home cook or professional' },
];
const cuisineOptions = ['Italian', 'Mexican', 'Japanese', 'Indian', 'Chinese', 'Mediterranean', 'American', 'Thai', 'French', 'Korean', 'Middle Eastern', 'African'];
const chefPepeModes = [
  { id: 'beginner', label: 'Beginner Mode', description: 'Extra guidance and explanations' },
  { id: 'quick', label: 'Quick Mode', description: 'Fast, efficient instructions' },
  { id: 'pro', label: 'Pro Mode', description: 'Minimal hand-holding, maximum detail' },
  { id: 'family', label: 'Family Mode', description: 'Kid-friendly language and tips' },
];

export default function JoinPageClient() {
  const [step, setStep] = useState<Step>('account-type');
  const [accountType, setAccountType] = useState<AccountType>('');
  const [formData, setFormData] = useState({ firstName: '', email: '', password: '', country: '', termsAccepted: false, marketingConsent: false });
  const [onboarding, setOnboarding] = useState({ goals: [] as string[], skillLevel: '', cuisines: [] as string[], dietaryPreferences: '', chefPepeMode: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuth();
  const router = useRouter();

  const toggleGoal = (goal: string) => setOnboarding(prev => ({ ...prev, goals: prev.goals.includes(goal) ? prev.goals.filter(g => g !== goal) : [...prev.goals, goal] }));
  const toggleCuisine = (cuisine: string) => setOnboarding(prev => ({ ...prev, cuisines: prev.cuisines.includes(cuisine) ? prev.cuisines.filter(c => c !== cuisine) : [...prev.cuisines, cuisine] }));

  const handleDetailsSubmit = (e: React.FormEvent) => { e.preventDefault(); setStep('onboarding'); };

  const handleFinishSetup = async () => {
    setError('');
    setLoading(true);
    Analytics.joinFormComplete(accountType || 'food-lover');
    try {
      await signUp(formData.email, formData.password, {
        fullName: formData.firstName, first_name: formData.firstName, account_type: accountType || 'food-lover',
        country: formData.country, skill_level: onboarding.skillLevel, chef_pepe_mode: onboarding.chefPepeMode || 'beginner',
        dietary_preferences: onboarding.dietaryPreferences, goals: onboarding.goals, favourite_cuisines: onboarding.cuisines, marketing_consent: formData.marketingConsent,
      });
      setStep('welcome');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-background min-h-screen">
      <Header />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-lg mx-auto">

          {/* Step: Account Type */}
          {step === 'account-type' && (
            <div>
              <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-foreground mb-3">Join the future home of food.</h1>
                <p className="text-muted-foreground leading-relaxed">Create one account to save recipes, talk with Chef Pepe, join challenges, follow creators, build collections, and receive updates as new Chew products launch.</p>
              </div>
              <div className="space-y-3">
                {accountTypes.map((type) => (
                  <button key={type.id} onClick={() => { setAccountType(type.id); setStep('details'); Analytics.joinFormStart(type.id); }}
                    className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:border-primary hover:bg-muted ${accountType === type.id ? 'border-primary bg-muted' : 'border-border bg-card'}`}>
                    <span className="text-3xl shrink-0">{type.emoji}</span>
                    <div><p className="font-bold text-foreground">{type.label}</p><p className="text-muted-foreground text-sm">{type.description}</p></div>
                    <svg className="w-5 h-5 text-muted-foreground ml-auto shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-6">Already have an account?{' '}<Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link></p>
            </div>
          )}

          {/* Step: Account Details */}
          {step === 'details' && (
            <div>
              <button onClick={() => setStep('account-type')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Back
              </button>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-extrabold text-foreground mb-2">Create your account</h2>
                <p className="text-muted-foreground text-sm">Joining as: <span className="font-semibold text-foreground">{accountTypes.find(t => t.id === accountType)?.label}</span></p>
              </div>

              {/* Social login */}
              <div className="space-y-3 mb-6">
                <button type="button" className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-border bg-card text-foreground font-semibold text-sm hover:border-primary transition-all">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                  <span className="ml-auto text-xs text-muted-foreground font-normal">Coming Soon</span>
                </button>
                <button type="button" className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-border bg-card text-foreground font-semibold text-sm hover:border-primary transition-all">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  Continue with Apple
                  <span className="ml-auto text-xs text-muted-foreground font-normal">Coming Soon</span>
                </button>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground font-medium">or sign up with email</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 text-sm">{error}</div>}

              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-semibold text-foreground mb-1.5">First Name *</label>
                  <input id="first-name" type="text" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground focus:outline-none focus:border-primary text-sm" placeholder="Your first name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-1.5">Email Address *</label>
                  <input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground focus:outline-none focus:border-primary text-sm" placeholder="you@example.com" />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-1.5">Password *</label>
                  <input id="password" type="password" required minLength={8} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground focus:outline-none focus:border-primary text-sm" placeholder="At least 8 characters" />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-semibold text-foreground mb-1.5">Country / Region *</label>
                  <select id="country" required value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground focus:outline-none focus:border-primary text-sm">
                    <option value="">Select your country</option>
                    <option value="US">United States</option><option value="GB">United Kingdom</option><option value="CA">Canada</option><option value="AU">Australia</option><option value="IN">India</option><option value="NG">Nigeria</option><option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" required checked={formData.termsAccepted} onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })} className="mt-0.5 w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                    <span className="text-sm text-muted-foreground">I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Use</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> *</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={formData.marketingConsent} onChange={(e) => setFormData({ ...formData, marketingConsent: e.target.checked })} className="mt-0.5 w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                    <span className="text-sm text-muted-foreground">Send me updates about new recipes, features, and Chew products (optional)</span>
                  </label>
                </div>
                <button type="submit" className="btn-primary w-full justify-center text-base py-4 mt-2">Continue</button>
              </form>
            </div>
          )}

          {/* Step: Onboarding */}
          {step === 'onboarding' && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-extrabold text-foreground mb-2">Welcome, {formData.firstName || 'food lover'}!</h2>
                <p className="text-muted-foreground text-sm">Help us personalise your experience.</p>
              </div>
              {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 text-sm">{error}</div>}
              <div className="space-y-8">
                <div>
                  <p className="font-bold text-foreground mb-3">What do you want help with?</p>
                  <div className="flex flex-wrap gap-2">
                    {cookingGoals.map((goal) => (
                      <button key={goal} onClick={() => toggleGoal(goal)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${onboarding.goals.includes(goal) ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}>{goal}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-bold text-foreground mb-3">Your cooking skill level</p>
                  <div className="space-y-2">
                    {skillLevels.map((level) => (
                      <button key={level.id} onClick={() => setOnboarding({ ...onboarding, skillLevel: level.id })} className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${onboarding.skillLevel === level.id ? 'border-primary bg-muted' : 'border-border hover:border-primary/50'}`}>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${onboarding.skillLevel === level.id ? 'border-primary' : 'border-border'}`}>
                          {onboarding.skillLevel === level.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <div><p className="font-semibold text-foreground text-sm">{level.label}</p><p className="text-muted-foreground text-xs">{level.description}</p></div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-bold text-foreground mb-3">Favourite cuisines or food interests</p>
                  <div className="flex flex-wrap gap-2">
                    {cuisineOptions.map((cuisine) => (
                      <button key={cuisine} onClick={() => toggleCuisine(cuisine)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${onboarding.cuisines.includes(cuisine) ? 'bg-accent text-white' : 'bg-muted text-muted-foreground hover:bg-accent/10 hover:text-accent'}`}>{cuisine}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-bold text-foreground mb-1">Dietary preferences or allergies</p>
                  <p className="text-muted-foreground text-xs mb-3">Optional. This helps personalise recipe suggestions. You can update this anytime.</p>
                  <input type="text" value={onboarding.dietaryPreferences} onChange={(e) => setOnboarding({ ...onboarding, dietaryPreferences: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground focus:outline-none focus:border-primary text-sm" placeholder="e.g. vegetarian, nut allergy, gluten-free..." />
                </div>
                <div>
                  <p className="font-bold text-foreground mb-3">Preferred Chef Pepe mode</p>
                  <div className="grid grid-cols-2 gap-3">
                    {chefPepeModes.map((mode) => (
                      <button key={mode.id} onClick={() => setOnboarding({ ...onboarding, chefPepeMode: mode.id })} className={`p-4 rounded-xl border-2 text-left transition-all ${onboarding.chefPepeMode === mode.id ? 'border-primary bg-muted' : 'border-border hover:border-primary/50'}`}>
                        <p className="font-semibold text-foreground text-sm">{mode.label}</p>
                        <p className="text-muted-foreground text-xs mt-0.5">{mode.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={handleFinishSetup} disabled={loading} className="btn-primary w-full justify-center text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed">{loading ? 'Creating your account…' : 'Finish Setup'}</button>
                <button onClick={handleFinishSetup} disabled={loading} className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-60">Skip for now</button>
              </div>
            </div>
          )}

          {/* Welcome Screen */}
          {step === 'welcome' && (
            <div className="text-center py-8">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-5xl mx-auto mb-6">🍳</div>
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-3">WELCOME</p>
              <h2 className="text-3xl font-extrabold text-foreground mb-4">Welcome to Chew, {formData.firstName || 'friend'}!</h2>
              <p className="text-muted-foreground leading-relaxed mb-10 max-w-sm mx-auto">Chef Pepe is ready when you are. Start by finding a recipe, showing us a meal, or telling Chef Pepe what ingredients you have.</p>
              <div className="space-y-3">
                <Link href="/recipes" className="btn-primary w-full justify-center text-base py-4">Explore Recipes</Link>
                <Link href="/chef-pepe" className="btn-secondary w-full justify-center text-base py-4">Talk to Chef Pepe</Link>
                <Link href="/community" className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors block py-2">Browse the Community</Link>
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </main>
  );
}
