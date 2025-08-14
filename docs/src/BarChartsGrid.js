import * as React from 'react';
import Box from '@mui/material/Box';

import { ChartThumbnailCard } from './ChartExampleThumbnailGrid';
import SimpleBarChart from '../data/charts/bar-demo/SimpleBarChart';
import StackedBarChart from '../data/charts/bar-demo/StackedBarChart';
import MixedBarChart from '../data/charts/bar-demo/MixedBarChart';
import PositiveAndNegativeBarChart from '../data/charts/bar-demo/PositiveAndNegativeBarChart';
import BarChartStackedBySign from '../data/charts/bar-demo/BarChartStackedBySign';
import BiaxialBarChart from '../data/charts/bar-demo/BiaxialBarChart';
import PopulationPyramidBarChart from '../data/charts/bar-demo/PopulationPyramidBarChart';

const chartData = [
  {
    title: 'Simple Bar Chart',
    ChartComponent: SimpleBarChart,
  },
  {
    title: 'Stacked Bar Chart',
    ChartComponent: StackedBarChart,
  },
  {
    title: 'Mixed Bar Chart',
    ChartComponent: MixedBarChart,
  },
  {
    title: 'Positive and Negative Bar Chart',
    ChartComponent: PositiveAndNegativeBarChart,
  },
  {
    title: 'Bar Chart Stacked by Sign',
    ChartComponent: BarChartStackedBySign,
  },
  {
    title: 'Biaxial Bar Chart',
    ChartComponent: BiaxialBarChart,
  },
  {
    title: 'Population Pyramid Bar Chart',
    ChartComponent: PopulationPyramidBarChart,
  },
];

export default function BarChartsGrid() {
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
