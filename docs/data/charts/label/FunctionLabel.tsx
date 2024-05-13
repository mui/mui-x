import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function FunctionLabel() {
  return (
    <BarChart
      {...props}
      series={[
        { data: [2400, 1398, 9800], label: 'simple label' },
        { data: [500, 2398, 4300], label: (location) => `${location} label` },
      ]}
    />
  );
}

const props = {
  width: 500,
  height: 300,
  xAxis: [{ data: ['A', 'B', 'C'], scaleType: 'band' as const }],
};
