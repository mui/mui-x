import * as React from 'react';
import Box from '@mui/material/Box';

import { ChartThumbnailCard } from './ChartExampleThumbnailGrid';
import SimpleScatterChart from '../data/charts/scatter-demo/SimpleScatterChart';
import MultipleYAxesScatterChart from '../data/charts/scatter-demo/MultipleYAxesScatterChart';

const chartData = [
  {
    title: 'Simple Scatter Chart',
    ChartComponent: SimpleScatterChart,
  },
  {
    title: 'Multiple Y Axes Scatter Chart',
    ChartComponent: MultipleYAxesScatterChart,
  },
];

export default function ScatterChartsGrid() {
  return (
    <Box
      sx={{
        width: '100%',
        mb: 5,
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: '1fr 1fr',
        },
        gap: 3,
      }}
    >
      {chartData.map((chart) => (
        <ChartThumbnailCard
          key={chart.title}
          title={chart.title}
          // link={chart.link}
          ChartComponent={chart.ChartComponent}
        />
      ))}
    </Box>
  );
}
