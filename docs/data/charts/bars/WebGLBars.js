import * as React from 'react';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { BarChartPremium } from '@mui/x-charts-premium/BarChartPremium';

const POINTS = 10000;

function generateData(seed) {
  const data = new Array(POINTS);
  let value = 50;
  for (let i = 0; i < POINTS; i += 1) {
    // Deterministic pseudo-random walk. value-in-sin breaks linear predictability.
    value += Math.sin(value * i * seed * 0.13) * 4;
    data[i] = Math.max(0, Math.round(value));
  }
  return data;
}

const xData = Array.from({ length: POINTS }, (_, i) => i);
const seriesA = generateData(1);
const seriesB = generateData(7);

export default function WebGLBars() {
  const [renderer, setRenderer] = React.useState('webgl');

  return (
    <Stack sx={{ width: '100%' }}>
      <FormControl fullWidth>
        <FormLabel id="bar-chart-webgl-renderer-label">Rendering Strategy</FormLabel>
        <RadioGroup
          row
          aria-labelledby="bar-chart-webgl-renderer-label"
          value={renderer}
          onChange={(event) => setRenderer(event.target.value)}
        >
          <FormControlLabel
            value="svg-single"
            control={<Radio />}
            label="Individual Bars (default)"
          />
          <FormControlLabel
            value="svg-batch"
            control={<Radio />}
            label="Batch Bar Rendering"
          />
          <FormControlLabel value="webgl" control={<Radio />} label="WebGL" />
        </RadioGroup>
      </FormControl>
      <BarChartPremium
        xAxis={[{ data: xData, scaleType: 'band', zoom: { minSpan: 0.05 } }]}
        series={[
          { data: seriesA, label: 'Series A', stack: 'stack' },
          { data: seriesB, label: 'Series B', stack: 'stack' },
        ]}
        height={300}
        renderer={renderer}
      />
    </Stack>
  );
}
