import * as React from 'react';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import { ChartsReferenceLine } from '@mui/x-charts-pro/ChartsReferenceLine';

const values = [1, 2, 3, 5, 7, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100];

const scales = ['linear', 'sqrt', 'log'] as const;
const series = scales.map((interpolator) => ({
  data: values.map((v) => ({ x: v, y: interpolator, sizeValue: v })),
  sizeAxisId: interpolator,
}));

export default function DifferentSizeScale() {
  return (
    <ScatterChartPro
      height={300}
      grid={{ horizontal: true, vertical: true }}
      // @ts-expect-error - scatter are not supposed to contain string values for now
      series={series}
      yAxis={[{ scaleType: 'band', data: scales }]}
      xAxis={[{ zoom: true }]}
      zAxis={[
        {
          id: 'sqrt',
          sizeMap: {
            type: 'continuous',
            min: 5,
            max: 100,
            size: [2, 30],
            interpolator: 'sqrt',
          },
        },
        {
          id: 'linear',
          sizeMap: {
            type: 'continuous',
            min: 5,
            max: 100,
            size: [2, 30],
            interpolator: 'linear',
          },
        },
        {
          id: 'log',
          sizeMap: {
            type: 'continuous',
            min: 5,
            max: 100,
            size: [2, 30],
            interpolator: 'log',
          },
        },
      ]}
      slots={{ tooltip: () => null }}
    >
      <ChartsReferenceLine x={5} label="min" labelAlign="start" />
    </ScatterChartPro>
  );
}
