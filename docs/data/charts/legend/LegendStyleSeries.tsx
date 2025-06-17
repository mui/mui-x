import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { HighlightItemData } from '@mui/x-charts/context';
import { legendClasses } from '@mui/x-charts/ChartsLegend';

const highlightScope = { highlight: 'series', fade: 'global' } as const;
const settings = {
  series: [
    { id: '0', data: [10, 15], label: 'Series A', highlightScope },
    { id: '1', data: [15, 20], label: 'Series B', highlightScope },
    { id: '2', data: [20, 25], label: 'Series C', highlightScope },
    { id: '3', data: [10, 15], label: 'Series D', highlightScope },
  ],
  xAxis: [{ data: ['Category 1', 'Category 2'] }],
  height: 200,
} as const;

export default function LegendStyleSeries() {
  const [highlightedItem, setHighlightedItem] =
    React.useState<HighlightItemData | null>(null);

  console.log(highlightedItem);

  return (
    <BarChart
      {...settings}
      onHighlightChange={setHighlightedItem}
      sx={
        highlightedItem
          ? {
              [`.${legendClasses.item}:not([data-series="${highlightedItem.seriesId}"])`]:
                {
                  opacity: 0.4,
                },
            }
          : undefined
      }
    />
  );
}
