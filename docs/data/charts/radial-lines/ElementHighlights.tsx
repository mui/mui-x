import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Unstable_RadialLineChart as RadialLineChart } from '@mui/x-charts-premium/RadialLineChart';

type HighlightOptions = 'none' | 'item' | 'series';
type FadeOptions = 'none' | 'series' | 'global';

const params = {
  series: [
    {
      data: [3, 4, 1, 6, 5],
      label: 'A',
      area: false,
      stack: 'total',
    },
    { data: [4, 3, 1, 5, 8], label: 'B', area: false, stack: 'total' },
    {
      data: [4, 2, 5, 4, 1],
      label: 'C',
      area: false,
      stack: 'total',
    },
  ],
  rotationAxis: [{ scaleType: 'point' as const, data: [1, 2, 3, 4, 5] }],
  height: 400,
  grid: { rotation: true, radius: true },
};

export default function ElementHighlights() {
  const [withArea, setWithArea] = React.useState(false);
  const [highlight, setHighlight] = React.useState<HighlightOptions>('item');
  const [fade, setFade] = React.useState<FadeOptions>('global');

  return (
    <Stack
      direction={{ xs: 'column', xl: 'row' }}
      spacing={1}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <RadialLineChart
          {...params}
          series={params.series.map((series) => ({
            ...series,
            area: withArea,
            highlightScope: {
              highlight,
              fade,
            },
          }))}
        />
      </Box>
      <Stack
        direction={{ xs: 'row', xl: 'column' }}
        spacing={3}
        useFlexGap
        sx={{ justifyContent: 'center', flexWrap: 'wrap' }}
      >
        <TextField
          select
          label="highlight"
          value={highlight}
          onChange={(event) => setHighlight(event.target.value as HighlightOptions)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value={'none'}>none</MenuItem>
          <MenuItem value={'item'}>item</MenuItem>
          <MenuItem value={'series'}>series</MenuItem>
        </TextField>
        <TextField
          select
          label="fade"
          value={fade}
          onChange={(event) => setFade(event.target.value as FadeOptions)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value={'none'}>none</MenuItem>
          <MenuItem value={'series'}>series</MenuItem>
          <MenuItem value={'global'}>global</MenuItem>
        </TextField>

        <FormControlLabel
          control={
            <Switch
              checked={withArea}
              onChange={(event) => setWithArea(event.target.checked)}
            />
          }
          label="Fill line area"
        />
      </Stack>
    </Stack>
  );
}
