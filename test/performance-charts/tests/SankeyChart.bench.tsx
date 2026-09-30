import * as React from 'react';
import { benchmark } from '@mui/internal-benchmark';
import { Unstable_SankeyChart as SankeyChart } from '@mui/x-charts-pro/SankeyChart';

const nodeCount = 30;
const linksPerNode = 3;

const nodes = Array.from({ length: nodeCount }, (_, i) => `node${i}`);
const links: Array<{ source: string; target: string; value: number }> = [];

for (let i = 0; i < nodeCount - 1; i += 1) {
  for (let j = 0; j < Math.min(linksPerNode, nodeCount - i - 1); j += 1) {
    const targetIndex = i + j + 1;
    if (targetIndex < nodeCount) {
      links.push({
        source: nodes[i],
        target: nodes[targetIndex],
        value: i + j + 10,
      });
    }
  }
}

benchmark('SankeyChart with big data amount', () => (
  <SankeyChart
    series={{
      data: {
        links,
      },
    }}
    width={500}
    height={300}
  />
));
