import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';

export default function ReferenceLineStyled() {
  return (
    <LineChart {...chartsConfig}>
      <ChartsReferenceLine
        y={6}
        label="Threshold"
        labelAlign="start"
        lineStyle={{ strokeDasharray: '10 5', stroke: 'red' }}
        labelStyle={{ fill: 'red', fontSize: 12 }}
      />
      <ChartsReferenceLine
        x="Apr"
        label="Target"
        lineStyle={{ stroke: 'green', strokeWidth: 2 }}
        labelStyle={{ fill: 'green', fontSize: 12 }}
        labelAlign="end"
      />
    </LineChart>
  );
}
const chartsConfig = {
  height: 300,
  xAxis: [
    { scaleType: 'point', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
  ],
  series: [{ data: [2, 5, 3, 7, 1, 6, 4] }],
};
