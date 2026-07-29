'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const communityPosts = [
{
  id: 1,
  user: 'Amara Osei',
  handle: '@amaracooks',
  avatar: "https://images.unsplash.com/photo-1507532459814-b32f63cf4497",
  avatarAlt: 'Portrait of Amara Osei smiling',
  type: 'finished dish',
  content: 'Finally nailed my grandmother\'s jollof rice recipe. Three attempts, one very patient family, and now it\'s perfect. The secret is the tomato base.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_181f54088-1777382429458.png",
  imageAlt: 'Steaming pot of perfectly cooked Nigerian jollof rice with tomatoes and spices',
  likes: 342,
  comments: 47,
  saves: 89,
  time: '2h ago'
},
{
  id: 2,
  user: 'Tomás Rivera',
  handle: '@tomasrivera',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1248a5258-1763296189103.png",
  avatarAlt: 'Portrait of Tomás Rivera in a kitchen',
  type: 'kitchen tip',
  content: 'Game changer: salt your pasta water until it tastes like the sea. Not a little salt. A lot of salt. Your pasta will thank you.',
  image: null,
  imageAlt: '',
  likes: 891,
  comments: 103,
  saves: 214,
  time: '4h ago'
},
{
  id: 3,
  user: 'Yuki Tanaka',
  handle: '@yukitanakafood',
  avatar: "https://images.unsplash.com/photo-1661107707452-1d4dc16a3269",
  avatarAlt: 'Portrait of Yuki Tanaka holding a bowl of ramen',
  type: 'recipe',
  content: 'Homemade tonkotsu ramen — 12 hours of simmering, worth every minute. Full recipe now on my profile.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1d3246c78-1772054960592.png",
  imageAlt: 'Rich creamy tonkotsu ramen bowl with chashu pork, soft egg, and nori',
  likes: 1204,
  comments: 88,
  saves: 432,
  time: '6h ago'
},
{
  id: 4,
  user: 'Fatima Al-Rashid',
  handle: '@fatimakitchen',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_13849b98e-1763301198389.png",
  avatarAlt: 'Portrait of Fatima Al-Rashid in her home kitchen',
  type: 'family story',
  content: 'My mother taught me this lamb kofta recipe when I was 8. She learned it from her mother. Now I\'m teaching my daughter. Some recipes are more than food.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_19f5814da-1772468751409.png",
  imageAlt: 'Grilled lamb kofta skewers on a platter with flatbread and yogurt sauce',
  likes: 2103,
  comments: 156,
  saves: 678,
  time: '1d ago'
}];


