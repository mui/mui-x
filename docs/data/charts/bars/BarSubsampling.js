import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';

// Deterministic large dataset so subsampling has something to work on.
const POINTS = 2000;
const data = Array.from({ length: POINTS }, (_, index) => {
  const trend = Math.sin(index / 90) * 40 + 60;
  const ripple = Math.sin(index / 7) * 12;
  const spike = index % 137 === 0 ? 60 : 0;
  return Math.max(0, Math.round(trend + ripple + spike));
});

const categories = Array.from({ length: POINTS }, (_, index) => `#${index}`);

export default function BarSubsampling() {
  return (
    <Stack sx={{ width: '100%' }} spacing={1}>
      <Typography variant="body2" color="text.secondary">
        {POINTS} bars. Zoomed out, bars are automatically subsampled so they never
        get too thin. Scroll to zoom in at the pointer and reveal more detail; drag
        to pan.
      </Typography>
      <BarChartPro
        xAxis={[{ data: categories, zoom: true, tickSpacing: 100 }]}
        series={[{ data, label: 'Value' }]}
        height={300}
      />
    </Stack>
  );
}
