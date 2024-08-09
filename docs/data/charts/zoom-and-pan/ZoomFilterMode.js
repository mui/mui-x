import * as React from 'react';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';

export default function ZoomFilterMode() {
  return (
    <BarChartPro
      xAxis={[
        {
          scaleType: 'band',
          data: axisData,
          zoom: { filterMode: 'discard' },
        },
      ]}
      {...chartProps}
    />
  );
}

const axisData = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
];

const chartProps = {
  width: 600,
  height: 300,
  series: [
    {
      label: 'Series A',
      data: Array.from({ length: 10 }).flatMap((v, i) => [
        (i + i + 1) ** 2,
        (i + i + 1) ** 2 + 5,
      ]),
    },
  ],
};
