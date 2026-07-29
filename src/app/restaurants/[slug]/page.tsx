'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const restaurant = {
  name: 'Ember & Oak',
  tagline: 'Wood-fired cooking rooted in California tradition.',
  cuisine: 'American · Wood-Fired',
  neighborhood: 'Silver Lake, Los Angeles',
  address: '2847 Sunset Blvd, Los Angeles, CA 90026',
  phone: '(323) 555-0182',
  website: 'emberandoak.com',
  price: '$$$',
  rating: 4.8,
  reviews: 1204,
  verified: true,
  open: true,
  hours: 'Open until 10:00 PM',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_12e69467a-1772156433182.png",
  alt: 'Warm interior of Ember and Oak restaurant with wood-fired oven glowing in the background',
  images: [
  {
    src: "https://img.rocket.new/generatedImages/rocket_gen_img_1a480efa4-1785268832682.png",
    alt: 'Beautifully plated wood-fired steak with roasted vegetables at Ember and Oak'
  },
  {
    src: "https://img.rocket.new/generatedImages/rocket_gen_img_1192676a6-1772231531849.png",
    alt: 'Rustic dining room with exposed brick walls and warm candlelight'
  },
  {
    src: "https://img.rocket.new/generatedImages/rocket_gen_img_1426cb09b-1772456999824.png",
    alt: 'Chef plating a dish in the open kitchen at Ember and Oak'
  },
  {
    src: "https://img.rocket.new/generatedImages/rocket_gen_img_1c2b3d236-1767009263868.png",
    alt: 'Wood-fired pizza with fresh basil and buffalo mozzarella'
  }],

  tags: ['Wood-Fired', 'Date Night', 'Outdoor Seating', 'Full Bar', 'Reservations'],
  about:
  'Ember & Oak is a California-born restaurant celebrating the ancient art of wood-fire cooking. Every dish passes through our custom-built oak-burning hearth — from the 45-day dry-aged ribeye to the wood-roasted broccolini. Chef Daniel Reyes trained in Barcelona and brings a Spanish-Californian sensibility to every plate.',
  signatureDishes: [
  {
    name: '45-Day Dry-Aged Ribeye',
    description: 'Oak-fired, bone-in, served with bone marrow butter and ember-roasted shallots.',
    price: '$68',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b37b9dba-1771906934312.png",
    alt: 'Thick dry-aged ribeye steak with bone marrow butter on a wooden board'
  },
  {
    name: 'Wood-Fired Whole Branzino',
    description: 'Mediterranean sea bass, charred lemon, capers, and fresh herbs.',
    price: '$42',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_18b96c66c-1771906933716.png",
    alt: 'Whole roasted branzino fish with charred lemon and herbs on a white plate'
  },
  {
    name: 'Ember-Roasted Beet Salad',
    description: 'Candy-stripe beets, whipped goat cheese, candied walnuts, aged balsamic.',
    price: '$18',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_162cd3ef6-1772055906317.png",
    alt: 'Colorful roasted beet salad with goat cheese and walnuts on a slate plate'
  }],

  creatorVisits: [
  {
    creator: 'Jake Torres',
    handle: '@jaketorrescooks',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1d9fa22b4-1763301670279.png",
    alt: 'Portrait of food creator Jake Torres',
    caption: 'That ribeye changed my life. The bone marrow butter alone is worth the drive.',
    saves: 2341,
    comments: 187
  },
  {
    creator: 'Maria Chen',
    handle: '@mariachencooks',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1af8672d7-1763301328088.png",
    alt: 'Portrait of food creator Maria Chen',
    caption: 'The branzino is the most perfectly cooked fish I\'ve had in LA. Full stop.',
    saves: 1892,
    comments: 143
  }],

  hours_detail: [
  { day: 'Monday', hours: 'Closed' },
  { day: 'Tuesday – Thursday', hours: '5:00 PM – 10:00 PM' },
  { day: 'Friday – Saturday', hours: '5:00 PM – 11:00 PM' },
  { day: 'Sunday', hours: '4:00 PM – 9:00 PM' }]

};

