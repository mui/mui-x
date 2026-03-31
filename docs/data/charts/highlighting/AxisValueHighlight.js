import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import { ChartsAxisHighlightValue } from '@mui/x-charts/ChartsAxisHighlightValue';
import data from '../dataset/random/scatterParallel.json';

export default function AxisValueHighlight() {
  return (
    <div style={{ width: 400, height: 400, margin: 'auto' }}>
      <ScatterChart
        height={300}
        series={[
          {
            label: 'Series A',
            data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
          },
          {
            label: 'Series B',
            data: data.map((v) => ({ x: v.x2, y: v.y2, id: v.id })),
          },
        ]}
        // highlightedAxis={[{axis}]}
        axisHighlight={{ x: 'line', y: 'line' }}
      >
        <ChartsReferenceLine x={200} lineStyle={{ stroke: 'red', strokeWidth: 1 }} />
        <ChartsAxisHighlightValue axisDirection="x" labelPosition="both" />
        <ChartsAxisHighlightValue axisDirection="y" labelPosition="both" />
      </ScatterChart>
    </div>
  );
}
