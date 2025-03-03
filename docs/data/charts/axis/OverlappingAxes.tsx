import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { AxisValueFormatterContext } from '@mui/x-charts/models';

export default function OverlappingAxes() {
  return (
    <LineChart
      xAxis={[
        {
          scaleType: 'time',
          data: time,
          valueFormatter: formatShortMonth,
          height: 0,
          tickLabelPlacement: 'middle',
        },
        {
          scaleType: 'time',
          data: time,
          tickInterval: time.filter((_, index) => index % 3 === 0),
          valueFormatter: formatQuarterYear,
          position: 'bottom',
          tickSize: 25,
          tickLabelPlacement: 'middle',
          height: 35,
        },
      ]}
      {...chartConfig}
    />
  );
}

const formatQuarterYear = (date: Date, context: AxisValueFormatterContext) => {
  if (context.location === 'tick') {
    const quarter = Math.floor(date.getMonth() / 3) + 1;
    const year = date.getFullYear().toString().slice(-2);
    return `Q${quarter} '${year}`;
  }
  return date.toLocaleDateString('en-US', { month: 'long' });
};

const formatShortMonth = (date: Date, context: AxisValueFormatterContext) => {
  if (context.location === 'tick') {
    return date.toLocaleDateString('en-US', { month: 'short' });
  }
  return date.toLocaleDateString('en-US', { month: 'long' });
};

const time = [
  new Date(2015, 0, 1),
  new Date(2015, 1, 1),
  new Date(2015, 2, 1),
  new Date(2015, 3, 1),
  new Date(2015, 4, 1),
  new Date(2015, 5, 1),
  new Date(2015, 6, 1),
  new Date(2015, 7, 1),
  new Date(2015, 8, 1),
  new Date(2015, 9, 1),
  new Date(2015, 10, 1),
  new Date(2015, 11, 1),
  new Date(2016, 0, 1),
];
const a = [
  4000, 3000, 2000, 2780, 1890, 2390, 3490, 2400, 1398, 9800, 3908, 4800, 2400,
];
const b = [
  2400, 1398, 9800, 3908, 4800, 3800, 4300, 2181, 2500, 2100, 3000, 2000, 3908,
];

const getPercents = (array: number[]) =>
  array.map((v, index) => (100 * v) / (a[index] + b[index]));

const chartConfig = {
  height: 300,
  series: [
    {
      data: getPercents(a),
      type: 'line',
      label: 'a',
      area: true,
      stack: 'total',
      showMark: false,
    },
    {
      data: getPercents(b),
      type: 'line',
      label: 'b',
      area: true,
      stack: 'total',
      showMark: false,
    },
  ],
} as const;
