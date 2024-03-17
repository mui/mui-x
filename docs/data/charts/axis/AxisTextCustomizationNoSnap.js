import * as React from 'react';
import Box from '@mui/material/Box';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { BarChart } from '@mui/x-charts/BarChart';

const chartSetting = {
  height: 300,
};
const dataset = [
  {
    london: 59,
    paris: 57,
    newYork: 86,
    seoul: 21,
    month: 'Jan',
  },
  {
    london: 50,
    paris: 52,
    newYork: 78,
    seoul: 28,
    month: 'Fev',
  },
  {
    london: 47,
    paris: 53,
    newYork: 106,
    seoul: 41,
    month: 'Mar',
  },
  {
    london: 54,
    paris: 56,
    newYork: 92,
    seoul: 73,
    month: 'Apr',
  },
  {
    london: 57,
    paris: 69,
    newYork: 92,
    seoul: 99,
    month: 'May',
  },
  {
    london: 60,
    paris: 63,
    newYork: 103,
    seoul: 144,
    month: 'June',
  },
  {
    london: 59,
    paris: 60,
    newYork: 105,
    seoul: 319,
    month: 'July',
  },
  {
    london: 65,
    paris: 60,
    newYork: 106,
    seoul: 249,
    month: 'Aug',
  },
  {
    london: 51,
    paris: 51,
    newYork: 95,
    seoul: 131,
    month: 'Sept',
  },
  {
    london: 60,
    paris: 65,
    newYork: 97,
    seoul: 55,
    month: 'Oct',
  },
  {
    london: 67,
    paris: 64,
    newYork: 76,
    seoul: 48,
    month: 'Nov',
  },
  {
    london: 61,
    paris: 70,
    newYork: 103,
    seoul: 25,
    month: 'Dec',
  },
];

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
