import * as React from 'react';
import { LineChart, LineChartProps } from '@mui/x-charts/LineChart';
import { ReferenceArea, ReferenceAreaLabel } from './ReferenceArea';

export default function ReferenceAreaBasic() {
  return (
    <LineChart {...chartsConfig}>
      <ReferenceArea y1={6} y2={8} stroke="red" strokeWidth={2} fill="none" />
      <ReferenceArea
        x1="Mar"
        x2="May"
        y1="start"
        y2="end"
        fill="blue"
        fillOpacity={0.5}
      />

      <ReferenceAreaLabel
        y1={6}
        y2={8}
        stroke="none"
        fill="green"
        dominantBaseline="hanging"
      >
        Test
      </ReferenceAreaLabel>
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
