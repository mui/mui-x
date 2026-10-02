import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const data = [42, 65, 49, 78, 56, 90, 73, 81, 60, 88, 54, 95];

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
            fontFamily: 'Georgia, serif',
            fill: '#006BD6',
          },
          tickLabelStyle: {
            fontSize: 13,
            fontFamily: 'Georgia, serif',
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
