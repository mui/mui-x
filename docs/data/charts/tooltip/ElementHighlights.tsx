import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { BarChart } from '@mui/x-charts/BarChart';

const lineChartsParams = {
  series: [
    { data: [3, 4, 1, 6, 5], stack: 'A', label: 'series A1' },
    { data: [4, 3, 1, 5, 8], stack: 'A', label: 'series A2' },
    { data: [4, 2, 5, 4, 1], stack: 'B', label: 'series B1' },
    { data: [2, 8, 1, 3, 1], stack: 'B', label: 'series B2' },
    { data: [10, 6, 5, 8, 9], label: 'series C1' },
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
        {...lineChartsParams}
        series={lineChartsParams.series.map((series) => ({
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
