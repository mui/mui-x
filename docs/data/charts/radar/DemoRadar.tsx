import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { Unstable_RadarChart as RadarChart } from '@mui/x-charts/RadarChart';

export default function DemoRadar() {
  const theme = useTheme();

  const stripeColorFunction = {
    default: undefined,
    'two-tones':
      theme.palette.mode === 'dark'
        ? (index: number) =>
            index % 2 === 0
              ? (theme.vars || theme).palette.primary.dark
              : (theme.vars || theme).palette.grey[300]
        : (index: number) =>
            index % 2 === 0
              ? (theme.vars || theme).palette.primary.light
              : (theme.vars || theme).palette.grey[800],
    null: null,
  };
  const stripeColorLines = {
    default: [],
    'two-tones':
      theme.palette.mode === 'dark'
        ? [
            `  stripeColor={(index:number) => index % 2 === 0 ? theme.palette.primary.dark : theme.palette.grey[300]}`,
          ]
        : [
            `  stripeColor={(index:number) => index % 2 === 0 ? theme.palette.primary.light : theme.palette.grey[800]}`,
          ],
    null: [`  stripeColor={null}`],
  };

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
          options: ['default', 'two-tones', 'null'] as const,
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
            stripeColor={stripeColorFunction[props.stripe]}
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
          ...stripeColorLines[props.stripe],
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
