import * as React from 'react';
import { Unstable_SankeyChart as SankeyChart } from '@mui/x-charts-pro/SankeyChart';

const data = {
  links: [
    {
      source: 'Some nicely long text that exceeds normal',
      target: 'The longest of them all that goes and goes and goes outside',
      value: 20,
    },
    {
      source: 'The longest of them all that goes and goes and goes outside',
      target: 'Even longer text that goes and goes',
      value: 80,
    },
    {
      source: 'Even longer text that goes and goes',
      target: 'The longest of them all that goes and goes and goes',
      value: 100,
    },
  ],
};

export default function SankeyNodeLongLabels() {
  return <SankeyChart width={600} height={400} series={{ data }} />;
}
