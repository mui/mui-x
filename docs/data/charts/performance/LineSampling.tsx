import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { electricityGeneration2024Hourly } from '../dataset/electricityGeneration2024Hourly';

// Real dataset: average electricity generation (MW) for every hour of 2024 (8,784 points).
const data = electricityGeneration2024Hourly.DEU;
const xData = data.map((_, index) => index);

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
        onChange={(event, value) => value !== null && setSampling(value)}
        aria-label="Sampling method"
      >
        {METHODS.map((option) => (
          <ToggleButton key={option.value} value={option.value}>
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <Typography variant="caption" color="text.secondary">
        {data.length.toLocaleString()} hourly points — zoom in to reach the raw data
      </Typography>
      <LineChartPro
        xAxis={[{ data: xData, zoom: true }]}
        series={[{ data, label: 'Generation (MW)', showMark: false }]}
        height={300}
        sampling={sampling}
      />
    </Stack>
  );
}
