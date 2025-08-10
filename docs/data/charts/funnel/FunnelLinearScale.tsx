import * as React from 'react';
import Box from '@mui/material/Box';
import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import { populationByEducationLevelPercentageSeriesLabeled } from './populationByEducationLevel';

export default function FunnelLinearScale() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        series={[populationByEducationLevelPercentageSeriesLabeled]}
        categoryAxis={{ scaleType: 'linear' }}
        {...funnelProps}
      />
    </Box>
  );
}

const funnelProps = {
  height: 300,
  hideLegend: true,
} as const;
