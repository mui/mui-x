import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function MultipleAxesAutoSize() {
  return (
    <React.Fragment>
      <BarChart
        xAxis={[{ data: ['a', 'b'] }]}
        yAxis={[
          { min: 0, max: 100, width: 30, position: 'left' },
          { id: 'value', width: 'auto', position: 'left' },
        ]}
        series={[{ data: [1, 2000000000], yAxisId: 'value' }]}
        margin={20}
        height={300}
        width={300}
      />
      <BarChart
        xAxis={[{ data: ['a', 'b'] }]}
        yAxis={[
          { width: 'auto', position: 'left' },
          { min: 0, max: 100, width: 'auto', position: 'left' },
        ]}
        series={[{ data: [1, 200000000000000] }]}
        margin={20}
        height={300}
        width={300}
      />
    </React.Fragment>
  );
}
