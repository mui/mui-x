import * as React from 'react';
import { Unstable_SankeyChart as SankeyChart } from '@mui/x-charts-pro/SankeyChart';
import Typography from '@mui/material/Typography';

const data = {
  links: [
    { source: 'C', target: 'Y', value: 10 },
    { source: 'A', target: 'X', value: 25 },
    { source: 'B', target: 'X', value: 10 },
    { source: 'X', target: 'Z', value: 25 },
    { source: 'Y', target: 'Z', value: 8 },
    { source: 'B', target: 'Y', value: 5 },
  ],
};

// Sort nodes alphabetically by label
const nodeSortFunction = (a, b) => {
  const labelA = a.label || a.id;
  const labelB = b.label || b.id;
  return labelA.localeCompare(labelB);
};

export default function SankeyNodeSorting() {
  return (
    <div
      style={{
        gap: '24px',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      <div>
        <Typography variant="h6" gutterBottom>
          Default Node Order
        </Typography>
        <SankeyChart height={300} series={{ data }} />
      </div>

      <div>
        <Typography variant="h6" gutterBottom>
          Nodes Sorted Alphabetically
        </Typography>
        <SankeyChart
          height={300}
          series={{
            data,
            nodeOptions: {
              sort: nodeSortFunction,
            },
          }}
        />
      </div>
    </div>
  );
}
