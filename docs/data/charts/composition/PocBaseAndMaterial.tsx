import * as React from 'react';
import { PieChart } from '@mui/x-charts-base';

export default function PocBaseAndMaterial() {
  return (
    <PieChart
      height={300}
      enableKeyboardNavigation
      series={[
        {
          arcLabel: 'value',
          data: [
            { value: 10, label: 'A' },
            { value: 20, label: 'B' },
            { value: 30, label: 'C' },
          ],
        },
      ]}
    />
  );
}
