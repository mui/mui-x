import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { ChartsBrushOverlay } from '@mui/x-charts/ChartsBrushOverlay';
import { UseChartBrushSignature, useStore } from '@mui/x-charts/internals';

const scatterData = [
  { x: 10, y: 20, id: 1 },
  { x: 20, y: 35, id: 2 },
  { x: 30, y: 15, id: 3 },
  { x: 40, y: 45, id: 4 },
  { x: 50, y: 25, id: 5 },
  { x: 60, y: 50, id: 6 },
  { x: 70, y: 30, id: 7 },
  { x: 80, y: 55, id: 8 },
];

function BrushSimulator() {
  const store = useStore<[UseChartBrushSignature]>();

  React.useEffect(() => {
    // Simulate brush selection for visual regression test
    store.update({
      brush: {
        enabled: true,
        preventTooltip: true,
        preventHighlight: true,
        start: { x: 150, y: 150 },
        current: { x: 350, y: 250 },
      },
    });
  }, [store]);

  return <ChartsBrushOverlay />;
}

export default function BrushScatter() {
  return (
    <ScatterChart
      width={500}
      height={400}
      series={[
        {
          type: 'scatter',
          data: scatterData,
          id: 'scatter-series',
          label: 'Test Data',
        },
      ]}
      xAxis={[{ id: 'x-axis', min: 0, max: 100 }]}
      yAxis={[{ id: 'y-axis', min: 0, max: 60 }]}
      brushConfig={{ enabled: true }}
    >
      <BrushSimulator />
    </ScatterChart>
  );
}
