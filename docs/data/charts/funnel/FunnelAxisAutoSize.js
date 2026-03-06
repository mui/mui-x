import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';

export default function FunnelAxisAutoSize() {
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

      <FunnelChart
        series={[funnelSeries]}
        categoryAxis={{
          categories,
          position: 'left',
          disableLine: true,
          disableTicks: true,
          size: useAutoSize ? 'auto' : undefined,
        }}
        height={300}
        hideLegend
      />
    </Box>
  );
}

const categories = [
  'Website visitors',
  'Product page views',
  'Added to cart',
  'Checkout started',
  'Purchase completed',
];

const funnelSeries = {
  data: [
    { value: 10000, label: 'Website visitors' },
    { value: 7500, label: 'Product page views' },
    { value: 3200, label: 'Added to cart' },
    { value: 1800, label: 'Checkout started' },
    { value: 950, label: 'Purchase completed' },
  ],
};
