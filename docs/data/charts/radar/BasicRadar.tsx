import * as React from 'react';
import { Unstable_RadarChart as RadarChart } from '@mui/x-charts/RadarChart';

export default function BasicRadar() {
  return (
    <RadarChart
      height={300}
      series={[{ label: 'Lisa', data: [120, 98, 86, 99, 85, 65] }]}
      radar={{
        max: 120,
        metrics: ['Math', 'Chinese', 'English', 'Geography', 'Physics', 'History'],
      }}
    />
  );
}
