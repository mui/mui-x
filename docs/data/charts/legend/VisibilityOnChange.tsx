import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { VisibilityIdentifier } from '@mui/x-charts/plugins';

const series = [
  { data: [20, 30, 25, 40, 30], label: 'Series A' },
  { data: [15, 25, 20, 35, 20], label: 'Series B' },
  { data: [10, 20, 15, 30, 25], label: 'Series C' },
];

export default function VisibilityOnChange() {
  const [hiddenItems, setHiddenItems] = React.useState<VisibilityIdentifier[]>([]);

  const visibleCount = series.length - hiddenItems.length;

  return (
    <Stack direction="column" spacing={2} width={'100%'}>
      <LineChart
        series={series}
        height={300}
        slotProps={{
          legend: {
            toggleVisibilityOnClick: true,
          },
        }}
        onHiddenItemsChange={(newHiddenItems) => setHiddenItems(newHiddenItems)}
      />
      <Typography variant="body2" textAlign="center">
        Visible series: {visibleCount} / {series.length}
      </Typography>
    </Stack>
  );
}
