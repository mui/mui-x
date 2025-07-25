import * as React from 'react';
import {
  Unstable_SankeyChart as SankeyChart,
  type SankeyValueType,
} from '@mui/x-charts-pro/SankeyChart';

export default function SankeyChartExample() {
  const data: SankeyValueType = {
    nodes: [
      { id: 'A', label: 'Node A' },
      { id: 'B', label: 'Node B' },
      { id: 'C', label: 'Node C' },
      { id: 'D', label: 'Node D' },
    ],
    links: [
      { source: 'A', target: 'B', value: 5, color: 'red' },
      { source: 'A', target: 'C', value: 3 },
      { source: 'B', target: 'D', value: 3 },
      { source: 'C', target: 'D', value: 1 },
    ],
  };

  return (
    <SankeyChart
      height={300}
      series={{
        data,
        nodeWidth: 20,
        nodeGap: 15,
        showNodeLabels: true,
        linkColor: 'gray',
      }}
    />
  );
}
