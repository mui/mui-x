import * as React from 'react';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import {
  usUnemploymentRate,
  dateAxisFormatter,
  percentageFormatter,
} from '../dataset/usUnemploymentRate';
import { minMaxSampler } from './customSamplers';

// 'min-max' maps to a custom sampling function (see customSamplers.ts); the others are built-ins.
type MethodChoice = 'none' | 'lttb' | 'm4' | 'min-max';

const samplingFor = (method: MethodChoice) => {
  if (method === 'none') {
    return undefined;
  }
  if (method === 'min-max') {
    return minMaxSampler;
  }
  return method;
};

// Monthly US unemployment rate since 1948: 929 points.
const data = usUnemploymentRate.map((point) => point.rate);
const xData = usUnemploymentRate.map((point) => point.date);

export default function SamplingLineChart() {
  const [method, setMethod] = React.useState<MethodChoice>('lttb');

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
          <ToggleButton value="lttb">LTTB</ToggleButton>
          <ToggleButton value="m4">M4</ToggleButton>
          <ToggleButton value="min-max">Min/Max</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <LineChartPro
        height={300}
        skipAnimation
        xAxis={[
          {
            data: xData,
            scaleType: 'time',
            zoom: true,
            valueFormatter: dateAxisFormatter,
          },
        ]}
        yAxis={[{ valueFormatter: percentageFormatter }]}
        series={[
          {
            data,
            sampling: samplingFor(method),
            showMark: false,
            label: 'Unemployment rate',
          },
        ]}
      />
    </Box>
  );
}
