import * as React from 'react';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { electricityGeneration2024Hourly } from '../dataset/electricityGeneration2024Hourly';

// Real dataset: average electricity generation (MW) for every hour of 2024 (8,784 points).
const base = electricityGeneration2024Hourly.DEU;
const xData = base.map((_, index) => index);

const compactFormatter = new Intl.NumberFormat('en-US', { notation: 'compact' });

// Same series with a few hour-long gaps (null) punched in.
const withGaps: (number | null)[] = base.map((value, index) =>
  index % 1500 >= 700 && index % 1500 < 760 ? null : value,
);

export default function LineSamplingNulls() {
  const [hasGaps, setHasGaps] = React.useState(true);
  const data = hasGaps ? withGaps : base;

  return (
    <Stack sx={{ width: '100%' }} spacing={1}>
      <FormControlLabel
        control={
          <Switch
            checked={hasGaps}
            onChange={(event) => setHasGaps(event.target.checked)}
          />
        }
        label="Insert null gaps"
      />
      <Typography variant="caption" color="text.secondary">
        Sampling is set to <code>m4</code>. Series with <code>null</code> values are
        still sampled; the gaps are preserved, so the line breaks instead of bridging
        them.
      </Typography>
      <LineChartPro
        xAxis={[{ data: xData, zoom: true }]}
        yAxis={[
          {
            label: 'Generation (MW)',
            valueFormatter: (value: number) => compactFormatter.format(value),
          },
        ]}
        series={[{ data, label: 'Generation (MW)', showMark: false }]}
        height={300}
        sampling="m4"
      />
    </Stack>
  );
}
