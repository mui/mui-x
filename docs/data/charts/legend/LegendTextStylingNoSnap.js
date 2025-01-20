// @ts-check

import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { PieChart } from '@mui/x-charts/PieChart';
import { labelMarkClasses } from '@mui/x-charts/ChartsLabel';

const data = [
  { id: 0, value: 10, label: 'Series A' },
  { id: 1, value: 15, label: 'Series B' },
  { id: 2, value: 20, label: 'Series C' },
  { id: 3, value: 10, label: 'Series D' },
];

export default function LegendTextStylingNoSnap() {
  return (
    <ChartsUsageDemo
      componentName="Legend"
      data={[
        { propName: 'fontSize', knob: 'number', defaultValue: 14 },
        {
          propName: 'color',
          knob: 'select',
          defaultValue: 'blue',
          options: ['blue', 'red', 'green'],
        },
        {
          propName: 'markColor',
          knob: 'select',
          defaultValue: 'blue',
          options: ['blue', 'red', 'green'],
        },
      ]}
      renderDemo={(
        /** @type {{  fontSize: number; color: string; markColor: string; }} */
        props,
      ) => (
        <PieChart
          series={[
            {
              data,
            },
          ]}
          height={200}
          width={200}
          slotProps={{
            legend: {
              sx: {
                fontSize: props.fontSize,
                color: props.color,
                [`.${labelMarkClasses.fill}`]: {
                  fill: props.markColor,
                },
              },
            },
          }}
        />
      )}
      getCode={(
        /** @type {{props: {  fontSize: number; color: string; markColor: string;  }}} */
        { props },
      ) => {
        return `
import { PieChart } from '@mui/x-charts/PieChart';
import { labelMarkClasses } from '@mui/x-charts/ChartsLabel';

<PieChart
  {/** ... */}
  slotProps={{
    legend: {
      sx: {
        fontSize: ${props.fontSize},
        color: ${props.color},
        [\`.\${labelMarkClasses.fill}\`]: {
          fill: ${props.markColor},
        },
      },
    },
  }}
/>
`;
      }}
    />
  );
}
