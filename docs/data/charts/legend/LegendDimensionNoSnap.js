// @ts-check

import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { PieChart } from '@mui/x-charts/PieChart';
import { legendClasses } from '@mui/x-charts/ChartsLegend';

const data = [
  { id: 0, value: 10, label: 'Series A' },
  { id: 1, value: 15, label: 'Series B' },
  { id: 2, value: 20, label: 'Series C' },
  { id: 3, value: 10, label: 'Series D' },
  { id: 4, value: 15, label: 'Series E' },
  { id: 5, value: 20, label: 'Series F' },
  { id: 6, value: 10, label: 'Series G' },
  { id: 7, value: 15, label: 'Series H' },
];

const itemsNumber = 8;

export default function LegendDimensionNoSnap() {
  return (
    <ChartsUsageDemo
      componentName="Legend"
      data={[
        {
          propName: 'direction',
          knob: 'select',
          defaultValue: 'horizontal',
          options: ['horizontal', 'vertical'],
        },
        { propName: 'markSize', knob: 'number', defaultValue: 15, min: 0 },
        { propName: 'markGap', knob: 'number', defaultValue: 8, min: 0 },
        { propName: 'itemGap', knob: 'number', defaultValue: 16, min: 0 },
      ]}
      renderDemo={(
        /** @type {{ direction: "horizontal" | "vertical"; markSize: number; markGap: number; itemGap: number; scrollable: boolean;}} */
        props,
      ) => (
        <PieChart
          series={[
            {
              data: data.slice(0, itemsNumber),
            },
          ]}
          slotProps={{
            legend: {
              direction: props.direction,
              sx: {
                gap: `${props.itemGap}px`,
                [`.${legendClasses.mark}`]: {
                  height: props.markSize,
                  width: props.markSize,
                },
                [`.${legendClasses.series}`]: {
                  gap: `${props.markGap}px`,
                },
              },
            },
          }}
          height={200}
          width={200}
        />
      )}
      getCode={(
        /** @type {{ props: { direction: "horizontal" | "vertical"; markSize: number; markGap: number; itemGap: number; scrollable: boolean;}}} */
        { props },
      ) => {
        return `
import { PieChart } from '@mui/x-charts/PieChart';
import { legendClasses } from '@mui/x-charts/ChartsLegend';

<PieChart
  {/** ... */}
  slotProps={{
    legend: {
      direction: props.direction,
      sx: {
        gap: '${props.itemGap}px',
        // CSS-in-JS
        [\`.\${legendClasses.mark}\`]: {
          height: ${props.markSize},
          width: ${props.markSize},
        },
        // CSS class
        ['.${legendClasses.series}']: {
          gap: '${props.markGap}px',
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
