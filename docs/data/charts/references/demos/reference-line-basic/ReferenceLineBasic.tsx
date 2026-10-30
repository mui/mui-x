import * as React from 'react';
import type { LineChartProps } from '@mui/x-charts/LineChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';

export default function ReferenceLineBasic() {
  return (
    // @focus-start @padding 2
    <LineChart {...chartsConfig}>
      <ChartsReferenceLine y={4} />
      <ChartsReferenceLine x="Mar" />
    </LineChart>
    // @focus-end
  );
}

const chartsConfig: LineChartProps = {
  height: 300,
  xAxis: [
    { scaleType: 'point', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
  ],
  series: [{ data: [2, 5, 3, 7, 1, 6, 4] }],
};
