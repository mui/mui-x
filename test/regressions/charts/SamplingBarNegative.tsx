import * as React from 'react';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { type BarSampling } from '@mui/x-charts/models';

// Deterministic data so the screenshots are stable.
function createRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 0x100000000;
    return state / 0x100000000;
  };
}

const COUNT = 400;
const rng = createRandom(23);
// All-negative values, and values that cross zero, to check sign handling (the `'bucket'` method
// keeps the largest-absolute-value bar, and bars are drawn from the zero baseline).
const negative = Array.from(
  { length: COUNT },
  (_, i) => -Math.abs(Math.sin(i / 9) * 50 + (rng() - 0.5) * 30) - 5,
);
const mixed = Array.from({ length: COUNT }, (_, i) => Math.sin(i / 9) * 50 + (rng() - 0.5) * 30);
const xData = Array.from({ length: COUNT }, (_, i) => i);

const variants: { label: string; data: number[]; sampling: BarSampling | undefined }[] = [
  { label: 'negative · none', data: negative, sampling: undefined },
  { label: 'negative · bucket', data: negative, sampling: 'bucket' },
  { label: 'mixed · none', data: mixed, sampling: undefined },
  { label: 'mixed · bucket', data: mixed, sampling: 'bucket' },
];

export default function SamplingBarNegative() {
  return (
    <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(2, 1fr)' }}>
      {variants.map((variant) => (
        <div key={variant.label}>
          <div style={{ font: '12px sans-serif' }}>{variant.label}</div>
          <BarChartPro
            width={320}
            height={180}
            skipAnimation
            xAxis={[{ data: xData }]}
            series={[{ data: variant.data, sampling: variant.sampling }]}
          />
        </div>
      ))}
    </div>
  );
}
