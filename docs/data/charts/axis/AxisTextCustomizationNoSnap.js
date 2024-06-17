import * as React from 'react';
import Box from '@mui/material/Box';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { BarChart } from '@mui/x-charts/BarChart';
import { dataset } from '../dataset/weather';

const chartSetting = {
  height: 300,
};

const valueFormatter = (value) => `${value}mm`;

export default function AxisTextCustomizationNoSnap() {
  return (
    <ChartsUsageDemo
      componentName="Alert"
      data={[
        { propName: 'angle', knob: 'number', defaultValue: 45, min: -180, max: 180 },
        {
          propName: 'textAnchor',
          knob: 'select',
          defaultValue: 'start',
          options: ['start', 'middle', 'end'],
        },
        { propName: 'fontSize', knob: 'number', defaultValue: 12 },
        { propName: 'labelFontSize', knob: 'number', defaultValue: 14 },
      ]}
      renderDemo={(props) => (
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <BarChart
            dataset={dataset}
            xAxis={[
              {
                scaleType: 'band',
                dataKey: 'month',
                label: 'months',
                labelStyle: {
                  fontSize: props.labelFontSize,
                  transform: `translateY(${
                    5 * Math.abs(Math.sin((Math.PI * props.angle) / 180))
                  }px)`,
                },
                tickLabelStyle: {
                  angle: props.angle,
                  textAnchor: props.textAnchor,
                  fontSize: props.fontSize,
                },
              },
            ]}
            series={[
              { dataKey: 'london', label: 'London', valueFormatter },
              { dataKey: 'paris', label: 'Paris', valueFormatter },
              { dataKey: 'newYork', label: 'New York', valueFormatter },
              { dataKey: 'seoul', label: 'Seoul', valueFormatter },
            ]}
            {...chartSetting}
          />
        </Box>
      )}
      getCode={({ props }) =>
        [
          `import { ScatterChart } from '@mui/x-charts/ScatterChart';`,
          '',
          `<ScatterChart`,
          '  {/** ... */}',
          `  bottomAxis={{`,
          `    labelStyle: {`,
          `      fontSize: ${props.labelFontSize},`,
          `      transform: \`translateY(\${
            // Hack that should be added in the lib latter.
            5 * Math.abs(Math.sin((Math.PI * props.angle) / 180))
          }px)\``,
          `    },`,
          `    tickLabelStyle: {`,
          `      angle: ${props.angle},`,
          `      textAnchor: '${props.textAnchor}',`,
          `      fontSize: ${props.fontSize},`,
          `    },`,
          '  }}',
          '/>',
        ].join('\n')
      }
    />
  );
}
