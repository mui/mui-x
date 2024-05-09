import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function PieLabel() {
  return (
    <PieChart
      {...props}
      series={[
        {
          data: [
            { id: 0, value: 10, label: (v) => `${v}+A` },
            { id: 1, value: 15, label: (v) => `${v}+B` },
            { id: 2, value: 20, label: (v) => `${v}+C` },
          ],
          type: 'pie',
          arcLabel: 'label',
        },
      ]}
    />
  );
}

const props = {
  width: 500,
  height: 200,
};
