import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { PieChart } from '@mui/x-charts/PieChart';

const data = [
  { id: 0, value: 10, label: 'series A' },
  { id: 1, value: 15, label: 'series B' },
  { id: 2, value: 20, label: 'series C' },
  { id: 3, value: 10, label: 'series D' },
  { id: 4, value: 15, label: 'series E' },
  { id: 5, value: 20, label: 'series F' },
  { id: 6, value: 10, label: 'series G' },
  { id: 7, value: 15, label: 'series H' },
  { id: 8, value: 20, label: 'series I' },
  { id: 9, value: 10, label: 'series J' },
  { id: 10, value: 15, label: 'series K' },
  { id: 11, value: 20, label: 'series L' },
  { id: 12, value: 10, label: 'series M' },
  { id: 13, value: 15, label: 'series N' },
  { id: 14, value: 20, label: 'series O' },
];

export default function LegendPositionNoSnap() {
  return (
    <ChartsUsageDemo
      componentName="Legend"
      data={[
        {
          propName: 'direction',
          knob: 'select',
          defaultValue: 'row',
          options: ['row', 'column'],
        },
        {
          propName: 'vertical',
          knob: 'select',
          defaultValue: 'top',
          options: ['top', 'middle', 'bottom'],
        },
        {
          propName: 'horizontal',
          knob: 'select',
          defaultValue: 'middle',
          options: ['left', 'middle', 'right'],
        },
        {
          propName: 'padding',
          knob: 'number',
          defaultValue: 0,
        },
        {
          propName: 'itemsNumber',
          knob: 'number',
          defaultValue: 5,
          min: 1,
          max: data.length,
        },
      ]}
      renderDemo={(props) => (
        <PieChart
          series={[
            {
              data: data.slice(0, props.itemsNumber),
            },
          ]}
          slotProps={{
            legend: {
              direction: props.direction,
              position: { vertical: props.vertical, horizontal: props.horizontal },
              padding: Number.isNaN(props.padding) ? 0 : props.padding,
            },
          }}
          margin={{
            top: 100,
            bottom: 100,
            left: 100,
            right: 100,
          }}
          width={400}
          height={400}
        />
      )}
      getCode={({ props }) => {
        return [
          `import { PieChart } from '@mui/x-charts/PieChart';`,
          '',
          `<PieChart`,
          '  margin={{ top: 100, bottom: 100, left: 100, right:100 }}',
          '  {/** ... */}',
          `  slotProps={{`,
          `    legend: {`,
          `      direction: '${props.direction}',`,
          `      position: { vertical: '${props.vertical}', horizontal: '${props.horizontal}' },`,
          `      padding: ${props.padding},`,
          `    },`,
          `  }}`,
          '/>',
        ].join('\n');
      }}
    />
  );
}
