import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { earthquakeData } from '../dataset/earthquakeData';

const otherSetting = {
  height: 300,
  grid: { horizontal: true },
};
const data = Object.entries(earthquakeData).reduce((acc, [magnitude, events]) => {
  acc.push({ x: magnitude, y: events });

  return acc;
}, []);

const formatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export default function FormatterDemo() {
  return (
    <ScatterChart
      xAxis={[{ height: 40 }]}
      yAxis={[
        {
          scaleType: 'log',
          valueFormatter(value, context) {
            if (context.location === 'tick' && context.defaultTickLabel === '') {
              return '';
            }

            return formatter.format(value);
          },
        },
      ]}
      series={[{ label: 'Seoul rainfall', data }]}
      {...otherSetting}
    />
  );
}
