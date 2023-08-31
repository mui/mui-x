import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { Chance } from 'chance';

const chance = new Chance(42);

const data = Array.from({ length: 50 }, () => ({
  x: chance.floating({ min: -20, max: 20 }),
  y: chance.floating({ min: -20, max: 20 }),
})).map((d, index) => ({ ...d, id: index }));

export default function LegendCustomizationNoSnap() {
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
          propName: 'markGap',
          knob: 'number',
          defaultValue: 5,
        },
        {
          propName: 'itemGap',
          knob: 'number',
          defaultValue: 10,
        },
        {
          propName: 'itemMarkWidth',
          knob: 'number',
          defaultValue: 20,
        },
        {
          propName: 'itemMarkHeight',
          knob: 'number',
          defaultValue: 20,
        },
      ]}
      renderDemo={(props) => (
        <ScatterChart
          series={[
            {
              type: 'scatter',
              label: 'variable\nnumber 1',
              data: data.slice(0, 10),
            },
            {
              type: 'scatter',
              label: 'variable B',
              data: data.slice(10, 20),
            },
            {
              type: 'scatter',
              label: 'variable C',
              data: data.slice(20, 30),
            },
            {
              type: 'scatter',
              label: 'variable D',
              data: data.slice(30, 40),
            },
            {
              type: 'scatter',
              label: 'variable E',
              data: data.slice(40),
            },
          ]}
          slotProps={{
            legend: {
              direction: props.direction,
              position: { vertical: props.vertical, horizontal: props.horizontal },
              padding: props.padding,
              markGap: props.markGap,
              itemGap: props.itemGap,
              itemMarkWidth: props.itemMarkWidth,
              itemMarkHeight: props.itemMarkHeight,
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
          `import { ScatterChart } from '@mui/x-charts/ScatterChart';`,
          '',
          `<ScatterChart`,
          '  margin={{ top: 100, bottom: 100, left: 100, right:100 }}',
          '  {/** ... */}',
          `  slotProps={{`,
          `    legend: {`,
          `      direction: ${props.direction},`,
          `      position: { vertical: ${props.vertical}, horizontal: ${props.horizontal} },`,
          `      padding: ${props.padding},`,
          `      markGap: ${props.markGap},`,
          `      itemGap: ${props.itemGap},`,
          `      itemMarkWidth: ${props.itemMarkWidth},`,
          `      itemMarkHeight: ${props.itemMarkHeight},`,
          `    },`,
          `  }}`,
          '/>',
        ].join('\n');
      }}
    />
  );
}
