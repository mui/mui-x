import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function BasicLabel() {
  return (
    <BarChart
      {...props}
      series={[
        {
          data: [2400, 1398, 9800],
          label: 'label 1',
        },
      ]}
    />
  );
}

const props = {
  width: 500,
  height: 300,
  xAxis: [{ data: ['A', 'B', 'C'], scaleType: 'band' as const }],
};
