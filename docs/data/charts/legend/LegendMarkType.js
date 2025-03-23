import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { BarChart } from '@mui/x-charts/BarChart';

const seriesConfig = [
  { id: 0, data: [10], label: 'Series A' },
  { id: 1, data: [15], label: 'Series B' },
  { id: 2, data: [20], label: 'Series C' },
  { id: 3, data: [10], label: 'Series D' },
];

export default function LegendMarkType() {
  return (
    <ChartsUsageDemo
      componentName="Legend"
      data={{
        markType: {
          knob: 'select',
          defaultValue: 'square',
          options: ['square', 'circle', 'line'],
        },
      }}
      renderDemo={(props) => (
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
      getCode={({ props }) => {
        return `import { BarChart } from '@mui/x-charts/BarChart';

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
