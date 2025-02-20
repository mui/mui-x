// @ts-check
import * as React from 'react';
import Box from '@mui/material/Box';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { BarChart } from '@mui/x-charts/BarChart';
import { dataset, valueFormatter } from '../dataset/weather';

const chartSetting = {
  height: 300,
};

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
      renderDemo={(
        /** @type {{ labelFontSize: number; angle: number; textAnchor: 'start'| 'middle'| 'end'; fontSize: number; }} */
        props,
      ) => (
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <BarChart
            dataset={dataset}
            xAxis={[
              {
                scaleType: 'band',
                dataKey: 'month',
                label: 'months',
                height: 40,
                labelStyle: {
                  fontSize: props.labelFontSize,
                  transform: `translateY(10px)`,
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
            margin={{ bottom: 30 }}
            {...chartSetting}
          />
        </Box>
      )}
      getCode={(
        /** @type {{props: { labelFontSize: number; angle: number; textAnchor: 'start'| 'middle'| 'end'; fontSize: number; }}} */
        { props },
      ) => `import { BarChart } from '@mui/x-charts/BarChart';

<ScatterChart
  // ...
  xAxis={[
    {
      labelStyle: {
        fontSize: ${props.labelFontSize},
      },
      tickLabelStyle: {
        angle: ${props.angle},
        textAnchor: '${props.textAnchor}',
        fontSize: ${props.fontSize},
      },
    },
  ]}
/>`}
    />
  );
}
