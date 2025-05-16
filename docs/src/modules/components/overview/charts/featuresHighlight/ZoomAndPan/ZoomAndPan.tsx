/* eslint-disable material-ui/no-hardcoded-labels */
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { sxColors } from '../colors';
import dataset from './data.json';

const base = {
  google: dataset[0].google!,
  meta: dataset[0].meta!,
};
const formattedDataset = dataset.map((item) => ({
  date: new Date(item.date),
  google: item.google ? (100 * item.google) / base.google : null,
  meta: item.meta ? (100 * item.meta) / base.meta : null,
}));

export default function ZoomAndPan() {
  return (
    <Stack spacing={1} sx={sxColors}>
      <Box
        sx={{
          flexGrow: 1,
          mb: 2,
          width: '100%',
          height: '100%',
        }}
      >
        <LineChartPro
          colors={['var(--palette-color-0)', 'var(--palette-color-4)']}
          dataset={formattedDataset}
          series={[
            { label: 'Google', dataKey: 'google', showMark: false },
            { label: 'Meta', dataKey: 'meta', showMark: false },
          ]}
          margin={{ left: 0, right: 0, bottom: 0, top: 20 }}
          xAxis={[
            { id: 'x-axis', scaleType: 'time', dataKey: 'date', zoom: true, domainLimit: 'strict' },
          ]}
          yAxis={[{ id: 'y-axis', zoom: true, width: 40, tickNumber: 4, min: 80, max: 200 }]}
          initialZoom={[
            { axisId: 'x-axis', start: 40, end: 80 },
            { axisId: 'y-axis', start: 20, end: 89 },
          ]}
          slotProps={{ tooltip: { disablePortal: true } }}
        />
      </Box>
      <Typography variant="subtitle2" sx={{ pt: 2 }}>
        Zoom and pan
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Explore data with greater detail by zooming in and panning across the chart.
      </Typography>
    </Stack>
  );
}
