/* eslint-disable no-nested-ternary */

import * as React from 'react';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, -9800, 3908, 4800, -3800, 4300];

const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export default function ZoomSliderTooltip() {
  const [showTooltip, setShowTooltip] = React.useState('hover');

  return (
    <Stack width="100%">
      <FormControl sx={{ width: 150, mb: 2, alignSelf: 'center' }}>
        <InputLabel id="show-tooltip-label">Show Tooltip</InputLabel>
        <Select
          labelId="show-tooltip-label"
          id="show-tooltip-select"
          value={showTooltip}
          label="Show Tooltip"
          onChange={(event) => setShowTooltip(event.target.value)}
        >
          <MenuItem value="always">Always</MenuItem>
          <MenuItem value="hover">On hover</MenuItem>
          <MenuItem value="never">Never</MenuItem>
        </Select>
      </FormControl>

      <BarChartPro
        height={300}
        series={[
          { data: pData, label: 'Blue' },
          { data: uData, label: 'Yellow' },
        ]}
        xAxis={[
          {
            id: 'x',
            data: xLabels,
            zoom: { slider: { enabled: true, showTooltip } },
          },
        ]}
        yAxis={[{ width: 60, max: 10000 }]}
        initialZoom={[{ axisId: 'x', start: 20, end: 80 }]}
      />
    </Stack>
  );
}
