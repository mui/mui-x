import * as React from 'react';
import { Unstable_SankeyChart as SankeyChart } from '@mui/x-charts-pro/SankeyChart';

const data = {
  nodes: [
    { id: 'A' },
    { id: 'B' },
    { id: 'C' },
    { id: 'D' },
    { id: 'E' },
    { id: 'F' },
    { id: 'G' },
  ],

  links: [
    { source: 'A', target: 'F', value: 90 },
    { source: 'B', target: 'F', value: 10 },
    { source: 'C', target: 'G', value: 80 },
    { source: 'D', target: 'G', value: 20 },
    { source: 'E', target: 'G', value: 5 },
    { source: 'F', target: 'H', value: 100 },
  ],
};

export default function SankeyIncomeStatement() {
  return (
    <SankeyChart
      series={{
        data,
        linkOptions: {
          curveCorrection: 0.4,
        },
      }}
      height={500}
    />
  );
}
