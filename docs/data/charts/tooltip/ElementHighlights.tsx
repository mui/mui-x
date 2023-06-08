import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

const barChartsParams = {
  series: [
    { data: [3, 4, 1, 6, 5], label: 'A' },
    { data: [4, 3, 1, 5, 8], label: 'B' },
    { data: [4, 2, 5, 4, 1], label: 'C' },
  ],
  width: 600,
  height: 400,
};
const lineChartsParams = {
  series: [
    { data: [3, 4, 1, 6, 5], label: 'A', area: false, stack: 'total' },
    { data: [4, 3, 1, 5, 8], label: 'B', area: false, stack: 'total' },
    { data: [4, 2, 5, 4, 1], label: 'C', area: false, stack: 'total' },
  ],
  width: 600,
  height: 400,
};

const scatterChartsParams = {
  series: [
    {
      data: [
        { x: 6.5e-2, y: -1.3, id: 0 },
        { x: -2.1, y: -7.0e-1, id: 1 },
        { x: -7.6e-1, y: -6.7e-1, id: 2 },
        { x: -1.5e-2, y: -2.0e-1, id: 3 },
        { x: -1.4, y: -9.9e-1, id: 4 },
        { x: -1.1, y: -1.5, id: 5 },
        { x: -7.0e-1, y: -2.7e-1, id: 6 },
        { x: -5.1e-1, y: -8.8e-1, id: 7 },
        { x: -4.0e-3, y: -1.4, id: 8 },
        { x: -1.3, y: -2.2, id: 9 },
      ],
      label: 'A',
    },
    {
      data: [
        { x: 2.1e-1, y: 2.1, id: 0 },
        { x: 1.3e-1, y: 2.0, id: 1 },
        { x: 2.0, y: 2.0e-3, id: 2 },
        { x: 9.5e-1, y: -1.2e-1, id: 3 },
        { x: 6.9e-1, y: 3.0e-1, id: 4 },
        { x: 1.3, y: 1.0, id: 5 },
        { x: 3.0, y: 2.3, id: 6 },
        { x: 2.6, y: 2.0, id: 7 },
        { x: 3.0e-1, y: 5.9e-1, id: 8 },
        { x: 8.6e-1, y: 4.1e-1, id: 9 },
      ],
      label: 'B',
    },
  ],
  width: 600,
  height: 400,
};

export type HighlightOptions = 'none' | 'item' | 'series';
export type FadeOptions = 'none' | 'series' | 'global';

export default function ElementHighlights() {
  const [highlighted, setHighlighted] = React.useState('none');
  const [faded, setFaded] = React.useState('none');
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
      <BarChart
        {...barChartsParams}
        series={barChartsParams.series.map((series) => ({
          ...series,
          highlightScope: {
            highlighted: highlighted as HighlightOptions,
            faded: faded as FadeOptions,
          },
        }))}
      />
      <LineChart
        {...lineChartsParams}
        series={lineChartsParams.series.map((series) => ({
          ...series,
          highlightScope: {
            highlighted: highlighted as HighlightOptions,
            faded: faded as FadeOptions,
          },
        }))}
      />
      <ScatterChart
        {...scatterChartsParams}
        series={scatterChartsParams.series.map((series) => ({
          ...series,
          highlightScope: {
            highlighted: highlighted as HighlightOptions,
            faded: faded as FadeOptions,
          },
        }))}
      />
      <Stack direction={{ xs: 'row', sm: 'column' }} spacing={3}>
        <TextField
          select
          label="highlighted"
          value={highlighted}
          onChange={(event) => setHighlighted(event.target.value)}
        >
          <MenuItem value={'none'}>none</MenuItem>
          <MenuItem value={'item'}>item</MenuItem>
          <MenuItem value={'series'}>series</MenuItem>
        </TextField>
        <TextField
          select
          label="faded"
          value={faded}
          onChange={(event) => setFaded(event.target.value)}
        >
          <MenuItem value={'none'}>none</MenuItem>
          <MenuItem value={'series'}>series</MenuItem>
          <MenuItem value={'global'}>global</MenuItem>
        </TextField>
      </Stack>
    </Stack>
  );
}
