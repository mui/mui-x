import * as React from 'react';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { type BarSampling, type DataSampler } from '@mui/x-charts-pro/models';

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
const data = Array.from(
  { length: COUNT },
  (_, i) => Math.round((Math.sin(i / 9) * 50 + (rng() - 0.5) * 30) * 100) / 100,
);
const yData = Array.from({ length: COUNT }, (_, i) => i);

const minMax: DataSampler = ({ length, target, getValue }) => {
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

const variants: { label: string; sampling: BarSampling | undefined }[] = [
  { label: 'none', sampling: undefined },
  { label: 'bucket', sampling: 'bucket' },
  { label: 'min-max (custom)', sampling: minMax },
];

export default function SamplingBarHorizontal() {
  return (
    <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(2, 1fr)' }}>
      {variants.map((variant) => (
        <div key={variant.label}>
          <div style={{ font: '12px sans-serif' }}>{variant.label}</div>
          <BarChartPro
            width={220}
            height={260}
            skipAnimation
            yAxis={[{ data: yData, tickSpacing: 40 }]}
            series={[{ data, layout: 'horizontal', sampling: variant.sampling }]}
          />
        </div>
      ))}
    </div>
  );
}
