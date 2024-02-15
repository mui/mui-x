import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import Box from '@mui/material/Box';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

export default function TextPlaygroundNoSnap() {
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
          propName: `fontSize`,
          knob: 'number',
          defaultValue: 40,
          step: 1,
          min: 5,
          max: 50,
        },
        {
          propName: `dx`,
          knob: 'number',
          defaultValue: 0,
          step: 1,
          min: -100,
          max: 100,
        },
        {
          propName: `dy`,
          knob: 'number',
          defaultValue: 0,
          step: 1,
          min: -100,
          max: 100,
        },
      ]}
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
      getCode={({ props }) => {
        return [
          `import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';`,
          '',
          `<Gauge`,
          `  value={${props.value}}`,
          `  startAngle={-110}`,
          `  endAngle={110}`,
          `  sx={{`,
          // eslint-disable-next-line no-template-curly-in-string
          '    [`& .${gaugeClasses.valueText}`]: {',
          `      fontSize: ${props.fontSize},`,
          `      transform: 'translate(${props.dx}px, ${props.dy}px)',`,
          `    },`,
          `  }}`,
          '  text={',
          // eslint-disable-next-line no-template-curly-in-string
          '     ({ value, valueMax }) => `${value} / ${valueMax}`',
          '  }',
          '/>',
        ].join('\n');
      }}
    />
  );
}
