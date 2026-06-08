import * as React from 'react';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { electricityGeneration2024Hourly } from '../dataset/electricityGeneration2024Hourly';
import { minMaxSampler } from './customSamplers';

// 'min-max' maps to a custom sampling function (see customSamplers.ts); the others are built-ins.

const samplingFor = (method) => {
  if (method === 'none') {
    return undefined;
  }
  if (method === 'min-max') {
    return minMaxSampler;
  }
  return method;
};

const countries = ['FRA', 'DEU', 'ESP'];
const xData = electricityGeneration2024Hourly.FRA.map((_, index) => index);

export default function SamplingStackedLine() {
  const [method, setMethod] = React.useState('lttb');

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
          <ToggleButton value="lttb">LTTB</ToggleButton>
          <ToggleButton value="m4">M4</ToggleButton>
          <ToggleButton value="min-max">Min/Max</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <LineChartPro
        height={300}
        skipAnimation
        xAxis={[{ data: xData, zoom: true }]}
        series={countries.map((country) => ({
          data: electricityGeneration2024Hourly[country],
          label: country,
          stack: 'total',
          area: true,
          showMark: false,
          sampling: samplingFor(method),
        }))}
      />
    </Box>
  );
}
