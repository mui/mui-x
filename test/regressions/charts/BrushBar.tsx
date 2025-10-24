import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { UseChartBrushSignature, useStore } from '@mui/x-charts/internals';
import { ChartsBrushOverlay } from '@mui/x-charts/ChartsBrushOverlay';

const dataset = [
  { month: 'Jan', sales: 45 },
  { month: 'Feb', sales: 52 },
  { month: 'Mar', sales: 38 },
  { month: 'Apr', sales: 61 },
  { month: 'May', sales: 55 },
  { month: 'Jun', sales: 67 },
  { month: 'Jul', sales: 43 },
  { month: 'Aug', sales: 58 },
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
        start: { x: 100, y: 50 },
        current: { x: 300, y: 300 },
      },
    });
  }, [store]);

  return <ChartsBrushOverlay />;
}

export default function BrushBar() {
  return (
    <BarChart
      width={500}
      height={400}
      dataset={dataset}
      series={[{ type: 'bar', dataKey: 'sales', label: 'Sales' }]}
      xAxis={[{ id: 'x-axis', scaleType: 'band', dataKey: 'month' }]}
      brushConfig={{ enabled: true }}
    >
      <BrushSimulator />
    </BarChart>
  );
}
