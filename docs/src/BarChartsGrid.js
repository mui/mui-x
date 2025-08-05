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
    link: '/x/react-charts/examples/simplebarchart/',
    ChartComponent: SimpleBarChart,
  },
  {
    title: 'Stacked Bar Chart',
    link: '/x/react-charts/examples/stackedbarchart/',
    ChartComponent: StackedBarChart,
  },
  {
    title: 'Mixed Bar Chart',
    link: '/x/react-charts/examples/mixedbarchart/',
    ChartComponent: MixedBarChart,
  },
  {
    title: 'Positive and Negative Bar Chart',
    link: '/x/react-charts/bar-demo/#positive-and-negative-bar-chart',
    ChartComponent: PositiveAndNegativeBarChart,
  },
  {
    title: 'Bar Chart Stacked by Sign',
    link: '/x/react-charts/bar-demo/#bar-chart-stacked-by-sign',
    ChartComponent: BarChartStackedBySign,
  },
  {
    title: 'Biaxial Bar Chart',
    link: '/x/react-charts/bar-demo/#biaxial-bar-chart',
    ChartComponent: BiaxialBarChart,
  },
  {
    title: 'Population Pyramid Bar Chart',
    link: '/x/react-charts/bar-demo/#population-pyramid',
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
          link={chart.link}
          ChartComponent={chart.ChartComponent}
        />
      ))}
    </Box>
  );
}
