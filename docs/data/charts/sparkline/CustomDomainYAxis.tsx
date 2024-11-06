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

const values = [60, -25, 66, 68, 87, 82, 83, 100, 92, 75, 76, 50, 91];

export default function CustomDomainYAxis() {
  return (
    <Stack sx={{ width: '100%' }}>
      <Typography>Without strict domain limit</Typography>
      <Stack sx={{ width: '100%', mb: 2 }} direction="row" spacing={2}>
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart data={values} {...settings} />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart plotType="bar" data={values} {...settings} />
        </Box>
      </Stack>
      <Typography>With strict domain limit</Typography>
      <Stack sx={{ width: '100%' }} direction="row" spacing={2}>
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart
            data={values}
            yAxis={{ domainLimit: 'strict' }}
            {...settings}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart
            plotType="bar"
            data={values}
            yAxis={{ domainLimit: 'strict' }}
            {...settings}
          />
        </Box>
      </Stack>
      <Typography>With custom function domain limit</Typography>
      <Stack sx={{ width: '100%' }} direction="row" spacing={2}>
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart
            data={values}
            yAxis={{
              domainLimit: ([min, max]) => [min - (min % 10), max + 10 - (max % 10)],
            }}
            {...settings}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart
            plotType="bar"
            data={values}
            yAxis={{
              domainLimit: ([min, max]) => [min - (min % 10), max + 10 - (max % 10)],
            }}
            {...settings}
          />
        </Box>
      </Stack>
    </Stack>
  );
}
