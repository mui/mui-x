import * as React from 'react';
import Stack from '@mui/material/Stack';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

const settings = {
  width: 200,
  height: 200,
  value: 60,
};
export default function ArcDesign() {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }}>
      <Gauge
        {...settings}
        cornerRadius="50%"
        sx={(theme) => ({
          [`& .${gaugeClasses.valueText}`]: {
            fontSize: 40,
          },
          [`& .${gaugeClasses.valueArc}`]: {
            fill: '#52b202',
          },
          [`& .${gaugeClasses.referenceArc}`]: {
            fill: theme.palette.text.disabled,
          },
        })}
      />
    </Stack>
  );
}
