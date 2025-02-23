import { BarChart } from '@mui/x-charts/BarChart';
import * as React from 'react';

const seriesConfig = [
  { id: 0, data: [10], label: 'Series A' },
  { id: 1, data: [15], label: 'Series B' },
  { id: 2, data: [20], label: 'Series C' },
  { id: 3, data: [10], label: 'Series D' },
];

const cross =
  'M-5.35,-1.783L-1.783,-1.783L-1.783,-5.35L1.783,-5.35L1.783,-1.783L5.35,-1.783L5.35,1.783L1.783,1.783L1.783,5.35L-1.783,5.35L-1.783,1.783L-5.35,1.783Z';
const diamond = 'M0,-7.423L4.285,0L0,7.423L-4.285,0Z';
const star =
  'M0,-7.528L1.69,-2.326L7.16,-2.326L2.735,0.889L4.425,6.09L0,2.875L-4.425,6.09L-2.735,0.889L-7.16,-2.326L-1.69,-2.326Z';
const wye =
  'M2.152,1.243L2.152,5.547L-2.152,5.547L-2.152,1.243L-5.88,-0.91L-3.728,-4.638L0,-2.485L3.728,-4.638L5.88,-0.91Z';
const symbols = [cross, diamond, star, wye];

function CustomLabelMark({ className, seriesId, color }) {
  const symbol = symbols[seriesId];
  return (
    <svg className={className} viewBox="-8 -8 16 16" width={14} height={14}>
      <path d={symbol} fill={color} />
    </svg>
  );
}

export default function LegendCustomLabelMark() {
  return (
    <BarChart
      series={seriesConfig}
      xAxis={[{ scaleType: 'band', data: ['A'] }]}
      height={200}
      slots={{ labelMark: CustomLabelMark }}
    />
  );
}
