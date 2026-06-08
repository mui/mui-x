import * as React from 'react';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { electricityGeneration2024Every6Hours } from '../dataset/electricityGeneration2024Every6Hours';
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

const countries = ['FRA', 'DEU', 'ESP'] as const;
const xData = electricityGeneration2024Every6Hours.FRA.map((_, index) => index);

export default function SamplingStackedBar() {
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
          <ToggleButton value="none">None</ToggleButton>
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
        series={countries.map((country) => ({
          data: electricityGeneration2024Every6Hours[country],
          label: country,
          stack: 'total',
          sampling: samplingFor(method),
        }))}
      />
    </Box>
  );
}
