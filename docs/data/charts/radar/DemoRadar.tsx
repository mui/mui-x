import * as React from 'react';
import Box from '@mui/material/Box';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { Unstable_RadarChart as RadarChart } from '@mui/x-charts/RadarChart';

const getStripeColorFunction = {
  default: undefined,
  'two-tons': (index: number) => (index % 2 === 0 ? 'gray' : 'darkblue'),
  null: null,
};
const getStripeColorLines = {
  default: [],
  'two-tons': [
    `  getStripeColor={(index:number) => index % 2 === 0 ? 'gray' : 'darkblue'}`,
  ],
  null: [`  getStripeColor={null}`],
};

export default function DemoRadar() {
  return (
    <ChartsUsageDemo
      componentName="RadarChart"
      data={{
        startAngle: {
          knob: 'number',
          defaultValue: 30,
          min: -180,
          max: 180,
        },
        divisions: {
          knob: 'number',
          defaultValue: 10,
          min: 0,
          max: 20,
        },
        shape: {
          knob: 'radio',
          options: ['sharp', 'circular'] as const,
          defaultValue: 'circular',
        },
        stripe: {
          knob: 'select',
          options: ['default', 'two-tons', 'null'] as const,
          defaultValue: 'default',
        },
      }}
      renderDemo={(props) => (
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <RadarChart
            height={250}
            margin={{ top: 20 }}
            series={[{ data: [120, 98, 86, 99, 85, 65] }]}
            divisions={props.divisions}
            getStripeColor={getStripeColorFunction[props.stripe]}
            shape={props.shape}
            radar={{
              max: 120,
              startAngle: props.startAngle,
              metrics: [
                'Math',
                'Chinese',
                'English',
                'Geography',
                'Physics',
                'History',
              ],
            }}
          />
        </Box>
      )}
      getCode={({ props }) =>
        [
          `import { Unstable_RadarChart as RadarChart } from '@mui/x-charts/RadarChart';`,
          '',
          `<RadarChart`,
          '  {/** ... */}',
          `  shape="${props.shape}"`,
          `  divisions={${props.divisions}}`,
          ...getStripeColorLines[props.stripe],
          `  radar={{`,
          `    startAngle: ${props.startAngle},`,
          `    metrics: [...],`,
          '  }}',
          '/>',
        ].join('\n')
      }
    />
  );
}
