import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function PieArcLabel() {
  return (
    <PieChart
      series={[
        {
          arcLabel: (item) => `${item.label} (${item.value})`,
          arcLabelMinAngle: 45,
          data: [
            { value: 5, label: 'A' },
            { value: 10, label: 'B' },
            { value: 15, label: 'C' },
            { value: 20, label: 'D' },
          ],
        },
      ]}
      width={400}
      height={200}
    />
  );
}
