import React from 'react';
import {
  UserCircleIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';

export default function OwnershipJourney() {
  return (
    <div className="card-surface p-5">
      <h2 className="text-white font-semibold text-base mb-6">Your Ownership Journey</h2>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Timeline */}
        <div className="flex-1">
          <div className="flex items-start gap-0 relative">
            {/* Line connecting steps */}
            <div className="absolute top-7 left-[calc(16.67%)] right-[calc(16.67%)] h-0.5 hidden sm:block" style={{ background: 'linear-gradient(90deg, #F97316 50%, #2A2A2A 50%)' }} />

            {/* Step 1 */}
            <div className="flex-1 flex flex-col items-center text-center px-2 z-10">
              <div className="w-14 h-14 rounded-full bg-muted border-2 border-primary flex items-center justify-center mb-3">
                <UserCircleIcon className="w-7 h-7 text-primary" />
              </div>
              <p className="text-primary text-xs font-bold tracking-widest mb-1">ROUND 1</p>
              <p className="text-muted-foreground text-xs leading-relaxed">You invested early and became a Founding Owner.</p>
            </div>

            {/* Step 2 — current */}
            <div className="flex-1 flex flex-col items-center text-center px-2 z-10">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mb-3 shadow-lg shadow-primary/30">
                <span className="text-2xl">🧑‍🍳</span>
              </div>
              <p className="text-white text-xs font-bold tracking-widest mb-1">CHEW GROWTH MILESTONES</p>
              <p className="text-muted-foreground text-xs leading-relaxed">See It. Cook It. • Chef Pepe • Users • Creators • Restaurants • Commerce</p>
            </div>

            {/* Step 3 */}
            <div className="flex-1 flex flex-col items-center text-center px-2 z-10">
              <div className="w-14 h-14 rounded-full bg-muted border-2 border-border flex items-center justify-center mb-3">
                <CalendarDaysIcon className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-xs font-bold tracking-widest mb-1">2027 — PHASE 2</p>
              <p className="text-muted-foreground text-xs leading-relaxed">Future opportunities for liquidity &amp; ecosystem growth.</p>
            </div>
          </div>
        </div>

        {/* Right status */}
        <div className="flex-shrink-0 min-w-[200px] space-y-4">
          <div>
            <p className="text-muted-foreground text-xs mb-1.5">Future Transaction Status</p>
            <span className="badge-gray">NOT YET OPEN</span>
          </div>
          <div>
            <p className="text-muted-foreground text-xs mb-1">Eligible Stakes</p>
            <p className="text-white text-sm font-medium leading-snug">To Be Determined Under Offering Documents</p>
          </div>
        </div>
      </div>
    </div>
  );
}