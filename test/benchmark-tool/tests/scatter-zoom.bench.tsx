import * as React from 'react';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import { benchmark } from '../utils/benchmark';

const dataLength = 1_400;
const data = Array.from({ length: dataLength }).map((_, i) => ({
  x: i,
  y: 50 + Math.sin(i / 5) * 25,
}));

const xData = data.map((d) => d.x);

benchmark(
  'scatter zoom',
  <ScatterChartPro
    xAxis={[{ data: xData, valueFormatter: (v: number) => v.toLocaleString('en-US'), zoom: true }]}
    yAxis={[{ zoom: true }]}
    series={[{ data }]}
    width={500}
    height={300}
  />,
  async () => {
    // Simulate zoom interaction via wheel events on the SVG
    const svg = document.querySelector('svg:not([aria-hidden="true"])');
    if (!svg) {
      return;
    }

    const rect = svg.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaY = -1000; // Negative for zooming in
    const steps = 20;

    for (let i = 0; i < steps; i += 1) {
      svg.dispatchEvent(
        new WheelEvent('wheel', {
          deltaY: deltaY / steps,
          clientX: centerX,
          clientY: centerY,
          bubbles: true,
        }),
      );
      // Small delay between wheel events to allow React to process
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => {
        requestAnimationFrame(resolve);
      });
    }
  },
);
