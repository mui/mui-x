import * as React from 'react';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import tripCounts from '../dataset/nyc-yellow-taxi-2024-trip-count.json';

// Real dataset: NYC yellow taxi trips per hour over 2024 (8,781 points). Each entry is
// `[dayOfYear, hour, tripCount]`.
const data = tripCounts.map((entry) => entry[2]);
const categories = data.map((_, index) => String(index));

export default function BarSampling() {
  const [enabled, setEnabled] = React.useState(true);

  return (
    <Stack sx={{ width: '100%' }} spacing={1}>
      <FormControlLabel
        control={
          <Switch checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
        }
        label={`Sampling ${enabled ? 'on' : 'off'} (${data.length.toLocaleString()} bars — zoom in to reach the raw data)`}
      />
      <BarChartPro
        xAxis={[{ data: categories, zoom: true, tickSpacing: 100 }]}
        series={[{ data, label: 'Trips' }]}
        height={300}
        sampling={enabled ? 'minmax' : 'none'}
      />
    </Stack>
  );
}
