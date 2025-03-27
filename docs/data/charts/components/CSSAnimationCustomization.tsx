import * as React from 'react';
import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

const data = [
  { id: 0, value: 10, label: 'series A' },
  { id: 1, value: 15, label: 'series B' },
  { id: 2, value: 20, label: 'series C' },
];

export default function CSSAnimationCustomization() {
  const [key, increaseKey] = React.useReducer((s) => s + 1, 0);
  return (
    <Stack>
      <PieChart
        key={key}
        series={[{ data, arcLabel: (item) => `${item.value}` }]}
        width={200}
        height={200}
        hideLegend
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            filter: 'drop-shadow(1px 1px 2px black)',

            animationName: 'animate-pie-arc-label',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationDirection: 'alternate',

            '@keyframes animate-pie-arc-label': {
              '0%': { fill: 'red' },
              '33%': { fill: 'orange' },
              '66%': { fill: 'violet' },
              '100%': { fill: 'red' },
            },
          },
          [`& .${pieArcLabelClasses.root}.${pieArcLabelClasses.animate}`]: {
            animationDuration: '5s',
          },
        }}
      />
      <Button onClick={() => increaseKey()}>Animate</Button>
    </Stack>
  );
}
