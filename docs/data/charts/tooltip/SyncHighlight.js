import * as React from 'react';
import Stack from '@mui/material/Stack';

import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';

export default function SyncHighlight() {
  const [highlightedItem, setHighLightedItem] = React.useState(null);

  return (
    <Stack
      direction={{ xs: 'column', xl: 'row' }}
      spacing={1}
      sx={{ width: '100%' }}
    >
      <BarChart
        {...barChartsProps}
        highlightedItem={highlightedItem}
        onHighlightChange={setHighLightedItem}
      />
      <PieChart
        {...pieChartProps}
        highlightedItem={highlightedItem}
        onHighlightChange={setHighLightedItem}
      />
    </Stack>
  );
}

const barChartsProps = {
  series: [
    {
      data: [3, 4, 1, 6, 5],
      id: 'sync',
      highlightScope: { highlighted: 'item', faded: 'global' },
    },
  ],
  xAxis: [{ scaleType: 'band', data: ['A', 'B', 'C', 'D', 'E'] }],
  height: 400,
  slotProps: {
    legend: {
      hidden: true,
    },
  },
};

const pieChartProps = {
  series: [
    {
      id: 'sync',
      data: [
        { value: 3, label: 'A', id: 'A' },
        { value: 4, label: 'B', id: 'B' },
        { value: 1, label: 'C', id: 'C' },
        { value: 6, label: 'D', id: 'D' },
        { value: 5, label: 'E', id: 'E' },
      ],
      highlightScope: { highlighted: 'item', faded: 'global' },
    },
  ],
  height: 400,
  slotProps: {
    legend: {
      hidden: true,
    },
  },
};
