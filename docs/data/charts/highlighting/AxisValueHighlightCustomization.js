import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import { ChartsAxisHighlightValue } from '@mui/x-charts/ChartsAxisHighlightValue';
import data from '../dataset/random/scatterParallel.json';

export default function AxisValueHighlightCustomization() {
  return (
    <div style={{ width: 400, height: 300, margin: 'auto' }}>
      <ScatterChart
        height={200}
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
        slotProps={{ tooltip: { trigger: 'none' } }}
        axisHighlight={{ x: 'line', y: 'line' }}
      >
        <ChartsReferenceLine
          y={580}
          lineStyle={{ stroke: 'green', strokeWidth: 1 }}
        />
        <ChartsAxisHighlightValue
          axisDirection="y"
          labelPosition="start"
          value={580}
          valueFormatter={() => 'without overflow'}
          sx={{
            translate: '-100% -50%',
            borderRadius: '8px 0 0 8px',
            bgcolor: '#044412',
          }}
        />
        <ChartsAxisHighlightValue
          axisDirection="y"
          labelPosition="end"
          value={580}
          valueFormatter={() => 'with overflow'}
          sx={{ borderRadius: '0 8px 8px 0', bgcolor: '#044412' }}
        />
        <ChartsAxisHighlightValue
          axisDirection="x"
          labelPosition="end"
          value={200}
          valueFormatter={() => 'this uses the max height'}
          sx={{
            p: 0.5,
            bgcolor: '#610909',
            maxWidth: 70,
            maxHeight: 'var(--space)',
            overflow: 'auto',
            pointerEvents: 'auto',
          }}
        />
        <ChartsAxisHighlightValue
          axisDirection="x"
          labelPosition="end"
          value={350}
          valueFormatter={() => 'this one does not'}
          sx={{
            p: 0.5,
            bgcolor: '#610909',
            maxWidth: 50,
          }}
        />
        <ChartsAxisHighlightValue
          axisDirection="x"
          labelPosition="start"
          valueFormatter={(v) => `${Math.round(v)}`}
          sx={{
            translate: '-50% -100%',
            borderRadius: '8px 8px 0 0',
            bgcolor: 'grey',
          }}
        />
      </ScatterChart>
    </div>
  );
}
