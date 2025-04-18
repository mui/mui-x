import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { BarChart } from '@mui/x-charts/BarChart';
import { balanceSheet, addLabels } from './netflixsBalanceSheet';

const series = addLabels([
  { dataKey: 'totAss' },
  { dataKey: 'totLia', stack: 'passive' },
  { dataKey: 'totEq', stack: 'passive' },
]);

export default function BarGap() {
  return (
    <ChartsUsageDemo
      componentName="Bar gap"
      data={{
        categoryGapRatio: {
          knob: 'number',
          defaultValue: 0.3,
          step: 0.1,
          min: 0,
          max: 1,
        },
        barGapRatio: {
          knob: 'number',
          defaultValue: 0.1,
          step: 0.1,
          min: -2,
          max: 5,
        },
      }}
      renderDemo={(props) => (
        <BarChart
          dataset={balanceSheet}
          series={series}
          height={300}
          xAxis={[
            {
              scaleType: 'band',
              dataKey: 'year',
              categoryGapRatio: props.categoryGapRatio,
              barGapRatio: props.barGapRatio,
            },
          ]}
          yAxis={[{ valueFormatter: (v: number) => `$ ${v / 1000000}B` }]}
          hideLegend
        />
      )}
      getCode={({ props }) => {
        return `import { BarChart } from '@mui/x-charts/BarChart';

<BarChart
  // ...
  xAxis={[
    {
      scaleType: 'band',
      data: ['Page 1', 'Page 2', 'Page 3'],
      categoryGapRatio: ${props.categoryGapRatio},
      barGapRatio: ${props.barGapRatio},
    },
  ]}
/>`;
      }}
    />
  );
}
