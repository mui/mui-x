import * as React from 'react';
import Stack from '@mui/material/Stack';
import { BarChart, BarChartProps } from '@mui/x-charts/BarChart';
import { PieChart, PieChartProps } from '@mui/x-charts/PieChart';
import { HighlightItemIdentifier } from '@mui/x-charts/models';

export default function SyncHighlight() {
  const [highlightedItem, setHighlightedItem] =
    React.useState<HighlightItemIdentifier<'pie' | 'bar'> | null>(null);

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={1}
      sx={{ width: '100%' }}
    >
      <BarChart
        {...barChartsProps}
        highlightedItem={highlightedItem as HighlightItemIdentifier<'bar'> | null}
        onHighlightChange={(item) =>
          setHighlightedItem(
            item ? { seriesId: item.seriesId, dataIndex: item.dataIndex } : null,
          )
        }
      />
      <PieChart
        {...pieChartProps}
        highlightedItem={highlightedItem as HighlightItemIdentifier<'pie'> | null}
        onHighlightChange={(item) =>
          setHighlightedItem(
            item ? { seriesId: item.seriesId, dataIndex: item.dataIndex } : null,
          )
        }
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
