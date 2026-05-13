import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Unstable_RadialLineChart as RadialLineChart } from '@mui/x-charts-premium/RadialLineChart';
import { dataset } from '../dataset/weather';

const shapes = ['circle', 'square', 'diamond', 'cross', 'star', 'triangle', 'wye'];

export default function RadialLineMarkShape() {
  const [shape, setShape] = React.useState('circle');

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={1}
      sx={{ width: '100%', padding: 2 }}
    >
      <TextField
        select
        label="shape"
        value={shape}
        onChange={(event) => setShape(event.target.value)}
        sx={{ minWidth: 150 }}
      >
        {shapes.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <Box sx={{ flexGrow: 1 }}>
        <RadialLineChart
          height={400}
          dataset={dataset}
          series={[
            {
              dataKey: 'london',
              label: 'London precipitation (mm)',
              curve: 'natural',
              showMark: true,
              shape,
            },
          ]}
          rotationAxis={[
            { scaleType: 'point', dataKey: 'month', disableLine: true },
          ]}
          radiusAxis={[{ disableLine: true }]}
          grid={{ rotation: true, radius: true }}
        />
      </Box>
    </Stack>
  );
}
