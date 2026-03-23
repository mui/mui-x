import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';

export default function ReferenceLineLabel() {
  return (
    <LineChart {...chartsConfig}>
      <ChartsReferenceLine y={7} label="Max" labelAlign="end" />
      <ChartsReferenceLine y={4} label="Average" labelAlign="middle" />
      <ChartsReferenceLine
        y={1}
        label="Min"
        labelAlign="start"
        // Move label below the line.
        spacing={{ y: -5 }}
        labelStyle={{ dominantBaseline: 'hanging' }}
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
