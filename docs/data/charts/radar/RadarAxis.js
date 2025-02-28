import * as React from 'react';
import { Unstable_RadarChart as RadarChart } from '@mui/x-charts/RadarChart';

export default function RadarAxis() {
  return (
    <RadarChart
      height={300}
      series={[{ label: 'Lisa', data: [120, 98, 86, 99, 85, 65] }]}
      radar={{
        metrics: [
          { name: 'Math', max: 120 },
          { name: 'Chinese', max: 120 },
          { name: 'English', max: 120 },
          { name: 'Geography', max: 120 },
          { name: 'Physics', max: 120 },
          { name: 'History', max: 120 },
        ],
      }}
    />
  );
}
