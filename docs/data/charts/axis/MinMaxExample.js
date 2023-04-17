import * as React from 'react';
import Slider from '@mui/material/Slider';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

const data = Array.from({ length: 200 }, (index) => ({
  id: index,
  x: -25 + Math.floor(Math.random() * 50),
  y: -25 + Math.floor(Math.random() * 50),
}));
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
    <div>
      <ScatterChart
        xAxis={[
          {
            id: 'x',
            min: value[0],
            max: value[1],
          },
        ]}
        series={[
          {
            type: 'scatter',
            id: 'linear',
            xAxisKey: 'x',
            data,
          },
        ]}
        width={600}
        height={500}
      />
      <Slider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={-40}
        max={40}
      />
    </div>
  );
}
