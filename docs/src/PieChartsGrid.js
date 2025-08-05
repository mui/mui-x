import * as React from 'react';
import Box from '@mui/material/Box';

import { ChartThumbnailCard } from './ChartExampleThumbnailGrid';
import TwoLevelPieChart from '../data/charts/pie-demo/TwoLevelPieChart';
import StraightAnglePieChart from '../data/charts/pie-demo/StraightAnglePieChart';
import PieChartWithCustomizedLabel from '../data/charts/pie-demo/PieChartWithCustomizedLabel';
import PieChartWithCenterLabel from '../data/charts/pie-demo/PieChartWithCenterLabel';
import PieChartWithPaddingAngle from '../data/charts/pie-demo/PieChartWithPaddingAngle';
import PieChartWithCustomLegendAndTooltip from '../data/charts/pie-demo/PieChartWithCustomLegendAndTooltip';

const chartData = [
  {
    title: 'Two Level Pie Chart',
    link: '/x/react-charts/examples/twolevelpiechart',
    ChartComponent: TwoLevelPieChart,
  },
  {
    title: 'Straight Angle Pie Chart',
    link: '/x/react-charts/pie-demo/#straight-angle-pie-chart',
    ChartComponent: StraightAnglePieChart,
  },
  {
    title: 'Pie Chart with Customized Label',
    link: '/x/react-charts/pie-demo/#pie-chart-with-customized-label',
    ChartComponent: PieChartWithCustomizedLabel,
  },
  {
    title: 'Pie Chart with Center Label',
    link: '/x/react-charts/pie-demo/#pie-chart-with-center-label',
    ChartComponent: PieChartWithCenterLabel,
  },
  {
    title: 'Pie Chart with Padding Angle',
    link: '/x/react-charts/pie-demo/#pie-chart-with-padding-angle',
    ChartComponent: PieChartWithPaddingAngle,
  },
  {
    title: 'Pie Chart with Custom Legend',
    link: '/x/react-charts/pie-demo/#pie-chart-with-custom-legend-and-tooltip',
    ChartComponent: PieChartWithCustomLegendAndTooltip,
  },
];

export default function PieChartsGrid() {
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
