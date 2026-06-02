import * as React from 'react';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import { electricityGeneration2024Hourly } from '../dataset/electricityGeneration2024Hourly';
import { carbonEmissions2024Hourly } from '../dataset/carbonEmissions2024Hourly';
import { minMaxSampler } from './customSamplers';

// 'min-max' maps to a custom sampling function (see customSamplers.ts); 'bucket' is the built-in.

const samplingFor = (method) => {
  if (method === 'none') {
    return undefined;
  }
  if (method === 'min-max') {
    return minMaxSampler;
  }
  return method;
};

// Electricity generation vs. carbon intensity for France, hour by hour over 2024: 8,784 points.
const generation = electricityGeneration2024Hourly.FRA;
const carbon = carbonEmissions2024Hourly.FRA;
const data = generation.map((x, index) => ({ x, y: carbon[index], id: index }));

export default function SamplingScatterChart() {
  const [method, setMethod] = React.useState('bucket');

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
          <ToggleButton value="none">None ({data.length} points)</ToggleButton>
          <ToggleButton value="bucket">Bucket</ToggleButton>
          <ToggleButton value="min-max">Min/Max</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <ScatterChartPro
        height={300}
        skipAnimation
        xAxis={[{ zoom: true, label: 'Electricity generation (MW)' }]}
        yAxis={[{ zoom: true, label: 'Carbon intensity (gCO₂/kWh)' }]}
        series={[
          {
            data,
            sampling: samplingFor(method),
            label: 'Hours of 2024',
          },
        ]}
      />
    </Box>
  );
}
