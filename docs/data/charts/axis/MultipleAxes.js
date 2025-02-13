import * as React from 'react';
import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';

const sample = [1, 10, 30, 50, 70, 90, 100];

export default function MultipleAxes() {
  return (
    <Box sx={{ width: '100%', maxWidth: 500 }}>
      <LineChart
        xAxis={[{ data: sample }]}
        yAxis={[
          { id: 'linearAxis', scaleType: 'linear', position: 'left', width: 40 },
          { id: 'logAxis', scaleType: 'log', position: 'left' },
        ]}
        series={[
          { yAxisId: 'linearAxis', data: sample, label: 'linear' },
          { yAxisId: 'logAxis', data: sample, label: 'log' },
        ]}
        height={400}
      />
    </Box>
  );
}
