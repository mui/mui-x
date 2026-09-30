import * as React from 'react';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { BarChartPremium } from '@mui/x-charts-premium/BarChartPremium';

const POINTS = 5000;

function generateRanges(seed) {
  const data = new Array(POINTS);
  let center = 50;
  for (let i = 0; i < POINTS; i += 1) {
    // Deterministic pseudo-random walk on the band center.
    center += Math.sin(center * i * seed * 0.13) * 4;
    const half = 4 + Math.abs(Math.sin(i * seed * 0.21)) * 6;
    data[i] = [Math.round(center - half), Math.round(center + half)];
  }
  return data;
}

const xData = Array.from({ length: POINTS }, (_, i) => i);
const seriesA = generateRanges(1);
const seriesB = generateRanges(7);

export default function WebGLRangeBars() {
  const [renderer, setRenderer] = React.useState('webgl');

  return (
    <Stack sx={{ width: '100%' }}>
      <FormControl fullWidth>
        <FormLabel id="range-bar-chart-webgl-renderer-label">
          Rendering Strategy
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="range-bar-chart-webgl-renderer-label"
          value={renderer}
          onChange={(event) => setRenderer(event.target.value)}
        >
          <FormControlLabel
            value="svg-single"
            control={<Radio />}
            label="Individual Bars (default)"
          />
          <FormControlLabel value="webgl" control={<Radio />} label="WebGL" />
        </RadioGroup>
      </FormControl>
      <BarChartPremium
        xAxis={[
          {
            id: 'x',
            data: xData,
            scaleType: 'band',
            tickSpacing: 50,
            zoom: { minSpan: 0.05 },
          },
        ]}
        series={[
          { type: 'rangeBar', data: seriesA, label: 'Series A' },
          { type: 'rangeBar', data: seriesB, label: 'Series B' },
        ]}
        initialZoom={[{ axisId: 'x', start: 0, end: 10 }]}
        height={300}
        renderer={renderer}
      />
    </Stack>
  );
}
