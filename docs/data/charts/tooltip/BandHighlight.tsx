import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';

import { BarChart } from '@mui/x-charts/BarChart';
import { legendClasses } from '@mui/x-charts/ChartsLegend';

const barChartsParams = {
  xAxis: [
    {
      data: ['page A', 'page B', 'page C', 'page D', 'page E'],
      scaleType: 'band' as const,
    },
  ],
  series: [
    { data: [2, 5, 3, 4, 1], stack: '1', label: 'series x' },
    { data: [10, 3, 1, 2, 10], stack: '1', label: 'series y' },
    { data: [10, 3, 1, 2, 10], stack: '1', label: 'series z' },
  ],
  margin: { top: 10, right: 10 },
  sx: {
    [`& .${legendClasses.root}`]: {
      display: 'none',
    },
  },
  height: 300,
};

export default function BandHighlight() {
  const [xHighlight, setXHightlight] = React.useState<'band' | 'none' | 'line'>(
    'band',
  );
  const [yHighlight, setYHightlight] = React.useState<'none' | 'line'>('none');

  const handleChange =
    (direction: 'x' | 'y') => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (direction === 'x') {
        setXHightlight(
          (event.target as HTMLInputElement).value as 'band' | 'none' | 'line',
        );
      }
      if (direction === 'y') {
        setYHightlight((event.target as HTMLInputElement).value as 'none' | 'line');
      }
    };

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} sx={{ width: '100%', m: 2 }}>
      <div style={{ flexGrow: 1 }}>
        <BarChart
          {...barChartsParams}
          axisHighlight={{ x: xHighlight, y: yHighlight }}
        />
      </div>
      <Stack
        direction={{ xs: 'row', md: 'column' }}
        justifyContent={{ xs: 'space-around', md: 'flex-start' }}
        spacing={2}
        sx={{ m: 2 }}
      >
        <FormControl>
          <FormLabel id="x-highlight-label">x highligh</FormLabel>
          <RadioGroup
            aria-labelledby="x-highlight-label"
            value={xHighlight}
            onChange={handleChange('x')}
          >
            <FormControlLabel value="none" control={<Radio />} label="None" />
            <FormControlLabel value="line" control={<Radio />} label="Line" />
            <FormControlLabel value="band" control={<Radio />} label="Band" />
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel id="y-highlight-label">y highligh</FormLabel>
          <RadioGroup
            aria-labelledby="y-highlight-label"
            value={yHighlight}
            onChange={handleChange('y')}
          >
            <FormControlLabel value="none" control={<Radio />} label="None" />
            <FormControlLabel value="line" control={<Radio />} label="Line" />
          </RadioGroup>
        </FormControl>
      </Stack>
    </Stack>
  );
}
