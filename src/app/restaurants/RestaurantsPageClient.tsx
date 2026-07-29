'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppImage from '@/components/ui/AppImage';

const cuisineFilters = ['All', 'American', 'Mexican', 'Italian', 'Japanese', 'Korean', 'Indian', 'Thai', 'Mediterranean', 'Chinese', 'Middle Eastern', 'Vegan'];

const featuredRestaurants = [
  { id: 1, name: 'Mariscos El Padrino', cuisine: 'Mexican Seafood', neighborhood: 'East LA', price: '$$', signatureDish: 'Aguachile Negro', hoursStatus: 'Open until 10 PM', verified: true, image: "https://img.rocket.new/generatedImages/rocket_gen_img_16f5c35f8-1785117597865.png", alt: 'Vibrant Mexican seafood restaurant interior with colorful tiles and fresh ceviche on the counter', rating: 4.8, reviews: 312, badge: 'Creator Favorite' },
  { id: 2, name: 'Umami Ramen House', cuisine: 'Japanese Ramen', neighborhood: 'Koreatown', price: '$$', signatureDish: 'Black Garlic Tonkotsu', hoursStatus: 'Open until 11 PM', verified: true, image: "https://img.rocket.new/generatedImages/rocket_gen_img_192529a2a-1772324139760.png", alt: 'Steaming bowl of rich tonkotsu ramen with chashu pork, soft egg, and nori in a cozy Japanese restaurant', rating: 4.9, reviews: 541, badge: 'Community Pick' },
  { id: 3, name: 'Spice Route Kitchen', cuisine: 'Indian', neighborhood: 'Little India', price: '$$$', signatureDish: 'Lamb Rogan Josh', hoursStatus: 'Open until 9:30 PM', verified: true, image: "https://img.rocket.new/generatedImages/rocket_gen_img_1fd42c561-1764715679635.png", alt: 'Aromatic Indian curry dishes with colorful spices and naan bread on a wooden table', rating: 4.7, reviews: 228, badge: 'Editorial Pick' },
  { id: 4, name: 'Trattoria Nonna Rosa', cuisine: 'Italian', neighborhood: 'Silver Lake', price: '$$$', signatureDish: 'Cacio e Pepe', hoursStatus: 'Closes at 10 PM', verified: false, image: "https://img.rocket.new/generatedImages/rocket_gen_img_190b335d8-1772380147303.png", alt: 'Rustic Italian trattoria with checkered tablecloths, candles, and a plate of fresh pasta', rating: 4.6, reviews: 189, badge: null },
  { id: 5, name: 'Seoul Garden BBQ', cuisine: 'Korean BBQ', neighborhood: 'Koreatown', price: '$$$', signatureDish: 'Wagyu Galbi', hoursStatus: 'Open 24 hours', verified: true, image: "https://images.unsplash.com/photo-1708388466735-7cca71c7cc6b", alt: 'Korean BBQ grill table with sizzling marinated beef short ribs and banchan side dishes', rating: 4.9, reviews: 703, badge: 'Trending' },
  { id: 6, name: 'The Mezze Bar', cuisine: 'Mediterranean', neighborhood: 'West Hollywood', price: '$$', signatureDish: 'Lamb Kofta Platter', hoursStatus: 'Open until 11 PM', verified: true, image: "https://images.unsplash.com/photo-1589926198401-428510455631", alt: 'Mediterranean mezze spread with hummus, pita, olives, and grilled lamb kofta on a wooden board', rating: 4.7, reviews: 267, badge: null },
];

const neighborhoodCollections = [
  { id: 1, title: 'Koreatown After Dark', description: 'Late-night eats, BBQ spots, and karaoke-adjacent bites', count: 24, image: "https://images.unsplash.com/photo-1562884972-ea1e4ae7e848", alt: 'Vibrant Koreatown street at night with neon signs and people dining outdoors', tag: 'Neighborhood' },
  { id: 2, title: 'Date Night in Silver Lake', description: 'Candlelit tables, natural wine, and menus worth lingering over', count: 18, image: "https://img.rocket.new/generatedImages/rocket_gen_img_1076a5b80-1774103238331.png", alt: 'Romantic candlelit restaurant table in Silver Lake with wine glasses and soft lighting', tag: 'Craving' },
  { id: 3, title: 'Best Tacos Under $5', description: 'Street tacos, taco trucks, and hidden gems that deliver every time', count: 31, image: "https://images.unsplash.com/photo-1495477699204-df644ce447da", alt: 'Row of colorful street tacos with fresh cilantro, onion, and salsa on a paper plate', tag: 'Budget' },
  { id: 4, title: 'Sunday Brunch Spots', description: 'Bottomless mimosas, eggs benedict, and no-rush mornings', count: 22, image: "https://img.rocket.new/generatedImages/rocket_gen_img_18e76298e-1772493016483.png", alt: 'Bright Sunday brunch spread with eggs benedict, fresh fruit, and mimosas on a sunny patio', tag: 'Craving' },
  { id: 5, title: 'East LA Mariscos Trail', description: 'The freshest seafood in the city, from ceviche to aguachile', count: 15, image: "https://images.unsplash.com/photo-1640505388324-274724c2e35c", alt: 'Fresh ceviche and seafood tostadas at a colorful East LA mariscos restaurant', tag: 'Neighborhood' },
  { id: 6, title: 'Ramen & Noodle Crawl', description: 'Tonkotsu, shoyu, udon, and everything in between', count: 19, image: "https://images.unsplash.com/photo-1722239319483-d8bf42f6035b", alt: 'Multiple bowls of different ramen styles arranged on a table for a noodle crawl', tag: 'Craving' },
];

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-green">
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      Verified
    </span>
  );
}

