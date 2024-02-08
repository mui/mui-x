import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import Paper from '@mui/material/Paper';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

export default function ArcPlaygroundNoSnap() {
  return (
    <ChartsUsageDemo
      componentName="Gauge"
      data={[
        {
          propName: `value`,
          knob: 'number',
          defaultValue: 75,
          step: 1,
          min: 0,
          max: 100,
        },
        {
          propName: `startAngle`,
          knob: 'number',
          defaultValue: 0,
          step: 1,
          min: -360,
          max: 360,
        },
        {
          propName: `endAngle`,
          knob: 'number',
          defaultValue: 360,
          step: 1,
          min: -360,
          max: 360,
        },
        {
          propName: `innerRadius`,
          knob: 'number',
          defaultValue: 80,
          step: 1,
          min: 0,
          max: 100,
        },
        {
          propName: `outerRadius`,
          knob: 'number',
          defaultValue: 100,
          step: 1,
          min: 0,
          max: 100,
        },
      ]}
      renderDemo={(props) => (
        <Paper
          sx={{
            width: 200,
            height: 200,
            margin: 'auto',
          }}
        >
          <Gauge
            sx={{
              [`& .${gaugeClasses.valueText}`]: {
                fontSize: 45,
              },
            }}
            {...props}
            innerRadius={`${props.innerRadius}%`}
            outerRadius={`${props.outerRadius}%`}
          />
        </Paper>
      )}
      getCode={({ props }) => {
        const { innerRadius, outerRadius, ...numberProps } = props;
        return [
          `import { Gauge } from '@mui/x-charts/Gauge';`,
          '',
          `<Gauge`,
          `  // ...`,
          ...Object.entries(numberProps).map(
            ([name, value]) => `  ${name}={${value}}`,
          ),
          ...Object.entries({ innerRadius, outerRadius }).map(
            ([name, value]) => `  ${name}="${value}%"`,
          ),
          '/>',
        ].join('\n');
      }}
    />
  );
}
