import * as React from 'react';
import Box from '@mui/material/Box';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';

export default function FunnelLabels() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        series={[
          {
            data: [
              { value: 200, label: 'A' },
              { value: 180, label: 'B' },
              { value: 90, label: 'C' },
              { value: 50, label: 'D' },
            ],
            valueFormatter: (item, context) =>
              `${item.label}${context.dataIndex} ${item.value}.00`,
          },
        ]}
        {...funnelProps}
      />
    </Box>
  );
}

const funnelProps = {
  height: 300,
  hideLegend: true,
};
