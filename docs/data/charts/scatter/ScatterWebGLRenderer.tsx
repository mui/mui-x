import * as React from 'react';
import { Chance } from 'chance';
import { ScatterChartPremium } from '@mui/x-charts-premium/ScatterChartPremium';

const POINTS_PER_SERIES = 200_000;
const chance = new Chance(42);

function generateSeries(offset: number, spread: number) {
  const data = new Array(POINTS_PER_SERIES);
  for (let i = 0; i < POINTS_PER_SERIES; i += 1) {
    const u1 = chance.floating({ min: 1e-6, max: 1 });
    const u2 = chance.floating({ min: 0, max: 1 });
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
  { label: 'Cluster A', data: generateSeries(0, 1), markerSize: 1 },
  { label: 'Cluster B', data: generateSeries(4, 1.5), markerSize: 1 },
];

export default function ScatterWebGLRenderer() {
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
