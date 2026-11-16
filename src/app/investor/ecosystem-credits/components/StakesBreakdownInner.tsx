'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const data = [
  { id: 'bar-q1-2025', period: 'Q1 2025', stakes: 0, label: 'Pre-purchase' },
  { id: 'bar-may-2025', period: 'May 2025', stakes: 50000, label: 'Initial Purchase' },
  { id: 'bar-q3-2025', period: 'Q3 2025', stakes: 50000, label: 'Held' },
  { id: 'bar-q4-2025', period: 'Q4 2025', stakes: 50000, label: 'Held' },
  { id: 'bar-q1-2026', period: 'Q1 2026', stakes: 50000, label: 'Held' },
  { id: 'bar-q2-2026', period: 'Q2 2026', stakes: 50000, label: 'Held' },
  { id: 'bar-q3-2026', period: 'Q3 2026', stakes: 50000, label: 'Held' },
  { id: 'bar-aug-2026', period: 'Aug 2026', stakes: 50000, label: 'Current' },
];

export default function StakesBreakdownInner() {
  return (
    <div className="card-surface p-5">
      <h3 className="text-white font-semibold text-sm mb-4">Stake Holdings Over Time</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="period"
            tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v === 0 ? '0' : `${v / 1000}k`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload?.length) {
                return (
                  <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs text-white shadow-xl">
                    <p className="font-semibold mb-1">{label}</p>
                    <p className="text-primary">{Number(payload?.[0]?.value)?.toLocaleString()} Stakes</p>
                    <p className="text-muted-foreground">{payload?.[0]?.payload?.label}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="stakes" radius={[4, 4, 0, 0]}>
            {data?.map((entry, index) => (
              <Cell
                key={`bar-cell-${entry?.id}`}
                fill={entry?.label === 'Current' ? '#F97316' : entry?.stakes === 0 ? '#1F1F2E' : '#C05A10'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}