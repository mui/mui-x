import * as React from 'react';
import Box from '@mui/material/Box';
import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { populationByEducationLevelPercentageSeriesLabeled } from './populationByEducationLevel';

export default function FunnelAxis() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        series={[populationByEducationLevelPercentageSeriesLabeled]}
        categoryAxis={{
          categories: ['First', 'Second', 'Third', 'Fourth', 'Fifth'],
          position: 'left',
        }}
        {...funnelProps}
      >
        <ChartsYAxis disableLine disableTicks />
      </FunnelChart>
    </Box>
  );
}

const funnelProps = {
  height: 300,
  hideLegend: true,
} as const;
