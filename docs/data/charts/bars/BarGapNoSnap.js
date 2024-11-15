import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { BarChart } from '@mui/x-charts/BarChart';
import { balanceSheet, addLabels } from './netflixsBalanceSheet';

const series = addLabels([
  { dataKey: 'totAss' },
  { dataKey: 'totLia', stack: 'passive' },
  { dataKey: 'totEq', stack: 'passive' },
]);

export default function BarGapNoSnap() {
  return (
    <ChartsUsageDemo
      componentName="Bar gap"
      data={[
        {
          propName: `categoryGapRatio`,
          knob: 'number',
          defaultValue: 0.3,
          step: 0.1,
          min: 0,
          max: 1,
        },
        {
          propName: `barGapRatio`,
          knob: 'number',
          defaultValue: 0.1,
          step: 0.1,
          min: -2,
          max: 5,
        },
        {
          propName: `maxBarSize`,
          knob: 'number',
          defaultValue: 20,
          step: 1,
          min: 0,
          max: 100,
        },
      ]}
      renderDemo={(props) => (
        <BarChart
          dataset={balanceSheet}
          series={series}
          width={500}
          height={300}
          margin={{ top: 15 }}
          xAxis={[
            {
              scaleType: 'band',
              dataKey: 'year',
              categoryGapRatio: props.categoryGapRatio,
              barGapRatio: props.barGapRatio,
              maxBarSize: props.maxBarSize,
            },
          ]}
          yAxis={[{ valueFormatter: (v) => `$ ${v / 1000000}B` }]}
          hideLegend
        />
      )}
      getCode={({ props }) => {
        return [
          `import { BarChart } from '@mui/x-charts/BarChart';`,
          '',
          `<BarChart`,
          `  // ...`,
          `  xAxis={[`,
          `    {`,
          `      scaleType: 'band'`,
          `      data: ['Page 1', 'Page 2', 'Page 3']`,
          `      categoryGapRatio: ${props.categoryGapRatio}`,
          `      barGapRatio: ${props.barGapRatio}`,
          `      maxBarSize: ${props.maxBarSize}`,
          `    }`,
          '/>',
        ].join('\n');
      }}
    />
  );
}
