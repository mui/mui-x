import * as React from 'react';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { type ChartSampler, type LineSampling } from '@mui/x-charts/models';

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
const data: number[] = [];
let value = 100;
for (let i = 0; i < COUNT; i += 1) {
  value += (rng() - 0.5) * 10;
  if (i % 97 === 0) {
    value += rng() > 0.5 ? 60 : -60;
  }
  data.push(Math.round(value * 100) / 100);
}
const xData = Array.from({ length: COUNT }, (_, i) => i);

const minMax: ChartSampler = ({ length, target, getValue }) => {
  const bucketCount = Math.max(1, Math.floor(target / 2));
  const bucketSize = length / bucketCount;
  const indices: number[] = [0, length - 1];
  for (let bucket = 0; bucket < bucketCount; bucket += 1) {
    const start = Math.floor(bucket * bucketSize);
    const end = Math.min(length, Math.floor((bucket + 1) * bucketSize));
    let min = start;
    let max = start;
    for (let i = start; i < end; i += 1) {
      if (getValue(i) < getValue(min)) {
        min = i;
      }
      if (getValue(i) > getValue(max)) {
        max = i;
      }
    }
    indices.push(min, max);
  }
  return indices;
};

const variants: { label: string; sampling: LineSampling | undefined }[] = [
  { label: 'none', sampling: undefined },
  { label: 'lttb', sampling: 'lttb' },
  { label: 'm4', sampling: 'm4' },
  { label: 'min-max (custom)', sampling: minMax },
];

export default function SamplingLine() {
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
            series={[{ data, sampling: variant.sampling, showMark: false }]}
          />
        </div>
      ))}
    </div>
  );
}
