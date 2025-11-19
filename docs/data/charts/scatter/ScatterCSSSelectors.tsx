import { ScatterChart, ScatterSeries } from '@mui/x-charts/ScatterChart';
import data from '../dataset/random/scatterParallel.json';

const series: ScatterSeries[] = [
  {
    id: 'series-1',
    label: 'Series A',
    data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
    highlightScope: { highlight: 'item', fade: 'global' },
  },
  {
    id: 'series-2',
    label: 'Series B',
    data: data.map((v) => ({ x: v.x2, y: v.y2, id: v.id })),
    highlightScope: { highlight: 'item', fade: 'global' },
  },
];

export default function ScatterCSSSelectors() {
  return (
    <ScatterChart
      height={300}
      voronoiMaxRadius={30}
      series={series}
      sx={{
        '& [data-faded=true]': { opacity: 0.4 },
        "& [data-series='series-1'] [data-faded=true]": { fill: 'gray' },
        "& [data-series='series-1'] [data-highlighted=true]": {
          stroke: 'blue',
          strokeWidth: 3,
          fill: 'none',
        },
      }}
    />
  );
}
