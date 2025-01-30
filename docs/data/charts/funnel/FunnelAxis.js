import * as React from 'react';
import Box from '@mui/material/Box';
import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { populationByEducationLevelPercentageSeriesLabeled } from './populationByEducationLevel';

export default function FunnelAxis() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        series={[populationByEducationLevelPercentageSeriesLabeled]}
        xAxis={[{ id: 'x' }]}
        yAxis={[
          {
            id: 'y',
            data: ['First', 'Second', 'Third', 'Fourth', 'Fifth'],
          },
        ]}
        margin={{ left: 50 }}
        {...funnelProps}
      >
        <ChartsXAxis axisId="x" position="top" />
        <ChartsYAxis axisId="y" position="left" />
      </FunnelChart>
    </Box>
  );
}

const funnelProps = {
  height: 300,
  hideLegend: true,
};
