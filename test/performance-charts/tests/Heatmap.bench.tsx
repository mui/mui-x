import * as React from 'react';
import { benchmark } from '@mui/internal-benchmark';
import { Heatmap, HeatmapValueType } from '@mui/x-charts-pro';

const dataLength = 100;
const xData = Array.from({ length: dataLength }).map((_, i) => `${i + 1}`);
const yData = Array.from({ length: dataLength }).map((_, i) => `${i + 1}`);

const data = xData.flatMap((_, i) =>
  yData.map(
    (__, j) => [i, j, Math.sin(((i + j) * Math.PI) / 16) * 100] satisfies HeatmapValueType,
  ),
);

// https://github.com/mui/mui-x/issues/18015#issuecomment-3665782200
benchmark('Heatmap: 100x100 grid', () => (
  <Heatmap
    xAxis={[{ data: xData }]}
    yAxis={[{ data: yData }]}
    series={[{ data }]}
    width={500}
    height={300}
  />
));
