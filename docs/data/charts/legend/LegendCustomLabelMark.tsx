import { BarChart } from '@mui/x-charts/BarChart';
import * as React from 'react';
import { ChartsLabelMarkProps } from '@mui/x-charts/ChartsLabel';

const seriesConfig = [
  { id: 0, data: [10], label: 'Series A' },
  { id: 1, data: [15], label: 'Series B' },
  { id: 2, data: [20], label: 'Series C' },
  { id: 3, data: [10], label: 'Series D' },
];

function CustomLabelMark({ className, color }: ChartsLabelMarkProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" width={12} height={12}>
      <path
        d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"
        fill={color}
      />
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
