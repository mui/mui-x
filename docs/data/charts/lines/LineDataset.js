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
};

const customize = {
  height: 300,
  legend: { hidden: true },
  margin: { top: 5 },
  stackingOrder: 'descending',
};

export default function LineDataset() {
  return (
    <LineChart
      xAxis={[
        {
          dataKey: 'year',
          valueFormatter: (value) => value.toString(),
          min: 1985,
          max: 2022,
        },
      ]}
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
