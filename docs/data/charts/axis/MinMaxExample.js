import * as React from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { Chance } from 'chance';

const chance = new Chance(42);

const data = Array.from({ length: 200 }, () => ({
  x: chance.floating({ min: -25, max: 25 }),
  y: chance.floating({ min: -25, max: 25 }),
})).map((d, index) => ({ ...d, id: index }));

const minDistance = 10;

export default function MinMaxExample() {
  const [value, setValue] = React.useState([-25, 25]);

  const handleChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        setValue([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setValue([clamped - minDistance, clamped]);
      }
    } else {
      setValue(newValue);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 500 }}>
      <ScatterChart
        xAxis={[
          {
            label: 'x',
            min: value[0],
            max: value[1],
          },
        ]}
        series={[{ data }]}
        height={300}
        margin={{ top: 10 }}
      />
      <Slider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={-40}
        max={40}
        sx={{ mt: 2 }}
      />
    </Box>
  );
}
