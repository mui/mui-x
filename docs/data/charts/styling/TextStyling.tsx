import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const data = [42, 65, 49, 78, 56, 90];

export default function TextStyling(): React.JSX.Element {
  return (
    <BarChart
      height={300}
      xAxis={[
        {
          data: months,
          label: 'Month',
          height: 70,
          labelStyle: {
            fontSize: 16,
            fontWeight: 600,
            fill: '#006BD6',
          },
          tickLabelStyle: {
            fontSize: 13,
            fill: '#006BD6',
            angle: -25,
            textAnchor: 'end',
          },
        },
      ]}
      yAxis={[
        {
          label: 'Revenue',
          labelStyle: {
            fontSize: 16,
            fontWeight: 600,
            fill: '#EC407A',
          },
          tickLabelStyle: {
            fontSize: 13,
            fill: '#EC407A',
          },
        },
      ]}
      series={[{ data, label: 'Revenue' }]}
      colors={['#006BD6']}
    />
  );
}
