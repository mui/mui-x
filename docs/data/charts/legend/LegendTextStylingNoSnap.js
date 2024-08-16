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
];

const itemsNumber = 15;

export default function LegendTextStylingNoSnap() {
  return (
    <ChartsUsageDemo
      componentName="Legend"
      data={[
        { propName: 'fontSize', knob: 'number', defaultValue: 14 },
        {
          propName: 'fill',
          knob: 'select',
          defaultValue: 'blue',
          options: ['black', 'blue', 'red', 'green'],
        },
        { propName: 'breakLine', knob: 'switch', defaultValue: false },
      ]}
      renderDemo={(props) => (
        <PieChart
          series={[
            {
              data: data.slice(0, itemsNumber).map((item) => ({
                ...item,
                label: item.label.replace(' ', props.breakLine ? '\n' : ' '),
              })),
            },
          ]}
          slotProps={{
            legend: {
              labelStyle: {
                fontSize: props.fontSize,
                fill: props.fill,
              },
            },
          }}
          margin={{
            top: 10,
            bottom: 10,
            left: 10,
            right: 200,
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
          `  series={[`,
          `    { ..., label: 'series${props.breakLine ? '\\n' : ' '}A'}`,
          `    ...`,
          `  ]}`,
          `  slotProps={{`,
          `    legend: {`,
          `      labelStyle: {`,
          `        fontSize: ${props.fontSize},`,
          `        fill: '${props.fill}',`,
          `      },`,
          `    },`,
          `  }}`,
          '/>',
        ].join('\n');
      }}
    />
  );
}
