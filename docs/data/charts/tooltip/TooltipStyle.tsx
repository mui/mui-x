import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { chartsTooltipClasses } from '@mui/x-charts/ChartsTooltip';

const params = {
  xAxis: [{ data: [1, 2, 3, 5, 8, 10] }],
  series: [{ data: [2, 5.5, 2, 8.5, 1.5, 5] }],
  height: 300,
  axisHighlight: { x: 'line' },
} as const;

export default function TooltipStyle() {
  return (
    <LineChart
      {...params}
      slotProps={{
        tooltip: {
          sx: {
            [`.${chartsTooltipClasses.valueCell}`]: {
              color: 'red',
            },
          },
        },
      }}
    />
  );
}
