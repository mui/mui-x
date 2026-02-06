'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';

// Disable SSR to avoid hydration mismatch caused by floating-point precision
// differences between Node.js and the browser (e.g., Math.sin() results differ
// at the last decimal places). This is fine for benchmarking since we're
// measuring client-side rendering performance.
const ScatterChartPro = dynamic(
  () => import('@mui/x-charts-pro/ScatterChartPro').then((mod) => mod.ScatterChartPro),
  { ssr: false },
);

const dataLength = 1_400;
const data = Array.from({ length: dataLength }).map((_, i) => ({
  x: i,
  y: 50 + Math.sin(i / 5) * 25,
}));

const xData = data.map((d) => d.x);

export default function ScatterBenchPage() {
  return (
    <ScatterChartPro
      xAxis={[
        { data: xData, valueFormatter: (v: number) => v.toLocaleString('en-US'), zoom: true },
      ]}
      yAxis={[{ zoom: true }]}
      series={[{ data }]}
      width={500}
      height={300}
    />
  );
}
