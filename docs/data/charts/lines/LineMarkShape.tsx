import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { LineChart } from '@mui/x-charts/LineChart';
import { dataset } from '../dataset/weather';

type Shape = 'circle' | 'square' | 'diamond' | 'cross' | 'star' | 'triangle' | 'wye';

const marksMapping = {
  true: true,
  false: false,
  start: 'start',
  end: 'end',
  '({index})=>index%2===0': ({ index }: { index: number }) => index % 2 === 0,
} as const;

const marksOptions: (keyof typeof marksMapping)[] = [
  'true',
  'false',
  'start',
  'end',
  '({index})=>index%2===0',
];

const shapes: Shape[] = [
  'circle',
  'square',
  'diamond',
  'cross',
  'star',
  'triangle',
  'wye',
];

export default function LineMarkShape() {
  const [marks, setMarks] = React.useState<keyof typeof marksMapping>('true');
  const [shape, setShape] = React.useState<Shape>('circle');

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={1}
      sx={{ width: '100%', padding: 2 }}
    >
      <Stack direction={{ xs: 'row', md: 'column' }} spacing={1}>
        <TextField
          select
          label="marks"
          value={marks}
          onChange={(event) =>
            setMarks(event.target.value as keyof typeof marksMapping)
          }
          sx={{ minWidth: 150 }}
        >
          {marksOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="shape"
          value={shape}
          onChange={(event) => setShape(event.target.value as Shape)}
          sx={{ minWidth: 150 }}
        >
          {shapes.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Box sx={{ flexGrow: 1 }}>
        <LineChart
          height={250}
          dataset={dataset}
          series={[
            {
              dataKey: 'london',
              label: 'London precipitation (mm)',
              curve: 'natural',
              showMark: marksMapping[marks],
              shape,
            },
          ]}
          xAxis={[{ scaleType: 'point', dataKey: 'month' }]}
          grid={{ vertical: true, horizontal: true }}
        />
      </Box>
    </Stack>
  );
}
