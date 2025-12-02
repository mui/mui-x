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
  const [key, rerender] = React.useReducer((x) => x + 1, 0);

  return (
    <Stack>
      <PieChart
        key={key}
        series={[{ data, arcLabel: (item) => `${item.value}` }]}
        width={200}
        height={200}
        hideLegend
        sx={{
          [`& .${pieArcLabelClasses.root}.${pieArcLabelClasses.animate}`]: {
            animationDuration: '2s',
          },
        }}
      />
      <Button onClick={() => rerender()}>Restart Animation</Button>
    </Stack>
  );
}
