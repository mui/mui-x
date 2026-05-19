import * as React from 'react';
import { BarChartPremium } from '@mui/x-charts-premium/BarChartPremium';

const dataset = [
  [3, -7, 'First'],
  [0, -5, 'Second'],
  [10, 0, 'Third'],
  [9, 6, 'Fourth'],
  [1, 0, 'Fifth'],
  [0, -1, 'Sixth'],
  [1, -1, 'Seventh'],
  [2, -2, 'Eighth'],
].map(([high, low, order]) => ({
  high,
  low,
  order,
}));

const chartSettings = {
  width: 400,
  height: 300,
  margin: { left: 32 },
  dataset,
  hideLegend: true,
  series: [
    { dataKey: 'high', label: 'High', stack: 'stack' },
    { dataKey: 'low', label: 'Low', stack: 'stack' },
  ],
  xAxis: [{ dataKey: 'order', height: 8 }],
} as const;

export default function BarWebGLRenderer() {
  return (
    <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(2, 1fr)' }}>
      <BarChartPremium {...chartSettings} renderer="webgl" borderRadius={0} />
      <BarChartPremium {...chartSettings} renderer="webgl" borderRadius={8} />
      <BarChartPremium
        {...chartSettings}
        renderer="webgl"
        layout="horizontal"
        xAxis={undefined}
        yAxis={[{ scaleType: 'band', dataKey: 'order', width: 24 }]}
        borderRadius={8}
      />
      <BarChartPremium {...chartSettings} renderer="webgl" borderRadius={100} />
    </div>
  );
}
