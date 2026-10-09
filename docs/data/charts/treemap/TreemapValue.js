import * as React from 'react';
import { Treemap } from '@mui/x-charts-premium/Treemap';

// `Budget` sets an explicit value of 100, but its children only sum to 50, so half of
// the `Budget` tile is left empty. `Savings` omits its value, so it is the sum of its
// children (60).
const data = {
  label: 'root',
  children: [
    {
      label: 'Budget (100)',
      value: 100,
      children: [
        { label: 'Rent', value: 30 },
        { label: 'Food', value: 20 },
      ],
    },
    {
      label: 'Savings',
      children: [
        { label: 'Stocks', value: 35 },
        { label: 'Cash', value: 25 },
      ],
    },
  ],
};

export default function TreemapValue() {
  return <Treemap series={{ data }} height={300} />;
}
