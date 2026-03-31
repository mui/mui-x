import * as React from 'react';
import { LineChart, LineChartProps } from '@mui/x-charts/LineChart';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';

export default function ReferenceLineBasic() {
  return (
    <LineChart {...chartsConfig}>
      <ChartsReferenceLine y={4} />
      <ChartsReferenceLine x="Mar" />
    </LineChart>
  );
}

const chartsConfig: LineChartProps = {
  height: 300,
  xAxis: [
    { scaleType: 'point', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
  ],
  series: [{ data: [2, 5, 3, 7, 1, 6, 4] }],
};
