import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { BarChart } from '@mui/x-charts/BarChart';

const series = [
  { data: [1, 5, 2], stack: 'a' },
  { data: [2, 3, 4], stack: 'a' },
  { data: [3, 2, 3], stack: 'b' },
  { data: [8, 3, 6], stack: 'b' },
  { data: [11, 6, 9] },
];
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
      ]}
      renderDemo={(props) => (
        <BarChart
          series={series}
          width={500}
          height={300}
          margin={{ top: 5 }}
          xAxis={[
            {
              scaleType: 'band',
              data: ['Page 1', 'Page 2', 'Page 3'],
              categoryGapRatio: props.categoryGapRatio,
              barGapRatio: props.barGapRatio,
            },
          ]}
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
          `    }`,
          '/>',
        ].join('\n');
      }}
    />
  );
}
