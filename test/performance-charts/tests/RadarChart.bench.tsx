import * as React from 'react';
import { benchmark } from '@mui/internal-benchmark';
import { RadarChart } from '@mui/x-charts/RadarChart';

const metricCount = 24;
const seriesCount = 5;

const metrics = Array.from({ length: metricCount }, (_, i) => `M${i + 1}`);
const series = Array.from({ length: seriesCount }, (_, s) => ({
  label: `Series ${s + 1}`,
  data: Array.from({ length: metricCount }, (__, i) => 50 + Math.sin((i + s) / 3) * 25),
}));

benchmark('RadarChart with many axes and multiple series', () => (
  <RadarChart series={series} radar={{ metrics }} width={500} height={300} skipAnimation />
));
