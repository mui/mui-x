import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Unstable_RadarChart as RadarChart } from '@mui/x-charts/RadarChart';
import Typography from '@mui/material/Typography';

export default function RadarTooltip() {
  return (
    <Stack
      sx={{ width: '100%' }}
      direction="row"
      flexWrap="wrap"
      justifyContent="space-around"
    >
      <Box sx={{ maxWidth: 300 }}>
        <Typography sx={{ textAlign: 'center' }}>Axis</Typography>
        <RadarChart
          {...radarChartsParams}
          slotProps={{ tooltip: { trigger: 'axis' } }}
        />
      </Box>
      <Box sx={{ maxWidth: 300 }}>
        <Typography sx={{ textAlign: 'center' }}>Item</Typography>
        <RadarChart
          {...radarChartsParams}
          highlight="series"
          slotProps={{ tooltip: { trigger: 'item' } }}
        />
      </Box>
    </Stack>
  );
}

// Data from https://ourworldindata.org/emissions-by-fuel
const series = [
  {
    id: 'usa',
    label: 'USA',
    data: [6.65, 2.76, 5.15, 0.19, 0.07, 0.12],
  },
  {
    id: 'australia',
    label: 'Australia',
    data: [5.52, 5.5, 3.19, 0.51, 0.15, 0.11],
  },
  {
    id: 'united-kingdom',
    label: 'United Kingdom',
    data: [2.26, 0.29, 2.03, 0.05, 0.04, 0.06],
  },
];

const radar = {
  metrics: ['Oil', 'Coal', 'Gas', 'Flaring', 'Other\nindustry', 'Cement'],
};

const radarChartsParams = {
  hideLegend: true,
  height: 300,
  series,
  radar,
};
