import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';

// Deterministic large dataset so sampling has something to work on.
const POINTS = 4000;
const data = Array.from({ length: POINTS }, (_, index) => {
  const trend = Math.sin(index / 120) * 50;
  const ripple = Math.sin(index / 9) * 10;
  const spike = index % 211 === 0 ? 40 : 0;
  return Math.round(trend + ripple + spike);
});

const xData = Array.from({ length: POINTS }, (_, index) => index);

const METHODS = [
  { value: 'none', label: 'None' },
  { value: 'm4', label: 'M4' },
  { value: 'minmax', label: 'Min/max' },
  { value: 'lttb', label: 'LTTB' },
] as const;

type Method = (typeof METHODS)[number]['value'];

export default function LineSampling() {
  const [sampling, setSampling] = React.useState<Method>('m4');

  return (
    <Stack sx={{ width: '100%' }} spacing={1}>
      <ToggleButtonGroup
        size="small"
        exclusive
        value={sampling}
        onChange={(event, value) => {
          if (value !== null) {
            setSampling(value);
          }
        }}
        aria-label="Sampling method"
      >
        {METHODS.map((option) => (
          <ToggleButton key={option.value} value={option.value}>
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <Typography variant="caption" color="text.secondary">
        {POINTS} points — zoom in fully to reach the unsampled data
      </Typography>
      <LineChartPro
        xAxis={[{ data: xData, zoom: true }]}
        series={[{ data, label: 'Value', showMark: false }]}
        height={300}
        sampling={sampling}
      />
    </Stack>
  );
}
