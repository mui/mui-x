import * as React from 'react';
import Stack from '@mui/material/Stack';
import { BarChart, BarChartProps } from '@mui/x-charts/BarChart';
import { PieChart, PieChartProps } from '@mui/x-charts/PieChart';

// Common type for syncing highlights between different chart types
type SyncHighlightItem = { seriesId: string; dataIndex: number } | null;

export default function SyncHighlight() {
  const [highlightedItem, setHighLightedItem] =
    React.useState<SyncHighlightItem>(null);

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={1}
      sx={{ width: '100%' }}
    >
      <BarChart
        {...barChartsProps}
        highlightedItem={highlightedItem as any}
        onHighlightChange={setHighLightedItem as any}
      />
      <PieChart
        {...pieChartProps}
        highlightedItem={highlightedItem as any}
        onHighlightChange={setHighLightedItem as any}
      />
    </Stack>
  );
}

const barChartsProps: BarChartProps = {
  series: [
    {
      data: [3, 4, 1, 6, 5],
      id: 'sync',
      highlightScope: { highlight: 'item', fade: 'global' },
    },
  ],
  xAxis: [{ data: ['A', 'B', 'C', 'D', 'E'] }],
  height: 200,
  hideLegend: true,
};

const pieChartProps: PieChartProps = {
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
      highlightScope: { highlight: 'item', fade: 'global' },
    },
  ],
  height: 150,
  hideLegend: true,
};
