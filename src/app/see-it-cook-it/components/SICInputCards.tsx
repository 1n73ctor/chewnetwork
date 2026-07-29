'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { Analytics } from '@/lib/analytics';
import { getChatCompletion } from '@/lib/ai/chatCompletion';

const inputCards = [
  {
    icon: '📸',
    emoji: '🍽️',
    title: 'Show a Meal',
    desc: 'Upload or photograph a dish you want to understand or recreate.',
    detail: 'Chef Pepe identifies the dish, finds a recipe, and builds a step-by-step cooking plan.',
    mode: 'meal',
    cta: 'Upload a Meal',
    color: 'border-primary/30 hover:border-primary',
    iconBg: 'bg-primary',
    accept: 'image/*',
  },
  {
    icon: '🥦',
    emoji: '🛒',
    title: 'Show Your Ingredients',
    desc: 'Use what you already have and get meal ideas built around it.',
    detail: 'Point your camera at your fridge, pantry, or shopping bag and get personalized meal suggestions.',
    mode: 'ingredients',
    cta: 'Use My Ingredients',
    color: 'border-accent/30 hover:border-accent',
    iconBg: 'bg-accent',
    accept: 'image/*',
  },
  {
    icon: '📋',
    emoji: '📖',
    title: 'Scan a Recipe',
    desc: 'Turn printed, handwritten, or saved recipes into a guided cooking experience.',
    detail: 'Photograph any recipe — from a cookbook, a note, or a screen — and Chef Pepe turns it into interactive steps.',
    mode: 'recipe',
    cta: 'Scan a Recipe',
    color: 'border-primary/30 hover:border-primary',
    iconBg: 'bg-primary',
    accept: 'image/*',
  },
];

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'image/webp'];
const MAX_SIZE_MB = 10;

type UploadState = 'idle' | 'uploading' | 'analyzing' | 'result' | 'error';

interface AIAnalysisResult {
  dishName?: string;
  ingredients?: string[];
  recipeSuggestion?: string;
  cookingSteps?: string[];
  detectedItems?: string[];
  mealIdeas?: string[];
  recipeTitle?: string;
  recipeSteps?: string[];
  estimatedTime?: string;
  difficulty?: string;
  rawSummary: string;
}

interface UploadResult {
  mode: string;
  fileName: string;
  preview: string;
  analysis: AIAnalysisResult;
}

function buildPromptForMode(mode: string): string {
  if (mode === 'meal') {
    return `You are Chef Pepe, an expert culinary AI. Analyze this food image and respond with a JSON object containing:
{
  "dishName": "name of the dish",
  "ingredients": ["ingredient1", "ingredient2", ...],
  "recipeSuggestion": "brief recipe description",
  "cookingSteps": ["step 1", "step 2", "step 3"],
  "estimatedTime": "e.g. 30 minutes",
  "difficulty": "Easy / Medium / Hard",
  "rawSummary": "A friendly 1-2 sentence summary of what you see"
}
Be specific and accurate. If you cannot identify a food item, say so in rawSummary.`;
  }
  if (mode === 'ingredients') {
    return `You are Chef Pepe, an expert culinary AI. Analyze this image of ingredients/fridge/pantry and respond with a JSON object:
{
  "detectedItems": ["item1", "item2", ...],
  "mealIdeas": ["meal idea 1", "meal idea 2", "meal idea 3"],
  "recipeSuggestion": "best recipe you can make with these ingredients",
  "cookingSteps": ["step 1", "step 2", "step 3"],
  "estimatedTime": "e.g. 25 minutes",
  "difficulty": "Easy / Medium / Hard",
  "rawSummary": "A friendly 1-2 sentence summary of what ingredients you see and what you can make"
}`;
  }
  // recipe mode
  return `You are Chef Pepe, an expert culinary AI. Analyze this recipe image (could be a cookbook page, handwritten note, or printed recipe) and respond with a JSON object:
{
  "recipeTitle": "name of the recipe",
  "ingredients": ["ingredient1 with quantity", "ingredient2 with quantity", ...],
  "recipeSteps": ["step 1", "step 2", "step 3", ...],
  "estimatedTime": "e.g. 45 minutes",
  "difficulty": "Easy / Medium / Hard",
  "rawSummary": "A friendly 1-2 sentence summary of the recipe you scanned"
}`;
}

function parseAIResponse(raw: string): AIAnalysisResult {
  try {
    // Extract JSON from the response (model may wrap it in markdown)
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return { ...parsed, rawSummary: parsed.rawSummary || raw };
    }
  } catch {
    // fall through to raw
  }
  return { rawSummary: raw };
}

