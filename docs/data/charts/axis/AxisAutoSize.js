import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { BarChart } from '@mui/x-charts/BarChart';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export default function AxisAutoSize() {
  const [useAutoSize, setUseAutoSize] = React.useState(true);

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <FormControlLabel
          checked={useAutoSize}
          control={
            <Checkbox onChange={(event) => setUseAutoSize(event.target.checked)} />
          }
          label="Use auto-sizing"
          labelPlacement="end"
        />
      </Stack>

      <BarChart
        xAxis={[
          {
            scaleType: 'band',
            dataKey: 'product',
            label: 'Products',
            height: useAutoSize ? 'auto' : undefined,
          },
        ]}
        yAxis={[
          {
            valueFormatter: (value) => currencyFormatter.format(value),
            label: 'Revenue',
            width: useAutoSize ? 'auto' : undefined,
          },
        ]}
        height={350}
        dataset={dataset}
        series={[
          { dataKey: 'q1', label: 'Q1' },
          { dataKey: 'q2', label: 'Q2' },
          { dataKey: 'q3', label: 'Q3' },
          { dataKey: 'q4', label: 'Q4' },
        ]}
      />
    </Box>
  );
}

const dataset = [
  { product: 'Electronics', q1: 125000, q2: 142000, q3: 158000, q4: 189000 },
  { product: 'Clothing', q1: 89000, q2: 95000, q3: 112000, q4: 145000 },
  { product: 'Home & Garden', q1: 67000, q2: 78000, q3: 85000, q4: 92000 },
  { product: 'Sports', q1: 45000, q2: 52000, q3: 68000, q4: 71000 },
  { product: 'Books', q1: 23000, q2: 28000, q3: 31000, q4: 42000 },
];
