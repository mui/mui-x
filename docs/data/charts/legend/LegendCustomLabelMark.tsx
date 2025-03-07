import { BarChart } from '@mui/x-charts/BarChart';
import * as React from 'react';
import { ChartsLabelCustomMarkProps } from '@mui/x-charts/ChartsLabel';

function HTMLCircle({ className, color }: ChartsLabelCustomMarkProps) {
  return (
    <div className={className} style={{ borderRadius: '100%', background: color }} />
  );
}

function SVGDiamond({ className, color }: ChartsLabelCustomMarkProps) {
  return (
    <svg viewBox="-7.423 -7.423 14.846 14.846">
      <path
        className={className}
        d="M0,-7.423L4.285,0L0,7.423L-4.285,0Z"
        fill={color}
      />
    </svg>
  );
}

export default function LegendCustomLabelMark() {
  return (
    <BarChart
      series={[
        { id: 0, data: [10, 15], label: 'Series A', labelMarkType: HTMLCircle },
        { id: 1, data: [15, 20], label: 'Series B', labelMarkType: 'line' },
        { id: 2, data: [20, 25], label: 'Series C' },
        { id: 3, data: [10, 15], label: 'Series D', labelMarkType: SVGDiamond },
      ]}
      xAxis={[{ scaleType: 'band', data: ['Category 1', 'Category 2'] }]}
      height={200}
    />
  );
}
