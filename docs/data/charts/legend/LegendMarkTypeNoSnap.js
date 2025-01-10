// @ts-check

import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { BarChart } from '@mui/x-charts/BarChart';

const seriesConfig = [
  { id: 0, data: [10], label: 'Series A' },
  { id: 1, data: [15], label: 'Series B' },
  { id: 2, data: [20], label: 'Series C' },
  { id: 3, data: [10], label: 'Series D' },
];

export default function LegendMarkTypeNoSnap() {
  return (
    <ChartsUsageDemo
      componentName="Legend"
      data={[
        {
          propName: 'markType',
          knob: 'select',
          defaultValue: 'square',
          options: ['square', 'circle', 'line'],
        },
      ]}
      renderDemo={(
        /** @type {{  markType: "square" | "circle" | "line" }} */
        props,
      ) => (
        <BarChart
          series={seriesConfig.map((seriesItem) => ({
            ...seriesItem,
            labelMarkType: props.markType,
          }))}
          xAxis={[
            {
              scaleType: 'band',
              data: ['A'],
            },
          ]}
          height={200}
        />
      )}
      getCode={(
        /** @type {{props: { markType: "square" | "circle" | "line" }}} */
        { props },
      ) => {
        return `
import { BarChart } from '@mui/x-charts/BarChart';

<BarChart
  {/** ... */}
  series={
    seriesConfig.map((seriesItem) => ({
      ...seriesItem,
      labelMarkType: '${props.markType}',
    }))
  }
/>
`;
      }}
    />
  );
}
