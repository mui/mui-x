import * as React from 'react';
import Typography from '@mui/material/Typography';
import ChartsUsageDemo from 'docs/src/modules/components/ChartsUsageDemo';
import { RadialBarChart } from '@mui/x-charts-premium/RadialBarChart';
import { balanceSheet, addLabels } from '../bars/netflixsBalanceSheet';

const baseSeries = addLabels([
  { dataKey: 'totAss' },
  { dataKey: 'totLia' },
  { dataKey: 'totEq' },
]);

export default function RadialBarConfig() {
  return (
    <ChartsUsageDemo
      componentName="RadialBarChart"
      data={{
        layout: {
          knob: 'select',
          options: ['vertical', 'horizontal'],
          defaultValue: 'vertical',
        },
        stack: {
          knob: 'switch',
          defaultValue: true,
        },
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
          min: -1,
          max: 1,
        },
      }}
      renderDemo={(props) => {
        const series = baseSeries.map((s, index) => ({
          ...s,
          layout: props.layout,
          ...(props.stack && index > 0 ? { stack: 'passive' } : {}),
        }));

        const bandAxis = {
          dataKey: 'year',
          scaleType: 'band',
          categoryGapRatio: props.categoryGapRatio,
          barGapRatio: props.barGapRatio,
        };

        return (
          <div style={{ width: '100%' }}>
            <Typography>Netflix balance sheet</Typography>
            <RadialBarChart
              dataset={balanceSheet}
              series={series}
              height={400}
              rotationAxis={
                props.layout === 'vertical'
                  ? [bandAxis]
                  : [
                      {
                        scaleType: 'linear',
                        endAngle: 270,
                        valueFormatter(value, context) {
                          if (context.location === 'tick') {
                            return `${value / 1_000_000}M`;
                          }
                          return `${value / 1_000}k`;
                        },
                      },
                    ]
              }
              radiusAxis={
                props.layout === 'horizontal'
                  ? [bandAxis]
                  : [
                      {
                        scaleType: 'linear',
                        minRadius: 20,
                        position: 'none',
                        valueFormatter(value, context) {
                          if (context.location === 'tick') {
                            return `${value / 1_000_000}M`;
                          }
                          return `${value / 1_000}k`;
                        },
                      },
                    ]
              }
              grid={{ rotation: true, radius: true }}
            />
          </div>
        );
      }}
      getCode={({ props }) => {
        const stackProp = props.stack ? `, stack: 'passive'` : '';
        const bandAxis = `[
    {
      scaleType: 'band',
      data: ['2020', '2021', '2022', '2023'],
      categoryGapRatio: ${props.categoryGapRatio},
      barGapRatio: ${props.barGapRatio},
    },
  ]`;
        return `import { RadialBarChart } from '@mui/x-charts-premium/RadialBarChart';

<RadialBarChart
  // ...
  series={[
    { dataKey: 'totAss', layout: '${props.layout}' },
    { dataKey: 'totLia', layout: '${props.layout}'${stackProp} },
    { dataKey: 'totEq', layout: '${props.layout}'${stackProp} },
  ]}
  ${props.layout === 'horizontal' ? 'radiusAxis' : 'rotationAxis'}={${bandAxis}}
/>`;
      }}
    />
  );
}
