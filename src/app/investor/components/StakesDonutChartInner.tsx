'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Your Ownership', value: 0.0003125 },
  { name: 'Other', value: 99.9996875 },
];

const COLORS = ['#F97316', '#1F1F2E'];

export default function StakesDonutChartInner() {
  return (
    <div className="relative w-[180px] h-[180px] flex-shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={62}
            outerRadius={86}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            strokeWidth={0}
          >
            {data?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload?.length) {
                return (
                  <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs text-white shadow-xl">
                    <p className="font-semibold">{payload?.[0]?.name}</p>
                    <p className="text-primary">{Number(payload?.[0]?.value)?.toFixed(7)}%</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
        <p className="text-white text-xs font-medium leading-tight">You own</p>
        <p className="text-primary text-sm font-bold font-tabular leading-tight">0.0003125%</p>
        <p className="text-muted-foreground text-[10px] leading-tight">of Chew Network</p>
      </div>
    </div>
  );
}