'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { getClient } from '@/lib/supabase/client';

const PAGE_SIZE = 9;

interface SavedRecipe {
  id: string;
  recipe_title: string;
  recipe_creator: string;
  recipe_time: string;
  recipe_image: string;
  recipe_slug: string;
  saved_at: string;
}

interface ActivityItem {
  id: string;
  activity_type: string;
  activity_data: Record<string, unknown>;
  created_at: string;
}

interface Collection {
  id: string;
  title: string;
  recipe_count: number;
  cover_image: string;
}

interface UserProfile {
  first_name: string;
  full_name: string;
  created_at: string;
}

interface ProfileCache {
  profile: UserProfile | null;
  collections: Collection[];
  savedRecipes: SavedRecipe[];
  savedTotal: number;
  activityItems: ActivityItem[];
  activityTotal: number;
  savedPage: number;
  activityPage: number;
}

// Module-level cache so it survives tab switches within the same session
const profileCache = new Map<string, ProfileCache>();

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'saved' | 'collections' | 'activity'>('saved');
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [dataDownloadRequested, setDataDownloadRequested] = useState(false);

  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [savedTotal, setSavedTotal] = useState(0);
  const [savedPage, setSavedPage] = useState(1);
  const [savedLoading, setSavedLoading] = useState(false);

  const [activityItems, setActivityItems] = useState<ActivityItem[]>([]);
  const [activityTotal, setActivityTotal] = useState(0);
  const [activityPage, setActivityPage] = useState(1);
  const [activityLoading, setActivityLoading] = useState(false);

  const [collections, setCollections] = useState<Collection[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  // Lazy — see getClient(): constructing during render breaks prerendering.
  const getSupabase = () => getClient();
  const initialFetchDone = useRef(false);

  const handleComingSoon = (feature: string) => {
    setComingSoonFeature(feature);
    setShowComingSoon(true);
  };

  // ── Fetch saved recipes (paginated) ──────────────────────────────────────
  const fetchSavedRecipes = useCallback(async (page: number, userId: string, useCache = false) => {
    const cacheKey = userId;
    if (useCache && profileCache.has(cacheKey)) {
      const cached = profileCache.get(cacheKey)!;
      if (cached.savedPage === page) {
        setSavedRecipes(cached.savedRecipes);
        setSavedTotal(cached.savedTotal);
        return;
      }
    }

    setSavedLoading(true);
    try {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, count } = await getSupabase()
        .from('saved_recipes')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('saved_at', { ascending: false })
        .range(from, to);

      const recipes = data ?? [];
      const total = count ?? 0;

      setSavedRecipes(recipes);
      setSavedTotal(total);

      // Update cache
      const existing = profileCache.get(cacheKey) ?? {} as ProfileCache;
      profileCache.set(cacheKey, { ...existing, savedRecipes: recipes, savedTotal: total, savedPage: page });
    } catch {
      // silently handle
    } finally {
      setSavedLoading(false);
    }
  }, []);

  // ── Fetch activity feed (paginated) ──────────────────────────────────────
  const fetchActivityFeed = useCallback(async (page: number, userId: string, useCache = false) => {
    const cacheKey = userId;
    if (useCache && profileCache.has(cacheKey)) {
      const cached = profileCache.get(cacheKey)!;
      if (cached.activityPage === page) {
        setActivityItems(cached.activityItems);
        setActivityTotal(cached.activityTotal);
        return;
      }
    }

    setActivityLoading(true);
    try {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, count } = await getSupabase()
        .from('activity_feed')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to);

      const items = data ?? [];
      const total = count ?? 0;

      setActivityItems(items);
      setActivityTotal(total);

      const existing = profileCache.get(cacheKey) ?? {} as ProfileCache;
      profileCache.set(cacheKey, { ...existing, activityItems: items, activityTotal: total, activityPage: page });
    } catch {
      // silently handle
    } finally {
      setActivityLoading(false);
    }
  }, []);

  // ── Initial data fetch ────────────────────────────────────────────────────
  const fetchInitialData = useCallback(async (userId: string) => {
    // Check cache first
    if (profileCache.has(userId)) {
      const cached = profileCache.get(userId)!;
      if (cached.profile) setProfile(cached.profile);
      if (cached.collections) setCollections(cached.collections);
      setSavedRecipes(cached.savedRecipes ?? []);
      setSavedTotal(cached.savedTotal ?? 0);
      setActivityItems(cached.activityItems ?? []);
      setActivityTotal(cached.activityTotal ?? 0);
      setDataLoading(false);
      return;
    }

    setDataLoading(true);
    try {
      const from = 0;
      const to = PAGE_SIZE - 1;

      const [profileRes, collectionsRes, recipesRes, activityRes] = await Promise.all([
        getSupabase().from('user_profiles').select('first_name, full_name, created_at').eq('id', userId).single(),
        getSupabase().from('collections').select('id, title, recipe_count, cover_image').eq('user_id', userId).order('created_at', { ascending: false }),
        getSupabase().from('saved_recipes').select('*', { count: 'exact' }).eq('user_id', userId).order('saved_at', { ascending: false }).range(from, to),
        getSupabase().from('activity_feed').select('*', { count: 'exact' }).eq('user_id', userId).order('created_at', { ascending: false }).range(from, to),
      ]);

      const profileData = profileRes.data ?? null;
      const collectionsData = collectionsRes.data ?? [];
      const recipesData = recipesRes.data ?? [];
      const recipesTotal = recipesRes.count ?? 0;
      const activityData = activityRes.data ?? [];
      const activityTotal = activityRes.count ?? 0;

      setProfile(profileData);
      setCollections(collectionsData);
      setSavedRecipes(recipesData);
      setSavedTotal(recipesTotal);
      setActivityItems(activityData);
      setActivityTotal(activityTotal);

      // Populate cache
      profileCache.set(userId, {
        profile: profileData,
        collections: collectionsData,
        savedRecipes: recipesData,
        savedTotal: recipesTotal,
        activityItems: activityData,
        activityTotal: activityTotal,
        savedPage: 1,
        activityPage: 1,
      });
    } catch {
      // silently handle
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
      return;
    }
    if (user && !initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchInitialData(user.id);
    }
  }, [user, loading, router, fetchInitialData]);

  const handleSignOut = async () => {
    if (user) profileCache.delete(user.id);
    await signOut();
    router.push('/');
    router.refresh();
  };

  const handleUnsaveRecipe = async (recipeId: string) => {
    await getSupabase().from('saved_recipes').delete().eq('id', recipeId);
    setSavedRecipes(prev => prev.filter(r => r.id !== recipeId));
    setSavedTotal(prev => Math.max(0, prev - 1));
    if (user) {
      const cached = profileCache.get(user.id);
      if (cached) {
        cached.savedRecipes = cached.savedRecipes.filter(r => r.id !== recipeId);
        cached.savedTotal = Math.max(0, cached.savedTotal - 1);
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return;
    setDeleteLoading(true);
    try {
      // Delete user data from Supabase tables
      if (user) {
        await getSupabase().from('saved_recipes').delete().eq('user_id', user.id);
        await getSupabase().from('activity_feed').delete().eq('user_id', user.id);
        await getSupabase().from('user_profiles').delete().eq('id', user.id);
      }
      await signOut();
      router.push('/');
    } catch {
      setDeleteLoading(false);
    }
  };

  const handleDataDownload = () => {
    const data = {
      profile: profile,
      savedRecipes: savedRecipes,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chewnetwork-data.json';
    a.click();
    URL.revokeObjectURL(url);
    setDataDownloadRequested(true);
  };

  const handleSavedPageChange = (newPage: number) => {
    setSavedPage(newPage);
    if (user) fetchSavedRecipes(newPage, user.id);
  };

  const handleActivityPageChange = (newPage: number) => {
    setActivityPage(newPage);
    if (user) fetchActivityFeed(newPage, user.id);
  };

  const savedTotalPages = Math.ceil(savedTotal / PAGE_SIZE);
  const activityTotalPages = Math.ceil(activityTotal / PAGE_SIZE);

  if (loading || dataLoading) {
    return (
      <main className="bg-background min-h-screen">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">Loading your profile…</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const displayName = profile?.first_name || user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Food Lover';
  const memberYear = profile?.created_at ? new Date(profile.created_at).getFullYear() : new Date().getFullYear();

  return (
    <>
      <main className="bg-background min-h-screen pb-24 lg:pb-0">
        <Header />

        <div className="pt-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

          {/* Profile Header */}
          <section aria-labelledby="profile-heading">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-extrabold shrink-0">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h1 id="profile-heading" className="text-2xl font-extrabold text-foreground">{displayName}</h1>
                <p className="text-muted-foreground text-sm mt-1">Member since {memberYear} · Chew Network</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  <span className="text-foreground font-semibold">
                    <strong>{savedTotal}</strong> <span className="text-muted-foreground font-normal">saved recipes</span>
                  </span>
                  <span className="text-foreground font-semibold">
                    <strong>{collections.length}</strong> <span className="text-muted-foreground font-normal">collections</span>
                  </span>
                  <button
                    onClick={() => handleComingSoon('followers')}
                    className="text-foreground font-semibold hover:text-primary transition-colors">
                    <strong>0</strong> <span className="text-muted-foreground font-normal">followers</span>
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleComingSoon('profile editing')}
                  className="btn-secondary text-sm">
                  Edit Profile
                </button>
                <button onClick={handleSignOut} className="btn-secondary text-sm">
                  Sign Out
                </button>
              </div>
            </div>
          </section>

          {/* Account Management */}
          <section aria-labelledby="account-heading" className="border border-border rounded-2xl p-6">
            <h2 id="account-heading" className="font-extrabold text-foreground text-lg mb-4">Account & Data</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-semibold text-foreground text-sm">Download My Data</p>
                  <p className="text-muted-foreground text-xs mt-0.5">Export your saved recipes and profile data as JSON</p>
                </div>
                <button
                  onClick={handleDataDownload}
                  className="btn-secondary text-xs px-4 py-2 shrink-0"
                >
                  {dataDownloadRequested ? '✓ Downloaded' : 'Download'}
                </button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-semibold text-red-600 text-sm">Delete Account</p>
                  <p className="text-muted-foreground text-xs mt-0.5">Permanently delete your account and all data</p>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="text-xs font-semibold px-4 py-2 rounded-full border-2 border-red-300 text-red-600 hover:bg-red-500/10 transition-colors shrink-0"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </section>

          {/* Tabs */}
          <div className="border-b border-border">
            <div className="flex gap-1">
              {(['saved', 'collections', 'activity'] as const).map((tab) =>
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-semibold capitalize transition-all border-b-2 -mb-px ${
                    activeTab === tab
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                  }`}>
                  {tab === 'saved' ? 'Saved Recipes' : tab === 'collections' ? 'Collections' : 'Activity'}
                </button>
              )}
            </div>
          </div>

          {/* Saved Recipes Tab */}
          {activeTab === 'saved' &&
            <section aria-label="Saved recipes">
              {savedLoading ? (
                <div className="flex justify-center py-16">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : savedRecipes.length === 0 ? (
                <div className="bg-muted rounded-2xl p-10 text-center">
                  <span className="text-4xl block mb-3">🍽️</span>
                  <h3 className="font-extrabold text-foreground text-lg mb-2">No saved recipes yet</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5 max-w-sm mx-auto">
                    Browse recipes and tap the bookmark icon to save your favourites here.
                  </p>
                  <Link href="/recipes" className="btn-primary">
                    Discover Recipes
                  </Link>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {savedRecipes.map((recipe) =>
                      <div key={recipe.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-card-hover transition-all duration-300 group">
                        <Link href={`/recipes/${recipe.recipe_slug}`} className="block">
                          <div className="h-44 overflow-hidden relative">
                            {recipe.recipe_image ? (
                              <img
                                src={recipe.recipe_image}
                                alt={recipe.recipe_title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center text-4xl">🍳</div>
                            )}
                            <button
                              onClick={(e) => { e.preventDefault(); handleUnsaveRecipe(recipe.id); }}
                              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-primary shadow-sm"
                              aria-label="Remove from saved">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                              </svg>
                            </button>
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{recipe.recipe_title}</h3>
                            <p className="text-muted-foreground text-xs mt-1">{recipe.recipe_creator}{recipe.recipe_time ? ` · ${recipe.recipe_time}` : ''}</p>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Pagination */}
                  {savedTotalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <button
                        onClick={() => handleSavedPageChange(savedPage - 1)}
                        disabled={savedPage === 1}
                        className="px-4 py-2 rounded-full border border-border text-sm font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                        ← Prev
                      </button>
                      <span className="text-sm text-muted-foreground px-2">
                        Page {savedPage} of {savedTotalPages}
                      </span>
                      <button
                        onClick={() => handleSavedPageChange(savedPage + 1)}
                        disabled={savedPage === savedTotalPages}
                        className="px-4 py-2 rounded-full border border-border text-sm font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                        Next →
                      </button>
                    </div>
                  )}

                  <div className="text-center mt-6">
                    <Link href="/recipes" className="btn-secondary">
                      Discover More Recipes
                    </Link>
                  </div>
                </>
              )}
            </section>
          }

          {/* Collections Tab */}
          {activeTab === 'collections' &&
            <section aria-label="Collections">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {collections.map((col) =>
                  <div key={col.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-card-hover transition-all duration-300 group cursor-pointer">
                    <div className="h-40 overflow-hidden">
                      {col.cover_image ? (
                        <img
                          src={col.cover_image}
                          alt={col.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-4xl">📚</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{col.title}</h3>
                      <p className="text-muted-foreground text-xs mt-1">{col.recipe_count} recipes</p>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => handleComingSoon('creating collections')}
                  className="bg-muted border-2 border-dashed border-border rounded-2xl h-48 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all group">
                  <span className="text-3xl">+</span>
                  <p className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">New Collection</p>
                </button>
              </div>
            </section>
          }

          {/* Activity Feed Tab */}
          {activeTab === 'activity' &&
            <section aria-label="Activity feed">
              {activityLoading ? (
                <div className="flex justify-center py-16">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : activityItems.length === 0 ? (
                <div className="bg-muted rounded-2xl p-10 text-center">
                  <span className="text-4xl block mb-3">📋</span>
                  <h3 className="font-extrabold text-foreground text-lg mb-2">No activity yet</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5 max-w-sm mx-auto">
                    Your cooking history, comments, challenge entries, and community activity will appear here.
                  </p>
                  <Link href="/join?interest=community" className="btn-primary">
                    Join Early Access
                  </Link>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {activityItems.map((item) => (
                      <div key={item.id} className="bg-card border border-border rounded-2xl p-4 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl shrink-0">
                          {item.activity_type === 'saved_recipe' ? '🔖' :
                           item.activity_type === 'cooked' ? '🍳' :
                           item.activity_type === 'comment' ? '💬' :
                           item.activity_type === 'challenge' ? '🏆' : '📌'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground capitalize">
                            {item.activity_type?.replace(/_/g, ' ') || 'Activity'}
                          </p>
                          {item.activity_data && typeof item.activity_data === 'object' && (item.activity_data as Record<string, unknown>).title && (
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                              {String((item.activity_data as Record<string, unknown>).title)}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground/60 mt-1">
                            {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {activityTotalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <button
                        onClick={() => handleActivityPageChange(activityPage - 1)}
                        disabled={activityPage === 1}
                        className="px-4 py-2 rounded-full border border-border text-sm font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                        ← Prev
                      </button>
                      <span className="text-sm text-muted-foreground px-2">
                        Page {activityPage} of {activityTotalPages}
                      </span>
                      <button
                        onClick={() => handleActivityPageChange(activityPage + 1)}
                        disabled={activityPage === activityTotalPages}
                        className="px-4 py-2 rounded-full border border-border text-sm font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                        Next →
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          }

        </div>

        <Footer />

        {/* Coming Soon Modal */}
        {showComingSoon &&
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-background rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
              <span className="text-4xl block mb-3">🚀</span>
              <h3 className="font-extrabold text-foreground text-xl mb-2">Coming Soon</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {comingSoonFeature.charAt(0).toUpperCase() + comingSoonFeature.slice(1)} is part of our upcoming Phase 2 and Phase 3 launch. We&apos;ll notify you when it&apos;s ready.
              </p>
              <button
                onClick={() => setShowComingSoon(false)}
                className="btn-primary w-full justify-center"
              >
                Got it
              </button>
            </div>
          </div>
        }

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-background rounded-3xl p-8 max-w-sm w-full shadow-2xl">
              <span className="text-4xl block mb-3 text-center">⚠️</span>
              <h3 className="font-extrabold text-foreground text-xl mb-2 text-center">Delete Account</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5 text-center">
                This will permanently delete your account, saved recipes, and all data. This cannot be undone.
              </p>
              <p className="text-sm font-semibold text-foreground mb-2">Type <strong>DELETE</strong> to confirm:</p>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground focus:outline-none focus:border-red-400 text-sm mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowDeleteModal(false); setDeleteConfirm(''); }}
                  className="flex-1 btn-secondary text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirm !== 'DELETE' || deleteLoading}
                  className="flex-1 text-sm font-semibold px-4 py-2.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {deleteLoading ? 'Deleting…' : 'Delete Forever'}
                </button>
              </div>
            </div>
          </div>
        )
      }
      </main>
    </>
  );
}