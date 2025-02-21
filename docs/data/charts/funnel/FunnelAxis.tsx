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
        xAxis={[{ id: 'x', position: 'top' }]}
        yAxis={[
          {
            id: 'y',
            data: ['First', 'Second', 'Third', 'Fourth', 'Fifth'],
            position: 'left',
          },
        ]}
        margin={{ left: 50 }}
        {...funnelProps}
      >
        <ChartsXAxis axisId="x" />
        <ChartsYAxis axisId="y" />
      </FunnelChart>
    </Box>
  );
}

const funnelProps = {
  height: 300,
  hideLegend: true,
} as const;
