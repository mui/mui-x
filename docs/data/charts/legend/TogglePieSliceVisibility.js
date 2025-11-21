import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const data = [
  { id: 0, value: 10, label: 'Series A' },
  { id: 1, value: 15, label: 'Series B' },
  { id: 2, value: 20, label: 'Series C' },
  { id: 3, value: 12, label: 'Series D' },
  { id: 4, value: 8, label: 'Series E' },
];

export default function TogglePieSliceVisibility() {
  const [hiddenItems, setHiddenItems] = React.useState([]);

  const visibleCount = data.length - hiddenItems.length;

  return (
    <Stack direction="column" spacing={2}>
      <PieChart
        series={[{ data }]}
        height={300}
        slotProps={{
          legend: {
            toggleVisibilityOnClick: true,
          },
        }}
        onVisibilityChange={(newHiddenItems) => setHiddenItems(newHiddenItems)}
      />
      <Typography variant="body2" textAlign="center">
        Visible slices: {visibleCount} / {data.length}
      </Typography>
    </Stack>
  );
}
