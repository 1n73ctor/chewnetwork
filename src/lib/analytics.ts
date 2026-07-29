/**
 * Analytics utility — Item 99: Analytics events for every important CTA and form
 * Uses GA4 via NEXT_PUBLIC_GA_MEASUREMENT_ID
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type EventParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(eventName: string, params?: EventParams) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

// ─── CTA Events ───────────────────────────────────────────────────────────────

export const Analytics = {
  // Hero CTAs
  heroTrySeeItCookIt: () => trackEvent('cta_click', { cta_name: 'Try See It. Cook It.', location: 'hero' }),
  heroMeetChefPepe: () => trackEvent('cta_click', { cta_name: 'Meet Chef Pepe', location: 'hero' }),

  // Join / Auth
  joinChewClick: (location: string) => trackEvent('cta_click', { cta_name: 'Join Chew', location }),
  signInClick: (location: string) => trackEvent('cta_click', { cta_name: 'Sign In', location }),
  joinFormStart: (accountType: string) => trackEvent('form_start', { form_name: 'join_chew', account_type: accountType }),
  joinFormComplete: (accountType: string) => trackEvent('form_complete', { form_name: 'join_chew', account_type: accountType }),
  loginFormSubmit: () => trackEvent('form_submit', { form_name: 'login' }),
  loginSuccess: () => trackEvent('login', { method: 'email' }),
  loginGoogleClick: () => trackEvent('cta_click', { cta_name: 'Continue with Google', location: 'login' }),
  passwordResetRequest: () => trackEvent('form_submit', { form_name: 'password_reset' }),

  // See It. Cook It.
  trySeeItCookIt: (mode: string) => trackEvent('cta_click', { cta_name: 'Try See It. Cook It.', mode }),
  uploadMealClick: () => trackEvent('cta_click', { cta_name: 'Upload a Meal', location: 'see_it_cook_it' }),
  scanRecipeClick: () => trackEvent('cta_click', { cta_name: 'Scan a Recipe', location: 'see_it_cook_it' }),
  useIngredientsClick: () => trackEvent('cta_click', { cta_name: 'Use My Ingredients', location: 'see_it_cook_it' }),
  imageUploadStart: (mode: string) => trackEvent('upload_start', { mode }),
  imageUploadSuccess: (mode: string) => trackEvent('upload_success', { mode }),
  imageUploadError: (error: string) => trackEvent('upload_error', { error_type: error }),

  // Chef Pepe
  talkToChefPepe: (location: string) => trackEvent('cta_click', { cta_name: 'Talk to Chef Pepe', location }),
  chefPepeDemoMessage: () => trackEvent('demo_interaction', { feature: 'chef_pepe_chat' }),

  // Recipes
  recipeCardClick: (recipeTitle: string) => trackEvent('recipe_click', { recipe_title: recipeTitle }),
  saveRecipeClick: (recipeTitle: string) => trackEvent('cta_click', { cta_name: 'Save Recipe', recipe_title: recipeTitle }),
  startCookingClick: (recipeTitle: string) => trackEvent('cta_click', { cta_name: 'Start Cooking', recipe_title: recipeTitle }),

  // Creators
  becomeCreatorClick: (location: string) => trackEvent('cta_click', { cta_name: 'Become a Creator', location }),
  creatorApplyFormSubmit: () => trackEvent('form_submit', { form_name: 'creator_application' }),

  // Creator Academy
  joinAcademyClick: (location: string) => trackEvent('cta_click', { cta_name: 'Join Creator Academy', location }),
  academyWaitlistSubmit: () => trackEvent('form_submit', { form_name: 'academy_waitlist' }),

  // Restaurants
  claimRestaurantClick: (location: string) => trackEvent('cta_click', { cta_name: 'Claim Your Restaurant', location }),
  partnerWithChewClick: (location: string) => trackEvent('cta_click', { cta_name: 'Partner with Chew', location }),

  // Contact / Support
  reportProblemClick: () => trackEvent('cta_click', { cta_name: 'Report a Problem', location: 'support' }),
  shareFeedbackClick: () => trackEvent('cta_click', { cta_name: 'Share Feedback', location: 'support' }),
  contactFormSubmit: (topic: string) => trackEvent('form_submit', { form_name: 'contact', topic }),

  // Navigation
  navLinkClick: (label: string) => trackEvent('nav_click', { link_label: label }),
  footerLinkClick: (label: string) => trackEvent('footer_click', { link_label: label }),

  // Search
  searchSubmit: (query: string, location: string) => trackEvent('search', { search_term: query, location }),
};
