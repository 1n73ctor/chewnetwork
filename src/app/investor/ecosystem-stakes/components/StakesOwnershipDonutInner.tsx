'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Your Stakes', value: 50000 },
  { name: 'Available Pool', value: 16000000000 - 50000 },
];

const COLORS = ['#F97316', '#1F1F2E'];

export default function StakesOwnershipDonutInner() {
  return (
    <div className="card-surface p-5 h-full">
      <h3 className="text-white font-semibold text-sm mb-2">Ownership Position</h3>
      <p className="text-muted-foreground text-xs mb-4">Your 50,000 stakes vs total ecosystem pool</p>
      <div className="relative h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={0}
            >
              {data?.map((entry, index) => (
                <Cell key={`ownership-cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload?.length) {
                  return (
                    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs text-white shadow-xl">
                      <p className="font-semibold">{payload?.[0]?.name}</p>
                      <p className="text-primary">{Number(payload?.[0]?.value)?.toLocaleString()}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-white text-base font-bold font-tabular">50,000</p>
          <p className="text-muted-foreground text-[10px]">your stakes</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">Your Stakes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-muted" />
          <span className="text-xs text-muted-foreground">Remaining Pool</span>
        </div>
      </div>
    </div>
  );
}