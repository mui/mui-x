import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function OnSeriesItemClick() {
  return (
    <PieChart
      series={[
        {
          data: [
            {
              id: 0,
              value: 10,
              label: 'series A',
              onClick: (item) => console.log(item),
            },
            { id: 2, value: 20, label: 'series C' },
          ],
        },
      ]}
      width={400}
      height={200}
    />
  );
}
