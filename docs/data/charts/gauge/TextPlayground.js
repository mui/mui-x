import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import Box from '@mui/material/Box';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

export default function TextPlayground() {
  return (
    <ChartsUsageDemo
      componentName="Gauge"
      data={{
        value: {
          knob: 'number',
          defaultValue: 75,
          step: 1,
          min: 0,
          max: 100,
        },
        fontSize: {
          knob: 'number',
          defaultValue: 40,
          step: 1,
          min: 5,
          max: 50,
        },
        dx: {
          knob: 'number',
          defaultValue: 0,
          step: 1,
          min: -100,
          max: 100,
        },
        dy: {
          knob: 'number',
          defaultValue: 0,
          step: 1,
          min: -100,
          max: 100,
        },
      }}
      renderDemo={(props) => (
        <Box
          sx={{
            width: '100%',
            height: 200,
            margin: 'auto',
            mb: 4,
          }}
        >
          <Gauge
            startAngle={-110}
            endAngle={110}
            sx={{
              [`& .${gaugeClasses.valueText}`]: {
                fontSize: props.fontSize,
                transform: `translate(${props.dx}px, ${props.dy}px)`,
              },
            }}
            value={props.value}
            text={({ value, valueMax }) => `${value} / ${valueMax}`}
          />
        </Box>
      )}
      getCode={({
        props,
      }) => `import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

<Gauge
  value={${props.value}}
  startAngle={-110}
  endAngle={110}
  sx={{
    [& .${gaugeClasses.valueText}]: {
      fontSize: ${props.fontSize},
      transform: 'translate(${props.dx}px, ${props.dy}px)',
    },
  }}
  text={({ value, valueMax }) => \`\${value} / \${valueMax}\`}
/>
`}
    />
  );
}
