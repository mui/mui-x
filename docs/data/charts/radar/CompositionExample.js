import * as React from 'react';
import {
  Unstable_RadarDataProvider as RadarDataProvider,
  RadarGrid,
} from '@mui/x-charts/RadarChart';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';

export default function CompositionExample() {
  return (
    <RadarDataProvider
      height={300}
      series={[{ label: 'Lisa', data: [120, 98, 86, 99, 85, 65] }]}
      radar={{
        max: 120,
        metrics: ['Math', 'Chinese', 'English', 'Geography', 'Physics', 'History'],
      }}
    >
      <ChartsSurface disableAxisListener>
        <RadarGrid divisionNumber={3} />
      </ChartsSurface>
    </RadarDataProvider>
  );
}
