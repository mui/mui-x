import * as React from 'react';
import Box from '@mui/material/Box';

import { ChartThumbnailCard } from './ChartExampleThumbnailGrid';
import SimpleAreaChart from '../data/charts/areas-demo/SimpleAreaChart';
import StackedAreaChart from '../data/charts/areas-demo/StackedAreaChart';
import PercentAreaChart from '../data/charts/areas-demo/PercentAreaChart';
import AreaChartConnectNulls from '../data/charts/areas-demo/AreaChartConnectNulls';

const chartData = [
  {
    title: 'Simple Area Chart',
    link: '/x/react-charts/areas-demo/#simple-area-chart',
    ChartComponent: SimpleAreaChart,
  },
  {
    title: 'Stacked Area Chart',
    link: '/x/react-charts/areas-demo/#stacked-area-chart',
    ChartComponent: StackedAreaChart,
  },
  {
    title: 'Percent Area Chart',
    link: '/x/react-charts/areas-demo/#percent-area-chart',
    ChartComponent: PercentAreaChart,
  },
  {
    title: 'Area Chart Connect Nulls',
    link: '/x/react-charts/areas-demo/#area-chart-connect-nulls',
    ChartComponent: AreaChartConnectNulls,
  },
];

export default function AreaChartsGrid() {
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
