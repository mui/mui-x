import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { render, cleanup } from '@testing-library/react';
import { describe } from 'vitest';
import { Unstable_SankeyChart as SankeyChart } from '@mui/x-charts-pro/SankeyChart';
import { options } from '../utils/options';
import { bench } from '../utils/bench';

describe('SankeyChart', () => {
  const nodeCount = 30;
  const linksPerNode = 3;

  // Generate nodes and links for a large Sankey diagram
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

  bench(
    'SankeyChart with big data amount',
    async () => {
      const { findByText } = render(
        <SankeyChart
          series={{
            data: {
              links,
            },
          }}
          width={500}
          height={300}
        />,
      );

      // Wait for SVG to be rendered
      await findByText('node0');

      cleanup();
    },
    options,
  );
});
