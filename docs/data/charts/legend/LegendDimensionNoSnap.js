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
];

const itemsNumber = 15;

export default function LegendDimensionNoSnap() {
  return (
    <ChartsUsageDemo
      componentName="Legend"
      data={[
        {
          propName: 'direction',
          knob: 'select',
          defaultValue: 'column',
          options: ['row', 'column'],
        },
        { propName: 'itemMarkWidth', knob: 'number', defaultValue: 20 },
        { propName: 'itemMarkHeight', knob: 'number', defaultValue: 2 },
        { propName: 'markGap', knob: 'number', defaultValue: 5 },
        { propName: 'itemGap', knob: 'number', defaultValue: 10 },
      ]}
      renderDemo={(props) => (
        <PieChart
          series={[
            {
              data: data.slice(0, itemsNumber),
            },
          ]}
          slotProps={{
            legend: {
              direction: props.direction,
              position: {
                vertical: props.direction === 'row' ? 'top' : 'middle',
                horizontal: props.direction === 'row' ? 'middle' : 'right',
              },
              itemMarkWidth: props.itemMarkWidth,
              itemMarkHeight: props.itemMarkHeight,
              markGap: props.markGap,
              itemGap: props.itemGap,
              padding: 0,
            },
          }}
          margin={{
            top: 100,
            bottom: 10,
            left: 10,
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
          '  margin={{ top: 100, bottom: 10, left: 10, right:100 }}',
          '  {/** ... */}',
          `  slotProps={{`,
          `    legend: {`,
          `      direction: props.direction,`,
          ...(props.direction === 'row'
            ? []
            : [
                `      position: {`,
                `        vertical: 'middle',`,
                `        horizontal: 'right',`,
                `      },`,
              ]),
          `      itemMarkWidth: ${props.itemMarkWidth},`,
          `      itemMarkHeight: ${props.itemMarkHeight},`,
          `      markGap: ${props.markGap},`,
          `      itemGap: ${props.itemGap},`,
          `    }`,
          `  }}`,
          '/>',
        ].join('\n');
      }}
    />
  );
}
