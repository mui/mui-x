import * as React from 'react';
import { RadialBarChart } from '@mui/x-charts-premium/RadialBarChart';
import { benchmark } from '@mui/internal-benchmark';

const categoryCount = 60;
const seriesCount = 5;

const categories = Array.from({ length: categoryCount }, (_, i) => `C${i + 1}`);
const series = Array.from({ length: seriesCount }, (_, s) => ({
  data: Array.from({ length: categoryCount }, (__, i) => 10 + Math.sin((i + s) / 5) * 10),
  stack: 'total',
}));

benchmark('RadialBarChart stacked with multiple series', () => (
  <RadialBarChart
    series={series}
    rotationAxis={[{ scaleType: 'band', data: categories }]}
    radiusAxis={[{ scaleType: 'linear', minRadius: 20 }]}
    width={500}
    height={300}
    skipAnimation
  />
));
