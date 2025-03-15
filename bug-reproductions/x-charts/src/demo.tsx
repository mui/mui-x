import * as React from 'react';
import Box from '@mui/material/Box';
import { BarChart } from '@mui/x-charts';

export default function Demo() {
  return (
    <Box sx={{ height: 520, width: '100%' }}>
      <BarChart
        xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
        series={[
          { label: 'first', data: [4, 3, 5] },
          { label: 'second', data: [1, 6, 3] },
          { label: 'third', data: [2, 5, 6] },
        ]}
        width={500}
        height={300}
      />
    </Box>
  );
}
