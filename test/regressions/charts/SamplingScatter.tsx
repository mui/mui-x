import * as React from 'react';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import { type DataSampler, type ScatterSampling } from '@mui/x-charts-pro/models';

// Deterministic data so the screenshots are stable.
function createRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 0x100000000;
    return state / 0x100000000;
  };
}

const COUNT = 1500;
const rng = createRandom(5);
const clusters = [
  { cx: 30, cy: 30 },
  { cx: 70, cy: 60 },
  { cx: 50, cy: 80 },
];
const data = Array.from({ length: COUNT }, (_, i) => {
  const cluster = clusters[i % clusters.length];
  return {
    x: cluster.cx + (rng() - 0.5) * 30,
    y: cluster.cy + (rng() - 0.5) * 30,
    id: i,
  };
});

const minMax: DataSampler = ({ length, target, getValue }) => {
  const bucketCount = Math.max(1, Math.floor(target / 2));
  const bucketSize = length / bucketCount;
  const indices = new Set<number>([0]);
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
    indices.add(Math.min(min, max)).add(Math.max(min, max));
  }
  indices.add(length - 1);
  return [...indices];
};

const variants: { label: string; sampling: ScatterSampling | undefined }[] = [
  { label: 'none', sampling: undefined },
  { label: 'bucket', sampling: 'bucket' },
  { label: 'min-max (custom)', sampling: minMax },
];

export default function SamplingScatter() {
  return (
    <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(2, 1fr)' }}>
      {variants.map((variant) => (
        <div key={variant.label}>
          <div style={{ font: '12px sans-serif' }}>{variant.label}</div>
          <ScatterChartPro
            width={320}
            height={180}
            skipAnimation
            series={[{ data, sampling: variant.sampling }]}
          />
        </div>
      ))}
    </div>
  );
}
