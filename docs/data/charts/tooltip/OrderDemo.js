import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { LineChart } from '@mui/x-charts/LineChart';
import { HighlightedCode } from '@mui/docs/HighlightedCode';

const orderOptions = ['none', 'asc', 'desc'];

function getExample(order) {
  return `<LineChart
  slotProps={{ tooltip: { trigger: 'axis', order: '${order}' } }}
  {/* ... */}
/>`;
}

export default function OrderDemo() {
  const [order, setOrder] = React.useState('none');

  return (
    <Box sx={{ p: 2, width: 1, maxWidth: 600 }}>
      <TextField
        select
        label="order"
        value={order}
        sx={{ minWidth: 200, mb: 2 }}
        onChange={(event) => setOrder(event.target.value)}
      >
        {orderOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <LineChart
        xAxis={[{ data: ['page A', 'page B', 'page C', 'page D', 'page E'] }]}
        series={[
          { data: [2, 5, 3, 4, 1], label: 'Series x' },
          { data: [5, 3, 1, null, 10], label: 'Series y' },
          { data: [10, 4, 6, 2, 8], label: 'Series z' },
        ]}
        slotProps={{ tooltip: { trigger: 'axis', order } }}
        height={300}
        hideLegend
        margin={{ top: 20, right: 10 }}
      />
      <HighlightedCode code={getExample(order)} language="tsx" />
    </Box>
  );
}
