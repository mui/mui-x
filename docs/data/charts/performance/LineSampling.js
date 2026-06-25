import * as React from 'react';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';

// Deterministic but noisy dataset (slow trend + pseudo-random noise + rare spikes), the worst
// case for sampling since neighbouring values barely correlate.
function makeData(length) {
  return Array.from({ length }, (_, index) => {
    const hash = Math.sin(index * 12.9898) * 43758.5453;
    const random = hash - Math.floor(hash);
    const trend = Math.sin(index / (length / 12)) * 50;
    const noise = (random - 0.5) * 30;
    const spike = random > 0.997 ? 120 : 0;
    return Math.round(trend + noise + spike);
  });
}

const METHODS = [
  { value: 'none', label: 'None' },
  { value: 'm4', label: 'M4' },
  { value: 'minmax', label: 'Min/max' },
  { value: 'lttb', label: 'LTTB' },
];

const POINT_OPTIONS = [1_000, 10_000, 100_000];
// Rendering every point unsampled only stays smooth up to this size.
const MAX_UNSAMPLED_POINTS = 10_000;

export default function LineSampling() {
  const [points, setPoints] = React.useState(POINT_OPTIONS[1]);
  const [method, setMethod] = React.useState('m4');

  const data = React.useMemo(() => makeData(points), [points]);
  const xData = React.useMemo(() => data.map((_, index) => index), [data]);

  const noneDisabled = points > MAX_UNSAMPLED_POINTS;
  const sampling = method === 'none' && noneDisabled ? 'm4' : method;

  return (
    <Stack sx={{ width: '100%' }} spacing={1}>
      <ToggleButtonGroup
        size="small"
        exclusive
        value={points}
        onChange={(event, value) => value !== null && setPoints(value)}
        aria-label="Number of points"
      >
        {POINT_OPTIONS.map((option) => (
          <ToggleButton key={option} value={option}>
            {option.toLocaleString()}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <ToggleButtonGroup
        size="small"
        exclusive
        value={sampling}
        onChange={(event, value) => value !== null && setMethod(value)}
        aria-label="Sampling method"
      >
        {METHODS.map((option) => (
          <ToggleButton
            key={option.value}
            value={option.value}
            disabled={option.value === 'none' && noneDisabled}
          >
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <LineChartPro
        xAxis={[{ data: xData, zoom: true }]}
        series={[{ data, label: 'Value', showMark: false }]}
        height={300}
        sampling={sampling}
      />
    </Stack>
  );
}
