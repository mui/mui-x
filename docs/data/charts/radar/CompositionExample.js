import * as React from 'react';
import Stack from '@mui/material/Stack';
import {
  Unstable_RadarDataProvider as RadarDataProvider,
  RadarGrid,
  RadarSeriesMarks,
  RadarSeriesArea,
  RadarMetricLabels,
  RadarAxisHighlight,
} from '@mui/x-charts/RadarChart';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';

export default function CompositionExample() {
  return (
    <RadarDataProvider height={300} series={series} radar={radar} margin={margin}>
      <Stack direction="column" alignItems="center" gap={1} sx={{ width: '100%' }}>
        <ChartsLegend />
        <ChartsSurface>
          <RadarGrid divisions={5} />
          <RadarSeriesArea
            fillOpacity={0.4}
            strokeWidth={1}
            seriesId="australia-id"
          />
          <RadarSeriesArea
            fill="transparent"
            strokeWidth={1}
            seriesId="usa-id"
            strokeDasharray="4, 4"
            strokeLinecap="round"
          />
          <RadarSeriesMarks />
          <RadarMetricLabels />
          <RadarAxisHighlight />
        </ChartsSurface>
      </Stack>
    </RadarDataProvider>
  );
}

// Data from https://ourworldindata.org/emissions-by-fuel
const series = [
  {
    id: 'usa-id',
    label: 'USA',
    data: [6.65, 2.76, 5.15, 0.19, 0.07, 0.12],
    fillArea: true,
  },
  {
    id: 'australia-id',
    label: 'Australia',
    data: [5.52, 5.5, 3.19, 0.51, 0.15, 0.11],
    fillArea: true,
  },
];

const radar = {
  metrics: ['Oil', 'Coal', 'Gas', 'Flaring', 'Other\nindustry', 'Cement'],
};
const margin = { left: 50, right: 50 };
