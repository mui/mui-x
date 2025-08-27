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

// Sort links by value (descending)
const linkSortFunction = (a, b) => b.value - a.value;

export default function SankeyLinkSorting() {
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
          Default Link Order
        </Typography>
        <SankeyChart height={300} series={{ data }} />
      </div>

      <div>
        <Typography variant="h6" gutterBottom>
          Links Sorted by Value
        </Typography>
        <SankeyChart
          height={300}
          series={{
            data,
            linkOptions: {
              sort: linkSortFunction,
            },
          }}
        />
      </div>
    </div>
  );
}
