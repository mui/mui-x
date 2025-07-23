import * as React from 'react';
import { Unstable_SankeyChart as SankeyChart } from '@mui/x-charts-pro/SankeyChart';

export default function SankeyChartExample() {
  const data = {
    nodes: [
      { id: 'A', label: 'Node A' },
      { id: 'B', label: 'Node B' },
      { id: 'C', label: 'Node C' },
      { id: 'D', label: 'Node D' },
      { id: 'E', label: 'Node E' },
      { id: 'F', label: 'Node F' },
    ],
    links: [
      { source: 'A', target: 'B', value: 5 },
      { source: 'A', target: 'C', value: 3 },
      { source: 'B', target: 'D', value: 2 },
      { source: 'B', target: 'E', value: 3 },
      { source: 'C', target: 'E', value: 1 },
      { source: 'C', target: 'F', value: 2 },
      { source: 'E', target: 'F', value: 1 },
    ],
  };

  return (
    <SankeyChart
      width={800}
      height={600}
      series={{
        data,
        nodeWidth: 20,
        nodeGap: 15,
        showNodeLabels: true,
        linkOpacity: 0.5,
      }}
    />
  );
}
