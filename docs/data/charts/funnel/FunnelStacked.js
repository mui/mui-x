import * as React from 'react';
import Box from '@mui/material/Box';
import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';

export default function FunnelStacked() {
  return (
    <Box sx={{ width: '100%', maxWidth: 500 }}>
      <FunnelChart
        sx={{ '.MuiFunnelSection-series-big': { filter: 'brightness(0.7)' } }}
        series={[
          {
            id: 'big',
            data: dataBig,
            sectionLabel: {
              position: { horizontal: 'end' },
              textAnchor: 'start',
              offset: { x: -10 },
            },
          },
          { data: dataSmall },
        ]}
        height={300}
      />
    </Box>
  );
}

const dataBig = [
  { value: 500, label: 'A1' },
  { value: 280, label: 'B1' },
  { value: 190, label: 'C1' },
  { value: 70, label: 'D1' },
];

const dataSmall = [
  { value: 200, label: 'A2' },
  { value: 180, label: 'B2' },
  { value: 90, label: 'C2' },
  { value: 50, label: 'D2' },
];
