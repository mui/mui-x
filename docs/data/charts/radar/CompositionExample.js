import * as React from 'react';
import {
  Unstable_RadarDataProvider as RadarDataProvider,
  RadarGrid,
  RadarSeriesArea,
  RadarSeriesMarks,
} from '@mui/x-charts/RadarChart';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';

export default function CompositionExample() {
  return (
    <RadarDataProvider
      height={300}
      series={[
        {
          id: 'usa-id',
          label: 'USA',
          data: [6.65, 2.76, 5.15, 0.19, 0.07, 0.12],
        },
        {
          id: 'australia-id',
          label: 'Australia',
          data: [5.52, 5.5, 3.19, 0.51, 0.15, 0.11],
        },
      ]}
      radar={{
        metrics: ['Oil', 'Coal', 'Gas', 'Flaring', 'Other industry', 'Cement'],
      }}
    >
      <ChartsSurface>
        <RadarGrid divisionNumber={3} />
        <RadarSeriesArea />
        <RadarSeriesMarks seriesId="usa-id" />
      </ChartsSurface>
    </RadarDataProvider>
  );
}
