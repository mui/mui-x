import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { PieChart } from '@mui/x-charts/PieChart';

const data = [
  { id: 0, value: 10, label: 'Series A' },
  { id: 1, value: 15, label: 'Series B' },
  { id: 2, value: 20, label: 'Series C' },
  { id: 3, value: 10, label: 'Series D' },
  { id: 4, value: 15, label: 'Series E' },
  { id: 5, value: 20, label: 'Series F' },
  { id: 6, value: 10, label: 'Series G' },
  { id: 7, value: 15, label: 'Series H' },
  { id: 8, value: 20, label: 'Series I' },
  { id: 9, value: 10, label: 'Series J' },
  { id: 10, value: 15, label: 'Series K' },
  { id: 11, value: 20, label: 'Series L' },
  { id: 12, value: 10, label: 'Series M' },
  { id: 13, value: 15, label: 'Series N' },
  { id: 14, value: 20, label: 'Series O' },
];

export default function LegendPosition() {
  return (
    <ChartsUsageDemo
      componentName="Legend"
      data={
        {
          direction: {
            knob: 'select',
            defaultValue: 'vertical',
            options: ['horizontal', 'vertical'],
          },
          vertical: {
            knob: 'select',
            defaultValue: 'middle',
            options: ['top', 'middle', 'bottom'],
          },
          horizontal: {
            knob: 'select',
            defaultValue: 'center',
            options: ['start', 'center', 'end'],
          },
          itemsNumber: {
            knob: 'number',
            defaultValue: 3,
            min: 1,
            max: data.length,
          },
        } as const
      }
      renderDemo={(props) => (
        <PieChart
          series={[
            {
              data: data.slice(0, props.itemsNumber),
            },
          ]}
          height={200}
          width={200}
          slotProps={{
            legend: {
              direction: props.direction,
              position: { vertical: props.vertical, horizontal: props.horizontal },
            },
          }}
        />
      )}
      getCode={({ props }) => {
        return `import { PieChart } from '@mui/x-charts/PieChart';

<PieChart
  {/** ... */}
  slotProps={{
    legend: {
      direction: '${props.direction}',
      position: { 
        vertical: '${props.vertical}',
        horizontal: '${props.horizontal}'
      }
    }
  }}
/>
`;
      }}
    />
  );
}
