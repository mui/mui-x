import * as React from 'react';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { type LineSampling } from '@mui/x-charts/models';

// Deterministic data so the screenshots are stable.
function createRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 0x100000000;
    return state / 0x100000000;
  };
}

const COUNT = 1000;
const rng = createRandom(11);
// An all-negative random walk and one that crosses zero, to check that sampling preserves the
// shape and extent of negative data.
const negative: number[] = [];
const mixed: number[] = [];
let negValue = -20;
let mixValue = 0;
for (let i = 0; i < COUNT; i += 1) {
  negValue = Math.min(-1, negValue + (rng() - 0.5) * 10);
  mixValue += (rng() - 0.5) * 12;
  negative.push(Math.round(negValue * 100) / 100);
  mixed.push(Math.round(mixValue * 100) / 100);
}
const xData = Array.from({ length: COUNT }, (_, i) => i);

const variants: { label: string; data: number[]; sampling: LineSampling | undefined }[] = [
  { label: 'negative · none', data: negative, sampling: undefined },
  { label: 'negative · lttb', data: negative, sampling: 'lttb' },
  { label: 'mixed · none', data: mixed, sampling: undefined },
  { label: 'mixed · lttb', data: mixed, sampling: 'lttb' },
];

export default function SamplingLineNegative() {
  return (
    <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(2, 1fr)' }}>
      {variants.map((variant) => (
        <div key={variant.label}>
          <div style={{ font: '12px sans-serif' }}>{variant.label}</div>
          <LineChartPro
            width={320}
            height={180}
            skipAnimation
            xAxis={[{ data: xData }]}
            series={[{ data: variant.data, sampling: variant.sampling, showMark: false }]}
          />
        </div>
      ))}
    </div>
  );
}
