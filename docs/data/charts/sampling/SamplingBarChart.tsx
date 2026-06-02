import * as React from 'react';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { carbonEmissions2024Every6Hours } from '../dataset/carbonEmissions2024Every6Hours';
import { minMaxSampler } from './customSamplers';

// 'min-max' maps to a custom sampling function (see customSamplers.ts); 'bucket' is the built-in.
type MethodChoice = 'none' | 'bucket' | 'min-max';

const samplingFor = (method: MethodChoice) => {
  if (method === 'none') {
    return undefined;
  }
  if (method === 'min-max') {
    return minMaxSampler;
  }
  return method;
};

// Carbon intensity for France sampled every 6 hours over 2024: 1,464 bars.
const data = carbonEmissions2024Every6Hours.FRA;
const xData = data.map((_, index) => index);

export default function SamplingBarChart() {
  const [method, setMethod] = React.useState<MethodChoice>('bucket');

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
        <ToggleButtonGroup
          value={method}
          exclusive
          onChange={(event, value) => {
            if (value !== null) {
              setMethod(value);
            }
          }}
          size="small"
        >
          <ToggleButton value="none">None ({data.length} bars)</ToggleButton>
          <ToggleButton value="bucket">Bucket</ToggleButton>
          <ToggleButton value="min-max">Min/Max</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <BarChartPro
        height={300}
        skipAnimation
        xAxis={[
          {
            data: xData,
            zoom: true,
            tickSpacing: 50,
          },
        ]}
        series={[
          {
            data,
            sampling: samplingFor(method),
            label: 'gCO₂/kWh',
          },
        ]}
      />
    </Box>
  );
}
