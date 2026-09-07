import * as React from 'react';
import { ScatterChartPremium } from '@mui/x-charts-premium/ScatterChartPremium';

const POINTS_PER_SERIES = 200_000;

// Inline mulberry32 — deterministic, ~20x faster than `chance.floating`.
// 800k calls during module load with Chance takes several seconds and stalls
// the Next.js build; this runs in ~50ms.
/* eslint-disable no-bitwise */
function makeRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}
/* eslint-enable no-bitwise */

function generateSeries(offset: number, spread: number, seed: number) {
  const rand = makeRandom(seed);
  const data = new Array(POINTS_PER_SERIES);
  for (let i = 0; i < POINTS_PER_SERIES; i += 1) {
    const u1 = Math.max(rand(), 1e-6);
    const u2 = rand();
    const r = Math.sqrt(-2 * Math.log(u1));
    const theta = 2 * Math.PI * u2;
    data[i] = {
      id: i,
      x: offset + r * Math.cos(theta) * spread,
      y: offset + r * Math.sin(theta) * spread,
    };
  }
  return data;
}

const DATA_1 = generateSeries(0, 1, 42);
const DATA_2 = generateSeries(4, 1.5, 7);

export default function ScatterWebGLRenderer() {
  const series = React.useMemo(
    () => [
      { label: 'Cluster A', data: DATA_1, markerSize: 1 },
      { label: 'Cluster B', data: DATA_2, markerSize: 1 },
    ],
    [],
  );

  return (
    <ScatterChartPremium
      series={series}
      xAxis={[{ min: -6, max: 12, zoom: true }]}
      yAxis={[{ min: -6, max: 12, zoom: true }]}
      height={400}
      renderer="webgl"
      slotProps={{
        legend: {
          toggleVisibilityOnClick: true,
        },
      }}
    />
  );
}