const collections = [
{
  title: 'Weeknight Wins',
  curator: 'Sofia Patel',
  saves: 4210,
  count: 24,
  images: [
  'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=200&q=80',
  'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200&q=80',
  'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=200&q=80'],

  alts: ['Pasta dish', 'Orzo with vegetables', 'Tacos']
},
{
  title: 'Comfort Food Hall of Fame',
  curator: 'Jake Torres',
  saves: 3891,
  count: 31,
  images: [
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&q=80',
  'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=200&q=80',
  'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=200&q=80'],

  alts: ['Pancakes', 'Mac and cheese', 'French toast']
},
{
  title: 'Recipes Worth Passing Down',
  curator: 'Fatima Al-Rashid',
  saves: 5102,
  count: 18,
  images: [
  'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=200&q=80',
  'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=200&q=80',
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&q=80'],

  alts: ['Jollof rice', 'Lamb kofta', 'Tikka masala']
}];


const newCreators = [
{
  name: 'Priya Nair',
  handle: '@priyanairfood',
  specialty: 'South Indian',
  followers: '12K',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1af8672d7-1763301328088.png",
  alt: 'Portrait of food creator Priya Nair'
},
{
  name: 'Marco Rossi',
  handle: '@marcorossicooks',
  specialty: 'Italian',
  followers: '8.4K',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f110cb20-1763296324102.png",
  alt: 'Portrait of food creator Marco Rossi'
},
{
  name: 'Lin Wei',
  handle: '@linweikitchen',
  specialty: 'Sichuan',
  followers: '19K',
  image: "https://images.unsplash.com/photo-1659352156021-3d9babc8b574",
  alt: 'Portrait of food creator Lin Wei'
},
{
  name: 'Carlos Mendez',
  handle: '@carlosmendezfood',
  specialty: 'Mexican',
  followers: '6.2K',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f110cb20-1763296324102.png",
  alt: 'Portrait of food creator Carlos Mendez'
}];


const familyStories = [
{
  title: 'My Nonna\'s Sunday Gravy',
  author: 'Marco Rossi',
  excerpt: 'Every Sunday for 40 years, my grandmother made the same sauce. I finally wrote it down before it was too late.',
  image: "https://images.unsplash.com/photo-1711246875135-5049396fee92",
  alt: 'Rich Italian tomato sauce simmering in a large pot with fresh basil'
},
{
  title: 'The Dumpling Fold That Took Me 10 Years',
  author: 'Lin Wei',
  excerpt: 'My mother could fold 50 dumplings in the time it took me to fold one. This is the story of finally getting it right.',
  image: "https://images.unsplash.com/photo-1581816299292-0d2e78bc745c",
  alt: 'Perfectly folded Chinese dumplings arranged in rows on a floured surface'
}];


export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false);
  const [earlyAccessEmail, setEarlyAccessEmail] = useState('');
  const [earlyAccessSubmitted, setEarlyAccessSubmitted] = useState(false);
  const [earlyAccessFeature, setEarlyAccessFeature] = useState('');

  const handleEarlyAccess = (feature: string) => {
    setEarlyAccessFeature(feature);
    setShowEarlyAccessModal(true);
  };

  const handleEarlyAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEarlyAccessSubmitted(true);
    setTimeout(() => {
      setShowEarlyAccessModal(false);
      setEarlyAccessSubmitted(false);
      setEarlyAccessEmail('');
    }, 2500);
  };

  const filteredPosts = activeTab === 'all' ?
  communityPosts :
  communityPosts.filter((p) => {
    if (activeTab === 'recipes') return p.type === 'recipe' || p.type === 'finished dish';
    if (activeTab === 'tips') return p.type === 'kitchen tip';
    if (activeTab === 'stories') return p.type === 'family story';
    return true;
  });

  return (
    <main className="bg-background min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 bg-gradient-to-b from-muted to-background">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-hero-lg font-extrabold text-foreground mb-4 tracking-tight">
            Food is better when it is shared.
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Post what you cooked, preserve a family recipe, join a challenge, follow creators, and discover how other people make food their own.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/join?interest=community" className="btn-primary">Join the Community</Link>
            <Link href="#challenge" className="btn-secondary">This Week&apos;s Challenge</Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">

        {/* Current Challenge */}
        <section id="challenge" aria-labelledby="challenge-heading">
          <div className="relative rounded-3xl overflow-hidden bg-foreground text-white">
            <div className="absolute inset-0 opacity-20">
              <img
                src="https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3"
                alt="Juicy burger with all the toppings on a wooden board"
                className="w-full h-full object-cover" />
              
            </div>
            <div className="relative z-10 p-8 sm:p-12">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <span className="inline-block bg-accent text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                    This week on Chew
                  </span>
                  <h2 id="challenge-heading" className="text-2xl sm:text-4xl font-extrabold mb-3">
                    The Perfect Burger Challenge
                  </h2>
                  <p className="text-white/80 text-lg max-w-xl">
                    Build your best burger, tell us what makes it special, and share your final plate.
                  </p>
                  <div className="flex items-center gap-6 mt-4">
                    <div className="text-center">
                      <p className="text-2xl font-extrabold">847</p>
                      <p className="text-white/60 text-xs">entries</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-extrabold">4</p>
                      <p className="text-white/60 text-xs">days left</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 shrink-0">
                  <Link href="/join?interest=community" className="btn-accent">Join the Challenge</Link>
                  <button className="btn-secondary border-white/30 text-white hover:bg-white hover:text-foreground">View All Entries</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Feed */}
        <section aria-labelledby="feed-heading">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 id="feed-heading" className="text-2xl font-extrabold text-foreground">Fresh from the community</h2>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {(['all', 'recipes', 'tips', 'stories'] as const).map((tab) =>
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                activeTab === tab ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'}`
                }>
                
                  {tab}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPosts.map((post) =>
            <article key={post.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-card-hover transition-all duration-300">
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <img src={post.avatar} alt={post.avatarAlt} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="font-bold text-foreground text-sm">{post.user}</p>
                      <p className="text-muted-foreground text-xs">{post.handle} · {post.time}</p>
                    </div>
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full capitalize">{post.type}</span>
                  </div>
                  <p className="text-foreground text-sm leading-relaxed mb-4">{post.content}</p>
                </div>
                {post.image &&
              <div className="h-56 overflow-hidden">
                    <img src={post.image} alt={post.imageAlt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
              }
                <div className="p-4 flex items-center gap-4 border-t border-border">
                  <button className="flex items-center gap-1.5 text-muted-foreground hover:text-accent transition-colors text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    {post.likes}
                  </button>
                  <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    {post.comments}
                  </button>
                  <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-sm ml-auto">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                    {post.saves}
                  </button>
                </div>
              </article>
            )}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => handleEarlyAccess('posting')}
              className="btn-secondary"
            >
              Create a Post
            </button>
            <p className="text-xs text-muted-foreground mt-2">Community posting coming soon — join early access to be first.</p>
          </div>
        </section>

        {/* Collections */}
        <section aria-labelledby="collections-heading">
          <div className="flex items-center justify-between mb-6">
            <h2 id="collections-heading" className="text-2xl font-extrabold text-foreground">Collections people are saving</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {collections.map((col) =>
            <div key={col.title} className="bg-card border border-border rounded-2xl p-5 hover:shadow-card-hover transition-all duration-300 cursor-pointer group">
                <div className="flex gap-2 mb-4">
                  {col.images.map((img, i) =>
                <div key={i} className={`rounded-xl overflow-hidden ${i === 0 ? 'flex-[2]' : 'flex-1'} h-24`}>
                      <img src={img} alt={col.alts[i]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                )}
                </div>
                <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{col.title}</h3>
                <p className="text-muted-foreground text-xs">by {col.curator} · {col.count} recipes</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground">{col.saves.toLocaleString()} saves</span>
                  <button className="text-xs text-primary font-semibold hover:underline">Save Collection</button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* New Creators */}
        <section aria-labelledby="new-creators-heading">
          <div className="flex items-center justify-between mb-6">
            <h2 id="new-creators-heading" className="text-2xl font-extrabold text-foreground">New voices to follow</h2>
            <Link href="/creators" className="text-primary text-sm font-semibold hover:underline">All creators</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {newCreators.map((creator) =>
            <div key={creator.handle} className="bg-card border border-border rounded-2xl p-5 text-center hover:shadow-card-hover transition-all duration-300">
                <img src={creator.image} alt={creator.alt} className="w-16 h-16 rounded-full object-cover mx-auto mb-3" />
                <p className="font-bold text-foreground text-sm">{creator.name}</p>
                <p className="text-muted-foreground text-xs">{creator.handle}</p>
                <p className="text-accent text-xs font-medium mt-1">{creator.specialty}</p>
                <p className="text-muted-foreground text-xs mt-1">{creator.followers} followers</p>
                <button
                  onClick={() => handleEarlyAccess('following')}
                  className="btn-secondary py-1.5 px-4 text-xs mt-3 w-full justify-center"
                >
                  Follow
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Family Stories */}
        <section aria-labelledby="stories-heading" className="section-cream rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 id="stories-heading" className="text-2xl font-extrabold text-foreground">Recipes with a story</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {familyStories.map((story) =>
            <div key={story.title} className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-card-hover transition-all duration-300 cursor-pointer group">
                <div className="h-48 overflow-hidden">
                  <img src={story.image} alt={story.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{story.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{story.excerpt}</p>
                  <p className="text-xs text-accent font-medium mt-3">by {story.author}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Community Guidelines */}
        <section className="border-2 border-border rounded-3xl p-8 sm:p-10">
          <h2 className="text-xl font-extrabold text-foreground mb-3">A generous table has room for everyone.</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Be constructive. Credit creators. Respect cultures. Keep feedback useful. Never shame someone for their skill level, budget, diet, or food traditions.
          </p>
          <Link href="/community-guidelines" className="text-primary font-semibold text-sm hover:underline">
            Read Community Guidelines →
          </Link>
        </section>

      </div>

      <Footer />

      {/* Early Access Modal — Phase 3 features */}
      {showEarlyAccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-background rounded-3xl p-8 max-w-md w-full shadow-2xl">
            {earlyAccessSubmitted ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-3">🎉</div>
                <h3 className="font-extrabold text-foreground text-xl mb-2">You&apos;re on the list!</h3>
                <p className="text-muted-foreground text-sm">We&apos;ll notify you as soon as community {earlyAccessFeature} launches.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">🚀</span>
                  <div>
                    <h3 className="font-extrabold text-foreground text-lg">Coming Soon</h3>
                    <p className="text-muted-foreground text-xs">Community {earlyAccessFeature} is in Phase 3 of our build</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 mt-3">
                  We&apos;re building community {earlyAccessFeature === 'posting' ? 'posting, follows, comments, and challenges' : 'follows, notifications, and creator profiles'} as part of our next launch phase. Join early access to be among the first.
                </p>
                <form onSubmit={handleEarlyAccessSubmit} className="space-y-3">
                  <input
                    type="email"
                    required
                    value={earlyAccessEmail}
                    onChange={(e) => setEarlyAccessEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-input text-foreground focus:outline-none focus:border-primary text-sm"
                  />
                  <button type="submit" className="btn-primary w-full justify-center">
                    Join Early Access
                  </button>
                </form>
                <button
                  onClick={() => setShowEarlyAccessModal(false)}
                  className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Maybe later
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}