export default function RestaurantsPageClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCuisine, setActiveCuisine] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [locationRequested, setLocationRequested] = useState(false);

  const handleUseLocation = () => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        () => setLocationRequested(true),
        () => setLocationRequested(false)
      );
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-16">

        {/* Search Hero */}
        <section className="relative overflow-hidden bg-foreground" aria-label="Restaurant search">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=60')`, backgroundSize: 'cover', backgroundPosition: 'center' }} aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/70 to-foreground/90" aria-hidden="true" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
            <p className="text-brand-orange font-semibold text-sm uppercase tracking-widest mb-4">Restaurant Discovery</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">Discover food worth<br className="hidden sm:block" /> leaving home for.</h1>
            <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10">Find restaurants, signature dishes, local favorites, creator recommendations, and the stories behind the people serving them.</p>
            <div className="relative max-w-2xl mx-auto mb-6">
              <div className="flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="pl-5 text-muted-foreground" aria-hidden="true">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e?.target?.value)} placeholder="Search restaurants, dishes, neighborhoods, or cuisines..." className="flex-1 px-4 py-4 text-foreground placeholder-muted-foreground bg-transparent outline-none text-sm md:text-base" aria-label="Search restaurants" />
                <button className="m-2 bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm whitespace-nowrap" aria-label="Search restaurants">Search Restaurants</button>
              </div>
            </div>
            <button onClick={handleUseLocation} className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors group" aria-label="Use my current location">
              <svg className="w-4 h-4 text-brand-orange group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {locationRequested ? 'Location detected ✓' : 'Use My Location'}
            </button>
          </div>
          {/* Cuisine filter chips */}
          <div className="relative border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
                {cuisineFilters?.map((cuisine) => (
                  <button key={cuisine} onClick={() => setActiveCuisine(cuisine)}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCuisine === cuisine ? 'bg-brand-orange text-white shadow-md' : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'}`}
                    aria-pressed={activeCuisine === cuisine}>
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* List/Map toggle */}
        <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground hidden sm:block">
              Showing <strong className="text-foreground">{featuredRestaurants?.length}</strong> restaurants
            </p>
            <div className="flex items-center gap-1 bg-muted rounded-xl p-1 ml-auto">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'list' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                aria-pressed={viewMode === 'list'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                List
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'map' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                aria-pressed={viewMode === 'map'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                Map
              </button>
            </div>
          </div>
        </div>

        {/* Map placeholder */}
        {viewMode === 'map' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-muted rounded-3xl h-96 flex flex-col items-center justify-center border border-border">
              <span className="text-4xl mb-4">🗺️</span>
              <h3 className="font-extrabold text-foreground text-xl mb-2">Map View</h3>
              <p className="text-muted-foreground text-sm text-center max-w-sm">Interactive map is coming soon. Use list view to browse restaurants for now.</p>
              <button onClick={() => setViewMode('list')} className="btn-primary mt-4 text-sm">Switch to List View</button>
            </div>
          </div>
        )}

        {/* Accuracy disclaimer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
            <span className="text-amber-500 text-sm shrink-0 mt-0.5">ℹ️</span>
            <p className="text-amber-800 text-xs leading-relaxed">Restaurant details, menus, prices, hours, and availability can change. Confirm directly with the restaurant before visiting or ordering.</p>
          </div>
        </div>

        {/* Restaurant grid */}
        {viewMode === 'list' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRestaurants?.map((restaurant) => (
                <Link key={restaurant?.id} href={`/restaurants/${restaurant?.id}`} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-card-hover transition-all duration-300 group block">
                  <div className="relative h-52 overflow-hidden">
                    <AppImage src={restaurant?.image} alt={restaurant?.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {restaurant?.badge && (
                      <span className="absolute top-3 left-3 bg-brand-orange text-white text-xs font-bold px-2 py-1 rounded-full">{restaurant?.badge}</span>
                    )}
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                      <svg className="w-3 h-3 text-amber-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      <span className="text-xs font-bold text-foreground">{restaurant?.rating}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-extrabold text-foreground group-hover:text-primary transition-colors">{restaurant?.name}</h3>
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">{restaurant?.price}</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-1">{restaurant?.cuisine} · {restaurant?.neighborhood}</p>
                    <p className="text-xs text-muted-foreground mb-3">Signature: <span className="font-medium text-foreground">{restaurant?.signatureDish}</span></p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-600 font-medium">{restaurant?.hoursStatus}</span>
                      {restaurant?.verified && <VerifiedBadge />}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Neighborhood Collections */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" aria-labelledby="collections-heading">
          <div className="flex items-center justify-between mb-6">
            <h2 id="collections-heading" className="text-2xl font-extrabold text-foreground">Browse by neighborhood & craving</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {neighborhoodCollections?.map((col) => (
              <div key={col?.id} className="relative rounded-2xl overflow-hidden h-40 group cursor-pointer">
                <AppImage src={col?.image} alt={col?.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-xs font-bold text-white/70 uppercase tracking-wide">{col?.tag}</span>
                  <h3 className="font-extrabold text-white text-sm leading-tight">{col?.title}</h3>
                  <p className="text-white/70 text-xs mt-0.5">{col?.count} places</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Become a Partner CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-foreground rounded-3xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Is your restaurant on Chew?</h2>
            <p className="text-white/70 mb-8 max-w-md mx-auto">Claim your profile, showcase your signature dishes, and connect with food creators and local food lovers.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/join?type=restaurant" className="btn-primary">Claim Your Restaurant</Link>
              <Link href="/contact?topic=restaurant" className="btn-secondary border-white/30 text-white hover:bg-white hover:text-foreground">Become a Restaurant Partner</Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