export default function SICInputCards() {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileSelect = async (mode: string, file: File) => {
    setErrorMessage('');

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMessage('Unsupported file type. Please upload a JPG, PNG, HEIC, or WebP image.');
      setUploadState('error');
      Analytics.imageUploadError('invalid_type');
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMessage(`File is too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      setUploadState('error');
      Analytics.imageUploadError('file_too_large');
      return;
    }

    setActiveMode(mode);
    setUploadState('uploading');
    Analytics.imageUploadStart(mode);

    try {
      // Read file as base64 data URI
      const base64DataUri = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      const preview = base64DataUri;
      setUploadState('analyzing');

      // Call Gemini with multimodal input
      const prompt = buildPromptForMode(mode);
      const response = await getChatCompletion(
        'GEMINI',
        'gemini/gemini-2.5-flash',
        [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: base64DataUri } },
            ],
          },
        ],
        { temperature: 0.3, max_tokens: 1024 }
      );

      const rawContent = response?.choices?.[0]?.message?.content || '';
      const analysis = parseAIResponse(rawContent);

      setUploadState('result');
      setUploadResult({ mode, fileName: file.name, preview, analysis });
      Analytics.imageUploadSuccess(mode);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      setErrorMessage(msg);
      setUploadState('error');
      Analytics.imageUploadError('ai_error');
    }
  };

  const handleInputChange = (mode: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(mode, file);
  };

  const handleDrop = (mode: string, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(mode, file);
  };

  const handleReset = () => {
    setUploadState('idle');
    setActiveMode(null);
    setUploadResult(null);
    setErrorMessage('');
    Object.values(fileInputRefs.current).forEach((ref) => {
      if (ref) ref.value = '';
    });
  };

  const modeLabels: Record<string, string> = {
    meal: 'Meal Identified',
    ingredients: 'Ingredients Scanned',
    recipe: 'Recipe Scanned',
  };

  return (
    <section className="section-cream py-16 lg:py-20" aria-labelledby="input-modes-heading">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="input-modes-heading" className="text-hero-md font-extrabold text-foreground mb-3">
            Three ways to start.
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Show Chef Pepe what you have — he handles the rest.
          </p>
        </div>

        {/* Upload result state */}
        {uploadState === 'result' && uploadResult && (
          <div className="mb-10 bg-white border-2 border-primary rounded-3xl p-8 shadow-xl animate-slide-up opacity-0">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">✅</div>
            <h3 className="font-extrabold text-foreground text-xl mb-2 text-center">{modeLabels[uploadResult.mode] || 'Upload Complete'}</h3>

            <div className="flex flex-col lg:flex-row gap-6 mt-4">
              {/* Image preview */}
              <div className="lg:w-48 shrink-0">
                <div className="rounded-2xl overflow-hidden border border-border">
                  <img src={uploadResult.preview} alt="Your uploaded image" className="w-full h-40 lg:h-48 object-cover" />
                </div>
              </div>

              {/* AI Analysis */}
              <div className="flex-1 space-y-4">
                {/* Summary */}
                <p className="text-muted-foreground text-sm leading-relaxed italic">
                  &ldquo;{uploadResult.analysis.rawSummary}&rdquo;
                </p>

                {/* Meal mode */}
                {uploadResult.mode === 'meal' && (
                  <>
                    {uploadResult.analysis.dishName && (
                      <div>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Dish Identified</span>
                        <p className="font-extrabold text-foreground text-lg">{uploadResult.analysis.dishName}</p>
                        {uploadResult.analysis.estimatedTime && (
                          <p className="text-muted-foreground text-xs mt-0.5">⏱ {uploadResult.analysis.estimatedTime} · {uploadResult.analysis.difficulty}</p>
                        )}
                      </div>
                    )}
                    {uploadResult.analysis.ingredients && uploadResult.analysis.ingredients.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Key Ingredients</span>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {uploadResult.analysis.ingredients.slice(0, 8).map((ing, i) => (
                            <span key={i} className="bg-muted text-foreground text-xs px-2.5 py-1 rounded-full font-medium">{ing}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {uploadResult.analysis.cookingSteps && uploadResult.analysis.cookingSteps.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Quick Steps</span>
                        <ol className="mt-1.5 space-y-1">
                          {uploadResult.analysis.cookingSteps.slice(0, 3).map((step, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex gap-2">
                              <span className="w-4 h-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </>
                )}

                {/* Ingredients mode */}
                {uploadResult.mode === 'ingredients' && (
                  <>
                    {uploadResult.analysis.detectedItems && uploadResult.analysis.detectedItems.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-accent uppercase tracking-wider">Detected Items</span>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {uploadResult.analysis.detectedItems.slice(0, 10).map((item, i) => (
                            <span key={i} className="bg-muted text-foreground text-xs px-2.5 py-1 rounded-full font-medium">{item}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {uploadResult.analysis.mealIdeas && uploadResult.analysis.mealIdeas.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-accent uppercase tracking-wider">Meal Ideas</span>
                        <ul className="mt-1.5 space-y-1">
                          {uploadResult.analysis.mealIdeas.map((idea, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex gap-2 items-start">
                              <span className="text-accent">🍽️</span> {idea}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}

                {/* Recipe mode */}
                {uploadResult.mode === 'recipe' && (
                  <>
                    {uploadResult.analysis.recipeTitle && (
                      <div>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Recipe</span>
                        <p className="font-extrabold text-foreground text-lg">{uploadResult.analysis.recipeTitle}</p>
                        {uploadResult.analysis.estimatedTime && (
                          <p className="text-muted-foreground text-xs mt-0.5">⏱ {uploadResult.analysis.estimatedTime} · {uploadResult.analysis.difficulty}</p>
                        )}
                      </div>
                    )}
                    {uploadResult.analysis.ingredients && uploadResult.analysis.ingredients.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Ingredients</span>
                        <ul className="mt-1.5 space-y-0.5">
                          {uploadResult.analysis.ingredients.slice(0, 6).map((ing, i) => (
                            <li key={i} className="text-xs text-muted-foreground">• {ing}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center mt-6">
              <Link href="/chef-pepe" className="btn-primary" onClick={() => Analytics.talkToChefPepe('see_it_cook_it_result')}>
                <span>🍳</span> Continue with Chef Pepe
              </Link>
              <button onClick={handleReset} className="btn-secondary">
                Try Another Image
              </button>
            </div>
          </div>
        )}

        {/* Uploading / Analyzing state */}
        {(uploadState === 'uploading' || uploadState === 'analyzing') && (
          <div className="mb-10 bg-white border-2 border-primary/30 rounded-3xl p-8 text-center shadow-xl">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 animate-pulse">🍳</div>
            <h3 className="font-extrabold text-foreground text-xl mb-2">
              {uploadState === 'uploading' ? 'Uploading your image…' : 'Chef Pepe is analysing…'}
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              {uploadState === 'uploading' ?'Securely transferring your image.' :'Identifying ingredients, dish, and building your cooking plan with Gemini AI.'}
            </p>
            <div className="flex items-center gap-1 justify-center">
              {[1, 2, 3, 4, 5].map((b) => (
                <div key={b} className={`w-2 rounded-full bg-primary wave-bar-${b}`} style={{ height: '10px' }} />
              ))}
            </div>
          </div>
        )}

        {/* Error state */}
        {uploadState === 'error' && (
          <div className="mb-10 bg-red-50 border-2 border-red-200 rounded-3xl p-8 text-center" role="alert">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">⚠️</div>
            <h3 className="font-extrabold text-foreground text-xl mb-2">Upload failed</h3>
            <p className="text-red-700 text-sm mb-6">{errorMessage}</p>
            <button onClick={handleReset} className="btn-primary bg-red-600 hover:bg-red-700">
              Try Again
            </button>
          </div>
        )}

        {/* Cards — hide when uploading/result */}
        {(uploadState === 'idle' || uploadState === 'error') && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {inputCards.map((card, i) => (
              <div
                key={card.title}
                className={`group bg-white border-2 ${card.color} rounded-3xl p-7 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col`}
                style={{ animationDelay: `${i * 0.12}s` }}
                onDrop={(e) => handleDrop(card.mode, e)}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className={`${card.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  {card.icon}
                </div>
                <div className="text-3xl mb-3">{card.emoji}</div>
                <h3 className="font-extrabold text-foreground text-lg mb-2">{card.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3 flex-1">{card.desc}</p>
                <p className="text-muted-foreground/70 text-xs leading-relaxed mb-5 italic">{card.detail}</p>

                <input
                  ref={(el) => { fileInputRefs.current[card.mode] = el; }}
                  type="file"
                  accept={card.accept}
                  className="sr-only"
                  id={`file-input-${card.mode}`}
                  aria-label={`Upload image for ${card.title}`}
                  onChange={(e) => handleInputChange(card.mode, e)}
                />
                <label
                  htmlFor={`file-input-${card.mode}`}
                  className="btn-primary w-full justify-center cursor-pointer"
                  onClick={() => {
                    if (card.mode === 'meal') Analytics.uploadMealClick();
                    if (card.mode === 'ingredients') Analytics.useIngredientsClick();
                    if (card.mode === 'recipe') Analytics.scanRecipeClick();
                  }}
                >
                  <Icon name="CameraIcon" size={16} />
                  {card.cta}
                </label>
              </div>
            ))}
          </div>
        )}

        {/* Privacy note */}
        <div className="mt-8 bg-white border border-border rounded-2xl p-5 max-w-2xl mx-auto">
          <div className="flex items-start gap-3">
            <Icon name="ShieldCheckIcon" size={20} className="text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground text-sm mb-1">Your privacy is protected.</p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Images are processed securely and are <strong>not stored</strong> without your explicit consent. We do not use your food photos to train AI models without permission. Supported formats: JPG, PNG, HEIC, WebP. Max 10MB.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}