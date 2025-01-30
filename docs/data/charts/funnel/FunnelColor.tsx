import * as React from 'react';
import Box from '@mui/material/Box';
import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import { populationByEducationLevelPercentageSeries } from './populationByEducationLevel';

const palette = ['lightcoral', 'slateblue'];

export default function FunnelColor() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        // Use palette
        colors={palette}
        series={[populationByEducationLevelPercentageSeries]}
        {...funnelParams}
      />
    </Box>
  );
}

const funnelParams = {
  height: 300,
};
