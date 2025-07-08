import * as React from 'react';
import Box from '@mui/material/Box';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import { populationByEducationLevelPercentageSeriesLabeled } from './populationByEducationLevel';

export default function FunnelCategoryAxis() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        series={[populationByEducationLevelPercentageSeriesLabeled]}
        categoryAxis={{
          categories: ['First', 'Second', 'Third', 'Fourth', 'Fifth'],
          position: 'left',
          disableLine: true,
          disableTicks: true,
          size: 60,
        }}
        {...funnelProps}
      />
    </Box>
  );
}

const funnelProps = {
  height: 300,
  hideLegend: true,
};
