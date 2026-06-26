import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { electricityGeneration2024Hourly } from '../dataset/electricityGeneration2024Hourly';

// Real dataset: average electricity generation (MW) for every hour of 2024 (8,784 points).
const data = electricityGeneration2024Hourly.DEU;
const xData = data.map((_, index) => index);

const METHODS = [
  { value: 'none', label: 'None — every point' },
  { value: 'minmax', label: 'Min/max' },
  { value: 'm4', label: 'M4' },
  { value: 'lttb', label: 'LTTB' },
] as const;

export default function SamplingMethodComparison() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        gap: 2,
        width: '100%',
      }}
    >
      {METHODS.map((method) => (
        <Box key={method.value}>
          <Typography variant="caption" color="text.secondary">
            {method.label}
          </Typography>
          <LineChartPro
            series={[{ data, showMark: false }]}
            xAxis={[{ data: xData, zoom: true }]}
            yAxis={[{ width: 40 }]}
            height={160}
            sampling={method.value}
            hideLegend
          />
        </Box>
      ))}
    </Box>
  );
}
