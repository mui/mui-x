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
    ChartComponent: SimpleLineChart,
  },
  {
    title: 'Dashed Line Chart',
    ChartComponent: DashedLineChart,
  },
  {
    title: 'Biaxial Line Chart',
    ChartComponent: BiaxialLineChart,
  },
  {
    title: 'Line Chart with Reference Lines',
    ChartComponent: LineChartWithReferenceLines,
  },
  {
    title: 'Line Chart Connect Nulls',
    ChartComponent: LineChartConnectNulls,
  },
  {
    title: 'Live Line Chart',
    ChartComponent: LiveLineChartNoSnap,
  },
  {
    title: 'Line with Uncertainty Area',
    ChartComponent: LineWithUncertaintyArea,
  },
  {
    title: 'Custom Line Marks',
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
          // link={chart.link}
          ChartComponent={chart.ChartComponent}
        />
      ))}
    </Box>
  );
}
