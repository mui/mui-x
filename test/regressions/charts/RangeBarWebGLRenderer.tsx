import * as React from 'react';
import { BarChartPremium } from '@mui/x-charts-premium/BarChartPremium';

const dataset = [
  [-2, 4, 'First'],
  [0, 6, 'Second'],
  [1, 3, 'Third'],
  [-5, -1, 'Fourth'],
  [2, 8, 'Fifth'],
  [-3, 5, 'Sixth'],
  [4, 7, 'Seventh'],
  [0, 2, 'Eighth'],
].map(([low, high, order]) => ({
  range: [low, high] as [number, number],
  order,
}));

const chartSettings = {
  width: 400,
  height: 300,
  margin: { left: 32 },
  dataset,
  hideLegend: true,
  series: [
    {
      type: 'rangeBar' as const,
      dataKey: 'range',
      label: 'Range',
    },
  ],
  xAxis: [{ dataKey: 'order', height: 8 }],
} as const;

export default function RangeBarWebGLRenderer() {
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
