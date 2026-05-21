import * as React from 'react';
import { Unstable_RadialLineChart as RadialLineChart } from '@mui/x-charts-premium/RadialLineChart';
import { benchmark } from '@mui/internal-benchmark';

const dataLength = 360;
const labels = Array.from({ length: dataLength }, (_, i) => `${i}`);
const data = Array.from({ length: dataLength }, (_, i) => 50 + Math.sin(i / 10) * 25);

benchmark('RadialLineChart with big data amount', () => (
  <RadialLineChart
    series={[{ data, showMark: false }]}
    rotationAxis={[{ scaleType: 'point', data: labels, disableLine: true }]}
    radiusAxis={[{ disableLine: true }]}
    width={500}
    height={300}
    skipAnimation
  />
));
