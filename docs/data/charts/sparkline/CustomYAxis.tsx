import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

const settings = {
  valueFormatter: (v: number | null) => `${v}%`,
  height: 100,
  showTooltip: true,
  showHighlight: true,
} as const;

const smallValues = [0, 2, 3, 4, 6, 8, 7, 9, 15, 6, 8, 7, 12];
const largeValues = [60, 65, 66, 68, 87, 82, 83, 89, 92, 75, 76, 77, 91];
export default function CustomYAxis() {
  return (
    <Stack sx={{ width: '100%' }}>
      <Typography>Without fixed y-range</Typography>
      <Stack sx={{ width: '100%', mb: 2 }} direction="row" spacing={2}>
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart data={smallValues} colors={['red']} {...settings} />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart data={largeValues} {...settings} />
        </Box>
      </Stack>
      <Typography>With y-range fixed to [0, 100]</Typography>
      <Stack sx={{ width: '100%' }} direction="row" spacing={2}>
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart
            data={smallValues}
            yAxis={{
              min: 0,
              max: 100,
            }}
            colors={['red']}
            {...settings}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart
            data={largeValues}
            yAxis={{
              min: 0,
              max: 100,
            }}
            {...settings}
          />
        </Box>
      </Stack>
    </Stack>
  );
}
