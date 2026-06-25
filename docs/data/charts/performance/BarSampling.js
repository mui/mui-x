import * as React from 'react';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';

// Deterministic but noisy dataset (slow trend + pseudo-random noise + rare spikes), the worst
// case for sampling since neighbouring values barely correlate.
function makeData(length) {
  return Array.from({ length }, (_, index) => {
    const hash = Math.sin(index * 12.9898) * 43758.5453;
    const random = hash - Math.floor(hash);
    const trend = Math.sin(index / (length / 12)) * 40;
    const noise = (random - 0.5) * 60;
    const spike = random > 0.995 ? 150 : 0;
    return Math.round(120 + trend + noise + spike);
  });
}

const POINT_OPTIONS = [1_000, 10_000, 100_000];
// Rendering every bar unsampled only stays smooth for the smallest dataset.
const MAX_UNSAMPLED_POINTS = 1_000;

export default function BarSampling() {
  const [points, setPoints] = React.useState(POINT_OPTIONS[1]);
  const [enabled, setEnabled] = React.useState(true);

  const data = React.useMemo(() => makeData(points), [points]);
  const categories = React.useMemo(
    () => data.map((_, index) => `#${index}`),
    [data],
  );

  const canDisable = points <= MAX_UNSAMPLED_POINTS;
  const sampling = enabled || !canDisable ? 'minmax' : 'none';

  return (
    <Stack sx={{ width: '100%' }} spacing={1}>
      <ToggleButtonGroup
        size="small"
        exclusive
        value={points}
        onChange={(event, value) => value !== null && setPoints(value)}
        aria-label="Number of bars"
      >
        {POINT_OPTIONS.map((option) => (
          <ToggleButton key={option} value={option}>
            {option.toLocaleString()}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <FormControlLabel
        control={
          <Switch
            checked={sampling !== 'none'}
            disabled={!canDisable}
            onChange={(event) => setEnabled(event.target.checked)}
          />
        }
        label={`Sampling ${sampling !== 'none' ? 'on' : 'off'}${
          canDisable ? '' : ' (required above 1,000 bars)'
        } — zoom in to reach the raw data`}
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
