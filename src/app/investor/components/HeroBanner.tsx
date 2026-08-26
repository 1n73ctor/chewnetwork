'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AppImage from '@/components/ui/AppImage';

/**
 * Drop the Chef Pepe render in at /public/assets/images/chef-pepe.png and this
 * picks it up. Until it exists, the mascot slot falls back to the emblem below
 * rather than a broken image.
 */
const CHEF_PEPE_IMAGE = '/assets/images/chef-pepe.png';
const HAS_CHEF_PEPE_RENDER = false;

const KITCHEN_BACKDROP = 'https://images.unsplash.com/photo-1632808664408-f8ab196b0523';
const APP_PREVIEW = 'https://images.unsplash.com/photo-1663000806840-8e16dc41e7d7';

export default function HeroBanner() {
  const { investorProfile, loading } = useAuth();
  const firstName = investorProfile?.firstName || 'Investor';

  return (
    <section
      className="hero-banner relative isolate overflow-hidden rounded-2xl border border-white/10 min-h-[200px] lg:min-h-[232px]"
      aria-label="Welcome"
    >
      {/* Backdrop: a warm kitchen scene, pushed right so it sits behind the
          mascot and phone while the welcome text keeps a clean dark ground. */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-y-0 right-0 w-full sm:w-[78%]">
          <AppImage
            src={KITCHEN_BACKDROP}
            alt=""
            fill
            priority
            sizes="100vw"
            className="opacity-[0.28]"
            style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          />
        </div>
        {/* Darkening ramp left-to-right keeps the headline legible over photo. */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D1B] via-[#0D0D1B]/85 to-[#0D0D1B]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D1B] via-transparent to-transparent" />
        {/* Warm glow behind the mascot. */}
        <div
          className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-2xl"
          style={{ background: 'radial-gradient(circle, #F97316 0%, transparent 65%)' }}
        />
      </div>

      <div className="relative flex items-stretch gap-4 px-5 py-6 sm:px-7">
        {/* Left — welcome */}
        <div className="z-10 flex min-w-0 flex-col justify-center sm:min-w-[230px]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/90">
            Welcome back
          </p>
          <h1 className="mt-1.5 truncate text-4xl font-extrabold leading-none tracking-tight text-white lg:text-5xl">
            {loading ? <span className="opacity-40">&hellip;</span> : firstName}
          </h1>
          <p className="mt-2 flex items-center gap-2 text-sm font-medium text-white/70">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            Founding Owner &amp; Investor
          </p>
          <p className="mt-3 border-l-2 border-primary/60 pl-3 text-sm font-semibold italic text-primary">
            &ldquo;See It. Cook It. Own the Future.&rdquo;
          </p>
        </div>

        {/* Center — Chef Pepe */}
        <div className="relative hidden flex-1 items-end justify-center md:flex">
          {HAS_CHEF_PEPE_RENDER ? (
            <div className="relative h-[220px] w-[240px] -mb-6">
              <AppImage
                src={CHEF_PEPE_IMAGE}
                alt="Chef Pepe, the Chew Network mascot"
                fill
                priority
                sizes="240px"
                style={{ objectFit: 'contain', objectPosition: 'bottom' }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pb-1">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-primary/30 bg-gradient-to-b from-white/10 to-transparent shadow-2xl backdrop-blur-sm">
                <span className="text-5xl leading-none" role="img" aria-label="Chef Pepe">
                  👨‍🍳
                </span>
              </div>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
                Chef Pepe
              </p>
            </div>
          )}
        </div>

        {/* Right — promise + app preview */}
        <div className="z-10 hidden max-w-[330px] items-center justify-end gap-5 lg:flex">
          <div className="text-right">
            <p className="text-xl font-bold leading-snug text-white">
              We&apos;re building the
              <br />
              future of food.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              Technology. Community.
              <br />
              Creators. Commerce.
            </p>
            <p className="mt-1.5 text-sm font-semibold text-primary">
              All in one delicious ecosystem.
            </p>
          </div>

          {/* Phone mockup */}
          <div className="relative h-[168px] w-[92px] flex-shrink-0 rounded-[1.25rem] border-[3px] border-white/15 bg-black shadow-2xl ring-1 ring-black/40">
            <div className="absolute inset-0 overflow-hidden rounded-[1rem]">
              <AppImage
                src={APP_PREVIEW}
                alt="The Chew Network app previewing a recipe"
                fill
                sizes="92px"
                className="opacity-70"
                style={{ objectFit: 'cover' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/25" />
              <div className="absolute inset-x-0 top-3 text-center">
                <p className="text-[7px] font-extrabold uppercase tracking-[0.16em] text-primary">
                  Chew Network
                </p>
              </div>
              <div className="absolute inset-x-0 bottom-3 text-center">
                <p className="text-[10px] font-extrabold leading-tight text-white">See It.</p>
                <p className="text-[10px] font-extrabold leading-tight text-white">Cook It.</p>
              </div>
            </div>
            {/* Notch */}
            <div
              className="absolute left-1/2 top-0 h-[6px] w-8 -translate-x-1/2 rounded-b-md bg-black"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
