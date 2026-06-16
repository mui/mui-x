import * as React from 'react';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';

// Deterministic large dataset so sampling has something to work on.
const POINTS = 2000;
const data = Array.from({ length: POINTS }, (_, index) => {
  const trend = Math.sin(index / 90) * 40 + 60;
  const ripple = Math.sin(index / 7) * 12;
  const spike = index % 137 === 0 ? 60 : 0;
  return Math.max(0, Math.round(trend + ripple + spike));
});

const categories = Array.from({ length: POINTS }, (_, index) => `#${index}`);

export default function BarSampling() {
  const [sampling, setSampling] = React.useState(true);

  return (
    <Stack sx={{ width: '100%' }} spacing={1}>
      <FormControlLabel
        control={
          <Switch
            checked={sampling}
            onChange={(event) => setSampling(event.target.checked)}
          />
        }
        label={`Sampling ${sampling ? 'on' : 'off'} (${POINTS} bars — zoom in fully to reach the unsampled data)`}
      />
      <BarChartPro
        xAxis={[{ data: categories, zoom: true, tickSpacing: 100 }]}
        series={[{ data, label: 'Value' }]}
        height={300}
        sampling={sampling}
      />
    </Stack>
  );
}
