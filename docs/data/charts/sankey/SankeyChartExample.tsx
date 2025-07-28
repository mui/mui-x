import * as React from 'react';
import { Unstable_SankeyChart as SankeyChart } from '@mui/x-charts-pro/SankeyChart';

export default function SankeyChartExample() {
  return (
    <SankeyChart
      height={300}
      series={{
        data: {
          nodes: {
            B: { color: 'red' },
          },
          links: [
            { source: 'A', target: 'B', value: 5, color: 'red' },
            { source: 'A', target: 'C', value: 3 },
            { source: 'B', target: 'D', value: 3 },
            { source: 'C', target: 'D', value: 1 },
          ],
        },
        nodeWidth: 20,
        nodeGap: 15,
        showNodeLabels: true,
        linkColor: 'gray',
      }}
    />
  );
}
