import * as React from 'react';
import { RadarChart } from '@mui/x-charts/RadarChart';

export default function DemoRadar() {
  return (
    <RadarChart
      height={500}
      width={500}
      series={[
        { type: 'radar', data: [35, 44, 24, 34, 83], color: 'green' },
        { type: 'radar', data: [56, 34, 97, 15, 26], color: 'blue' },
      ]}
      radar={{
        metrics: ['A', 'B', 'C', 'D', 'E'],
      }}
    />
  );
}
