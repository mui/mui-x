import * as React from 'react';
import Box from '@mui/material/Box';

import { ChartThumbnailCard } from './ChartExampleThumbnailGrid';
import SimpleLineChart from '../data/charts/line-demo/SimpleLineChart';
import DashedLineChart from '../data/charts/line-demo/DashedLineChart';
import BiaxialLineChart from '../data/charts/line-demo/BiaxialLineChart';
import LineChartWithReferenceLines from '../data/charts/line-demo/LineChartWithReferenceLines';
import LineChartConnectNulls from '../data/charts/line-demo/LineChartConnectNulls';
import LiveLineChartNoSnap from '../data/charts/line-demo/LiveLineChartNoSnap';
import LineWithUncertaintyArea from '../data/charts/line-demo/LineWithUncertaintyArea';
import CustomLineMarks from '../data/charts/line-demo/CustomLineMarks';

const chartData = [
  {
    title: 'Simple Line Chart',
    link: '/x/react-charts/examples/simplelinechart/',
    ChartComponent: SimpleLineChart,
  },
  {
    title: 'Dashed Line Chart',
    link: '/x/react-charts/examples/dashedlinechart/',
    ChartComponent: DashedLineChart,
  },
  {
    title: 'Biaxial Line Chart',
    link: '/x/react-charts/examples/biaxiallinechart/',
    ChartComponent: BiaxialLineChart,
  },
  {
    title: 'Line Chart with Reference Lines',
    link: '/x/react-charts/line-demo/#line-chart-with-reference-lines',
    ChartComponent: LineChartWithReferenceLines,
  },
  {
    title: 'Line Chart Connect Nulls',
    link: '/x/react-charts/line-demo/#line-chart-connect-nulls',
    ChartComponent: LineChartConnectNulls,
  },
  {
    title: 'Live Line Chart',
    link: '/x/react-charts/line-demo/#line-chart-with-live-data',
    ChartComponent: LiveLineChartNoSnap,
  },
  {
    title: 'Line with Uncertainty Area',
    link: '/x/react-charts/line-demo/#line-with-forecast',
    ChartComponent: LineWithUncertaintyArea,
  },
  {
    title: 'Custom Line Marks',
    link: '/x/react-charts/line-demo/#custom-line-marks',
    ChartComponent: CustomLineMarks,
  },
];

export default function LineChartsGrid() {
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
