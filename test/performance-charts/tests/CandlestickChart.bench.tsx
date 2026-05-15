import * as React from 'react';
import { benchmark } from '@mui/internal-benchmark';
import { Unstable_CandlestickChart as CandlestickChart } from '@mui/x-charts-premium/CandlestickChart';

const dataLength = 2_000;
const xData = Array.from({ length: dataLength }).map((_, i) => `${i + 1}`);

// Walk a synthetic OHLC series: [open, high, low, close].
let prevClose = 100;
const data = Array.from({ length: dataLength }).map((_, i) => {
  const open = prevClose;
  const close = open + Math.sin(i / 7) * 2 + (i % 3 === 0 ? 1 : -1);
  const high = Math.max(open, close) + 1.5;
  const low = Math.min(open, close) - 1.5;
  prevClose = close;
  return [open, high, low, close] satisfies [number, number, number, number];
});

// Lets the ChartsWebGLLayer ResizeObserver + canvas init settle deterministically
// before the harness samples renders. Without this, iterations race and produce
// different render-event counts.
const waitForWebGLToSettle = () => new Promise<void>((r) => setTimeout(r, 100));

benchmark(
  'CandlestickChart with big data amount (webgl renderer)',
  () => (
    <CandlestickChart xAxis={[{ data: xData }]} series={[{ data }]} width={500} height={300} />
  ),
  waitForWebGLToSettle,
);
