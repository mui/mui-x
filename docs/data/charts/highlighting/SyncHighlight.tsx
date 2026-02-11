import * as React from 'react';
import Stack from '@mui/material/Stack';
import { BarChart, BarChartProps } from '@mui/x-charts/BarChart';
import { PieChart, PieChartProps } from '@mui/x-charts/PieChart';
import { HighlightItemIdentifier } from '@mui/x-charts/models';

export default function SyncHighlight() {
  const [highlightedIndex, setHighlightedIndex] = React.useState<number | null>(
    null,
  );

  const pieHighlightedItem: HighlightItemIdentifier<'pie'> | null =
    highlightedIndex !== null
      ? { type: 'pie', seriesId: 'sync', dataIndex: highlightedIndex }
      : null;

  const barHighlightedItem: HighlightItemIdentifier<'bar'> | null =
    highlightedIndex !== null
      ? { type: 'bar', seriesId: 'sync', dataIndex: highlightedIndex }
      : null;

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={1}
      sx={{ width: '100%' }}
    >
      <BarChart
        {...barChartsProps}
        highlightedItem={barHighlightedItem}
        onHighlightChange={(item) => setHighlightedIndex(item?.dataIndex ?? null)}
      />
      <PieChart
        {...pieChartProps}
        highlightedItem={pieHighlightedItem}
        onHighlightChange={(item) => setHighlightedIndex(item?.dataIndex ?? null)}
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
