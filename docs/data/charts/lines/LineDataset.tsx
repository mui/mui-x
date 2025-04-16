import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import {
  worldElectricityProduction,
  keyToLabel,
  colors,
} from './worldElectricityProduction';

const stackStrategy = {
  stack: 'total',
  area: true,
  stackOffset: 'none', // To stack 0 on top of others
} as const;

const customize = {
  height: 350,
  hideLegend: true,
};

export default function LineDataset() {
  return (
    <LineChart
      xAxis={[
        {
          dataKey: 'year',
          valueFormatter: (value: number) => value.toString(),
          min: 1985,
          max: 2022,
        },
      ]}
      yAxis={[{ width: 50 }]}
      series={Object.keys(keyToLabel).map((key) => ({
        dataKey: key,
        label: keyToLabel[key],
        color: colors[key],
        showMark: false,
        ...stackStrategy,
      }))}
      dataset={worldElectricityProduction}
      {...customize}
    />
  );
}
