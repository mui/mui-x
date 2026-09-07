import * as React from 'react';
import { benchmark } from '@mui/internal-benchmark';
import { HeatmapPremium } from '@mui/x-charts-premium/HeatmapPremium';
import { HeatmapValueType } from '@mui/x-charts-pro';
import { benchWebGLInteraction } from '../utils';

const dataLength = 100;
const xData = Array.from({ length: dataLength }).map((_, i) => `${i + 1}`);
const yData = Array.from({ length: dataLength }).map((_, i) => `${i + 1}`);

const data = xData.flatMap((_, i) =>
  yData.map((__, j) => [i, j, Math.sin(((i + j) * Math.PI) / 16) * 100] satisfies HeatmapValueType),
);

benchmark(
  'HeatmapPremium: 100x100 grid (webgl renderer)',
  () => (
    <HeatmapPremium
      xAxis={[{ data: xData }]}
      yAxis={[{ data: yData }]}
      series={[{ data }]}
      width={500}
      height={300}
      renderer="webgl"
    />
  ),
  benchWebGLInteraction,
);
