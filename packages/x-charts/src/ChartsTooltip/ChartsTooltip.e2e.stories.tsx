import * as React from 'react';
import { BarChart } from '../BarChart';

export function BarChartTest() {
  return (
    <BarChart
      height={500}
      width={500}
      skipAnimation
      series={[
        {
          data: [100, 200, 300],
        },
      ]}
      leftAxis={null}
      barLabel="value"
      tooltip={{
        trigger: 'item',
      }}
    />
  );
}