export default function RestaurantDetailPage() {
  const [activeTab, setActiveTab] = useState<'menu' | 'visits' | 'info'>('menu');

  return (
    <main className="bg-background min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-20">
        <div className="relative h-64 sm:h-80 lg:h-[440px] overflow-hidden">
          <img
            src={restaurant.image}
            alt={restaurant.alt}
            className="w-full h-full object-cover" />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-5xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              {restaurant.tags.map((tag) =>
              <span key={tag} className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold">
                  {tag}
                </span>
              )}
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl sm:text-5xl font-extrabold text-white">{restaurant.name}</h1>
                  {restaurant.verified &&
                  <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">✓ Verified</span>
                  }
                </div>
                <p className="text-white/80 text-base">{restaurant.cuisine} · {restaurant.neighborhood}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 justify-end">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-white font-extrabold text-xl">{restaurant.rating}</span>
                </div>
                <p className="text-white/70 text-sm">{restaurant.reviews.toLocaleString()} reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Quick info bar */}
        <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-border mb-8">
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${restaurant.open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {restaurant.hours}
          </span>
          <span className="text-muted-foreground text-sm">{restaurant.price}</span>
          <span className="text-muted-foreground text-sm">{restaurant.address}</span>
          <div className="ml-auto flex gap-3">
            <button className="btn-secondary text-sm py-2 px-4">Get Directions</button>
            <button className="btn-primary text-sm py-2 px-4">Reserve a Table</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main */}
          <div className="lg:col-span-2">

            {/* About */}
            <section className="mb-8">
              <h2 className="text-xl font-extrabold text-foreground mb-3">About</h2>
              <p className="text-muted-foreground leading-relaxed">{restaurant.about}</p>
            </section>

            {/* Photo grid */}
            <section className="mb-8">
              <h2 className="text-xl font-extrabold text-foreground mb-4">Photos</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {restaurant.images.map((img, i) =>
                <div key={i} className={`relative overflow-hidden rounded-xl ${i === 0 ? 'col-span-2 row-span-2 h-56' : 'h-28'}`}>
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
              </div>
            </section>

            {/* Tabs */}
            <div className="border-b border-border mb-6">
              <div className="flex gap-6">
                {(['menu', 'visits', 'info'] as const).map((tab) =>
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab ?
                  'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`
                  }>
                  
                    {tab === 'menu' ? 'Signature Dishes' : tab === 'visits' ? 'Creator Visits' : 'Info & Hours'}
                  </button>
                )}
              </div>
            </div>

            {/* Tab content */}
            {activeTab === 'menu' &&
            <section aria-label="Signature dishes">
                <div className="space-y-4">
                  {restaurant.signatureDishes.map((dish) =>
                <div key={dish.name} className="bg-card border border-border rounded-2xl overflow-hidden flex gap-4">
                      <div className="w-28 h-28 shrink-0 overflow-hidden">
                        <img src={dish.image} alt={dish.alt} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-foreground">{dish.name}</h3>
                          <span className="font-extrabold text-primary shrink-0">{dish.price}</span>
                        </div>
                        <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{dish.description}</p>
                        <button className="mt-3 text-xs font-semibold text-accent hover:text-primary transition-colors flex items-center gap-1">
                          <span>🍳</span> Ask Chef Pepe to recreate this
                        </button>
                      </div>
                    </div>
                )}
                </div>
              </section>
            }

            {activeTab === 'visits' &&
            <section aria-label="Creator visits">
                <div className="space-y-4">
                  {restaurant.creatorVisits.map((visit) =>
                <div key={visit.handle} className="bg-card border border-border rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <img src={visit.image} alt={visit.alt} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-foreground text-sm">{visit.creator}</p>
                          <p className="text-muted-foreground text-xs">{visit.handle}</p>
                        </div>
                      </div>
                      <p className="text-foreground text-sm italic leading-relaxed">&ldquo;{visit.caption}&rdquo;</p>
                      <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                        <span>❤️ {visit.saves.toLocaleString()} saves</span>
                        <span>💬 {visit.comments} comments</span>
                      </div>
                    </div>
                )}
                </div>
              </section>
            }

            {activeTab === 'info' &&
            <section aria-label="Restaurant info and hours">
                <div className="space-y-4">
                  <div className="bg-card border border-border rounded-2xl p-5">
                    <h3 className="font-bold text-foreground mb-4">Hours</h3>
                    <ul className="space-y-2">
                      {restaurant.hours_detail.map((h) =>
                    <li key={h.day} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{h.day}</span>
                          <span className={`font-semibold ${h.hours === 'Closed' ? 'text-red-500' : 'text-foreground'}`}>
                            {h.hours}
                          </span>
                        </li>
                    )}
                    </ul>
                  </div>
                  <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                    <h3 className="font-bold text-foreground mb-2">Contact</h3>
                    <p className="text-sm text-muted-foreground">{restaurant.address}</p>
                    <p className="text-sm text-muted-foreground">{restaurant.phone}</p>
                    <p className="text-sm text-primary font-medium">{restaurant.website}</p>
                  </div>
                </div>
              </section>
            }
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-bold text-foreground mb-2">Make a Reservation</h3>
              <div className="bg-muted rounded-xl p-4 text-center">
                <span className="text-2xl block mb-2">🗓️</span>
                <p className="font-semibold text-foreground text-sm mb-1">Reservations Coming Soon</p>
                <p className="text-muted-foreground text-xs mb-3 leading-relaxed">
                  Online reservations and order integrations are part of our Phase 6 restaurant tools. Join early access to be notified.
                </p>
                <Link href="/join?interest=restaurants" className="btn-primary text-xs w-full text-center block">
                  Join Early Access
                </Link>
                <p className="text-xs text-muted-foreground mt-3">
                  In the meantime, call <span className="font-semibold text-foreground">{restaurant.phone}</span> to reserve.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🍳</span>
                <p className="font-bold text-foreground text-sm">Recreate it at home</p>
              </div>
              <p className="text-muted-foreground text-xs mb-3">
                Ask Chef Pepe to help you recreate any dish from {restaurant.name} at home.
              </p>
              <Link href="/chef-pepe" className="btn-primary text-sm w-full text-center block">
                Ask Chef Pepe
              </Link>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Accuracy note:</strong> Restaurant information is provided by owners and the community. Hours and menus may change. Always confirm directly with the restaurant before visiting.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </main>);

}