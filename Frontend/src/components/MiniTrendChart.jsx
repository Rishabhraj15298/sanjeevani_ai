import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

export default function MiniTrendChart({ data }) {
  if (!data?.length) return null;
  const formatted = data.map((d, i) => ({
    day: d.day || `D${i+1}`,
    systolic: d.systolic,
    diastolic: d.diastolic
  }));
  return (
    <div style={{ width:'100%', height: 220 }}>
      <ResponsiveContainer>
        <LineChart data={formatted}>
          <CartesianGrid stroke="var(--line)" />
          <XAxis dataKey="day" stroke="var(--sub)" />
          <YAxis stroke="var(--sub)" />
          <Tooltip contentStyle={{ background:'var(--panel)', border:'1px solid var(--line)' }} />
          <Legend />
          <Line type="monotone" dataKey="systolic" stroke="var(--brand)" />
          <Line type="monotone" dataKey="diastolic" stroke="#60a5fa" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
