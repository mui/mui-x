import * as React from 'react';
import { RadialBarChart } from '@mui/x-charts-premium/RadialBarChart';

const healthData = [
  { metric: 'Water', value: 5, goal: 8, color: '#00bcd4' },
  { metric: 'Sleep', value: 6.5, goal: 8, color: '#3f51b5' },
  { metric: 'Calories', value: 540, goal: 700, color: '#ff9800' },
  { metric: 'Activity', value: 42, goal: 60, color: '#4caf50' },
  { metric: 'Steps', value: 8200, goal: 10000, color: '#e91e63' },
];

const dataset = healthData.map((d) => ({
  metric: d.metric,
  progress: Math.round((d.value / d.goal) * 100),
}));

const highlightScope = { highlight: 'item', fade: 'global' };

export default function HealthRadialBarChart() {
  return (
    <RadialBarChart
      height={400}
      dataset={dataset}
      series={[
        {
          dataKey: 'progress',
          layout: 'horizontal',
          label: 'Progress',
          highlightScope,
          valueFormatter: (value) => `${value}%`,
        },
      ]}
      radiusAxis={[
        {
          scaleType: 'band',
          dataKey: 'metric',
          categoryGapRatio: 0.3,
          disableLine: true,
          disableTicks: true,
          colorMap: {
            type: 'ordinal',
            values: healthData.map((d) => d.metric),
            colors: healthData.map((d) => d.color),
          },
        },
      ]}
      rotationAxis={[
        {
          scaleType: 'linear',
          min: 0,
          max: 100,
          valueFormatter: (value) => `${value}%`,
        },
      ]}
      grid={{ rotation: true }}
      hideLegend
      slotProps={{ tooltip: { trigger: 'none' } }}
    />
  );
}
