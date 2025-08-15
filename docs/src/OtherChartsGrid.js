import * as React from 'react';
import Box from '@mui/material/Box';

import { ChartThumbnailCard } from './ChartExampleThumbnailGrid';
import BasicGauges from '../data/charts/gauge/BasicGauges';
import ArcDesign from '../data/charts/gauge/ArcDesign';
import CompositionExample from '../data/charts/gauge/CompositionExample';
import BasicSparkLine from '../data/charts/sparkline/BasicSparkLine';
import AreaSparkLine from '../data/charts/sparkline/AreaSparkLine';

const chartData = [
  {
    title: 'Basic Gauges',
    ChartComponent: BasicGauges,
  },
  {
    title: 'Arc Design',
    ChartComponent: ArcDesign,
  },
  {
    title: 'Customized Gauge with Pointer',
    ChartComponent: CompositionExample,
  },
  {
    title: 'Basic Sparkline',
    ChartComponent: BasicSparkLine,
  },
  {
    title: 'Area Sparkline',
    ChartComponent: AreaSparkLine,
  },
];

export default function OtherChartsGrid() {
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
