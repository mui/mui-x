import * as React from 'react';
import { RadarChart } from '@mui/x-charts/RadarChart';

export default function RadarAxis() {
  return (
    <RadarChart
      height={300}
      series={[{ label: 'Lisa', data: [120, 98, 86, 99, 85, 65] }]}
      radar={{
        metrics: [
          { name: 'Math', max: 200 },
          { name: 'Chinese', max: 200 },
          { name: 'English', max: 200 },
          { name: 'Geography', max: 200 },
          { name: 'Physics', max: 200 },
          { name: 'History', max: 200 },
        ],
      }}
    />
  );
}
