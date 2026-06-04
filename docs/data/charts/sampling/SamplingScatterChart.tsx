import * as React from 'react';
import { Chance } from 'chance';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import { type DataSampler } from '@mui/x-charts-pro/models';
import { electricityGeneration2024Hourly } from '../dataset/electricityGeneration2024Hourly';
import { carbonEmissions2024Hourly } from '../dataset/carbonEmissions2024Hourly';

// A custom sampler that keeps a random subset of the points. It re-seeds `chance` on every call, so
// the same parameters always yield the same indices — otherwise the chart would flicker while panning.
const randomSampler: DataSampler = ({ length, target }) => {
  const chance = new Chance(42);
  const indices = new Set<number>();
  while (indices.size < Math.min(target, length)) {
    indices.add(chance.integer({ min: 0, max: length - 1 }));
  }
  return [...indices].sort((a, b) => a - b);
};

// 'random' maps to the custom sampling function above; 'bucket' is the built-in.
type MethodChoice = 'none' | 'bucket' | 'random';

const samplingFor = (method: MethodChoice) => {
  if (method === 'none') {
    return undefined;
  }
  if (method === 'random') {
    return randomSampler;
  }
  return method;
};

// Electricity generation vs. carbon intensity for France, hour by hour over 2024: 8,784 points.
const generation = electricityGeneration2024Hourly.FRA;
const carbon = carbonEmissions2024Hourly.FRA;
const data = generation.map((x, index) => ({ x, y: carbon[index], id: index }));

export default function SamplingScatterChart() {
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
          <ToggleButton value="none">None ({data.length} points)</ToggleButton>
          <ToggleButton value="bucket">Bucket</ToggleButton>
          <ToggleButton value="random">Random</ToggleButton>
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
