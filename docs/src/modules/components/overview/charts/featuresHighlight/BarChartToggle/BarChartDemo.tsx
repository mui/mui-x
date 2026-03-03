import * as React from 'react';
import { BarChart, BarSeries } from '@mui/x-charts/BarChart';
import { HighlightItemData, HighlightScope } from '@mui/x-charts/context';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { SelectOptions } from './types';

const dataset: Record<'x' | 'a' | 'b' | 'c', number>[] = [
  { x: 0, a: 10, b: 15 },
  { x: 1, a: 5, b: 18 },
  { x: 2, a: 10, b: 10 },
  { x: 3, a: 11, b: 12 },
  { x: 4, a: 8, b: 13 },
  { x: 5, a: 13, b: 5 },
  { x: 6, a: 15, b: 2 },
  { x: 7, a: 14, b: 8 },
  { x: 8, a: 5, b: 15 },
].map((p) => ({ ...p, c: 40 - p.a - p.b }));

const highlightScope: HighlightScope<'bar'> = {
  highlight: 'item',
  fade: 'global',
};

const series = [
  { id: 'A', dataKey: 'a', highlightScope },
  { id: 'B', dataKey: 'b', highlightScope },
  { id: 'C', dataKey: 'c', highlightScope },
] satisfies BarSeries[];

export default function BarChartDemo(props: { selected: SelectOptions }) {
  const [highlightedItem, setHighlightedItem] = React.useState<HighlightItemData | null>(null);

  useEnhancedEffect(() => {
    if (props.selected === 'highlighting') {
      setHighlightedItem({ seriesId: 'B', dataIndex: 2 });
    } else {
      setHighlightedItem(null);
    }
  }, [props.selected]);
  return (
    <BarChart
      dataset={dataset}
      height={160}
      borderRadius={2}
      colors={['var(--palette-color-1)', 'var(--palette-color-3)', 'var(--palette-color-4)']}
      series={props.selected === 'stacking' ? series.map((s) => ({ ...s, stack: 'same' })) : series}
      xAxis={[{ scaleType: 'band', dataKey: 'x', height: 0, disableTicks: true }]}
      yAxis={[{ width: 0, disableTicks: true }]}
      slots={{ tooltip: () => null }}
      highlightedItem={highlightedItem}
      onHighlightChange={setHighlightedItem}
      axisHighlight={{ x: 'none' }}
    />
  );
}
