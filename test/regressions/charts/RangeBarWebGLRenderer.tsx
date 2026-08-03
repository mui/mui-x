import * as React from 'react';
import { BarChartPremium } from '@mui/x-charts-premium/BarChartPremium';

const categories = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth'];

const rangeData: [number, number][] = [
  [-2, 4],
  [0, 6],
  [1, 3],
  [-5, -1],
  [2, 8],
  [-3, 5],
  [4, 7],
  [0, 2],
];

const chartSettings = {
  width: 400,
  height: 300,
  margin: { left: 32 },
  hideLegend: true,
  series: [
    {
      type: 'rangeBar' as const,
      data: rangeData,
      label: 'Range',
    },
  ],
  xAxis: [{ scaleType: 'band' as const, data: categories, height: 8 }],
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
        yAxis={[{ scaleType: 'band', data: categories, width: 24 }]}
        borderRadius={8}
      />
      <BarChartPremium {...chartSettings} renderer="webgl" borderRadius={100} />
    </div>
  );
}
