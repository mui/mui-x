import * as React from 'react';
import Box from '@mui/material/Box';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { BarChart } from '@mui/x-charts/BarChart';
import { dataset, valueFormatter } from '../dataset/weather';

const chartSetting = {
  height: 300,
};

export default function AxisTextCustomization() {
  return (
    <ChartsUsageDemo
      componentName="Alert"
      data={{
        angle: { knob: 'number', defaultValue: 45, min: -180, max: 180 },
        textAnchor: {
          knob: 'select',
          defaultValue: 'undefined',
          options: ['undefined', 'start', 'middle', 'end'],
        },
        dominantBaseline: {
          knob: 'select',
          defaultValue: 'undefined',
          options: ['undefined', 'auto', 'central', 'hanging'],
        },
        fontSize: { knob: 'number', defaultValue: 12 },
        labelFontSize: { knob: 'number', defaultValue: 14 },
      }}
      renderDemo={(props) => (
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <BarChart
            dataset={dataset}
            xAxis={[
              {
                dataKey: 'month',
                label: 'months',
                height: 60,
                labelStyle: {
                  fontSize: props.labelFontSize,
                },
                tickLabelStyle: {
                  angle: props.angle,
                  ...(props.textAnchor === 'undefined'
                    ? {}
                    : { textAnchor: props.textAnchor }),
                  ...(props.dominantBaseline === 'undefined'
                    ? {}
                    : { dominantBaseline: props.dominantBaseline }),
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
      getCode={({ props }) => `import { BarChart } from '@mui/x-charts/BarChart';

<ScatterChart
  // ...
  xAxis={[
    {
      labelStyle: {
        fontSize: ${props.labelFontSize},
      },
      tickLabelStyle: {
        angle: ${props.angle},${
          props.textAnchor === 'undefined'
            ? ''
            : `
        textAnchor: '${props.textAnchor}',`
        }${
          props.dominantBaseline === 'undefined'
            ? ''
            : `
        dominantBaseline: '${props.dominantBaseline}',`
        }
        fontSize: ${props.fontSize},
      },
    },
  ]}
/>`}
    />
  );
}
