import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import { ChartsAxisHighlightValue } from '@mui/x-charts/ChartsAxisHighlightValue';
import data from '../dataset/random/scatterParallel.json';

function valueFormatter(value: number | Date | string) {
  if (typeof value === 'number') {
    return Math.round(value).toString();
  }
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  return value;
}

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
        slotProps={{ tooltip: { trigger: 'none' } }}
        axisHighlight={{ x: 'line', y: 'line' }}
      >
        <ChartsReferenceLine
          y={200}
          lineStyle={{ stroke: 'red', strokeWidth: 1, strokeDasharray: '4 2' }}
        />
        <ChartsReferenceLine y={0} lineStyle={{ stroke: 'green', strokeWidth: 1 }} />
        <ChartsReferenceLine
          y={500}
          lineStyle={{ stroke: 'green', strokeWidth: 1 }}
        />
        <ChartsAxisHighlightValue
          axisDirection="y"
          labelPosition="end"
          value={200}
          valueFormatter={valueFormatter}
          sx={{ borderRadius: '0 8px 8px 0', bgcolor: 'rgba(255,0,0,0.2)' }}
        />
        <ChartsAxisHighlightValue
          axisDirection="y"
          labelPosition="end"
          value={500}
          valueFormatter={valueFormatter}
          sx={{ borderRadius: '0 8px 8px 0', bgcolor: 'rgba(0,255,0,0.2)' }}
        />
        <ChartsAxisHighlightValue
          axisDirection="y"
          labelPosition="end"
          value={0}
          valueFormatter={valueFormatter}
          sx={{ borderRadius: '0 8px 8px 0', bgcolor: 'rgba(0,255,0,0.2)' }}
        />
        <ChartsAxisHighlightValue
          axisDirection="x"
          labelPosition="both"
          valueFormatter={valueFormatter}
        />
        <ChartsAxisHighlightValue
          axisDirection="y"
          labelPosition="both"
          valueFormatter={valueFormatter}
        />
      </ScatterChart>
    </div>
  );
}
