import * as React from 'react';
import { ScatterChartPremium } from '@mui/x-charts-premium/ScatterChartPremium';

const POINTS_PER_SERIES = 50_000;

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

const series = [
  { label: 'A', data: generateSeries(0, 1, 42), markerSize: 2 },
  { label: 'B', data: generateSeries(4, 1.5, 7), markerSize: 2 },
];

export default function ScatterWebGLRenderer() {
  return (
    <ScatterChartPremium
      series={series}
      xAxis={[{ min: -6, max: 12 }]}
      yAxis={[{ min: -6, max: 12 }]}
      height={300}
      width={400}
      renderer="webgl"
    />
  );
}
