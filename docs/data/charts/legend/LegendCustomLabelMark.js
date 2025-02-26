import { BarChart } from '@mui/x-charts/BarChart';
import * as React from 'react';

function HTMLCircle({ color, ...props }) {
  return <div {...props} style={{ borderRadius: '100%', background: color }} />;
}

function SVGDiamond({ color, ...props }) {
  return (
    <svg viewBox="-7.423 -7.423 14.846 14.846">
      <path {...props} d="M0,-7.423L4.285,0L0,7.423L-4.285,0Z" fill={color} />
    </svg>
  );
}

export default function LegendCustomLabelMark() {
  return (
    <BarChart
      series={[
        { id: 0, data: [10], label: 'Series A', labelMarkType: HTMLCircle },
        { id: 1, data: [15], label: 'Series B', labelMarkType: 'line' },
        { id: 2, data: [20], label: 'Series C' },
        { id: 3, data: [10], label: 'Series D', labelMarkType: SVGDiamond },
      ]}
      xAxis={[{ scaleType: 'band', data: ['Category'] }]}
      height={200}
    />
  );
}
