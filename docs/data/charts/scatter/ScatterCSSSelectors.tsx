import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { ScatterSeriesType } from '@mui/x-charts/models';
import { data } from './randomData';

const series: ScatterSeriesType[] = [
  {
    id: 'series-1',
    type: 'scatter',
    label: 'Series A',
    data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
    highlightScope: { highlight: 'item', fade: 'global' },
  },
  {
    id: 'series-2',
    type: 'scatter',
    label: 'Series B',
    data: data.map((v) => ({ x: v.x1, y: v.y2, id: v.id })),
    highlightScope: { highlight: 'item', fade: 'global' },
  },
];

export default function ScatterCSSSelectors() {
  return (
    <ScatterChart
      height={300}
      series={series}
      sx={{
        '& [data-faded=true]': {
          opacity: 0.2,
        },
        "& [data-series-id='series-1'][data-highlighted=true]": {
          stroke: 'blue',
          strokeWidth: 3,
          fill: 'none',
        },
      }}
    />
  );
}
