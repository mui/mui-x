import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { legendClasses } from '@mui/x-charts/ChartsLegend';

const series = [
  {
    data: [
      { id: 0, value: 10, label: 'series A' },
      { id: 1, value: 15, label: 'series B' },
      { id: 2, value: 20, label: 'series C' },
      { id: 3, value: 30, label: 'series D' },
    ],
  },
];

export default function LegendRoundedSymbol() {
  return (
    <PieChart
      series={series}
      width={400}
      height={200}
      sx={{
        [`& .${legendClasses.mark}`]: {
          ry: '50%',
        },
      }}
    />
  );
}
