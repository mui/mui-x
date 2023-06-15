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
          propName: 'offsetX',
          knob: 'number',
          defaultValue: 0,
        },
        {
          propName: 'offsetY',
          knob: 'number',
          defaultValue: -20,
        },
      ]}
      renderDemo={(props) => (
        <ScatterChart
          series={[
            {
              type: 'scatter',
              label: 'var A',
              data: data.slice(0, 25),
            },
            {
              type: 'scatter',
              label: 'var B',
              data: data.slice(25),
            },
          ]}
          legend={{
            direction: props.direction,
            position: { vertical: props.vertical, horizontal: props.horizontal },
          }}
          margin={{
            top: 70,
            bottom: 70,
            left: 100,
            right: 100,
          }}
          sx={{
            '--ChartsLegend-rootOffsetX':
              typeof props.offsetX === 'number' ? `${props.offsetX}px` : undefined,
            '--ChartsLegend-rootOffsetY':
              typeof props.offsetY === 'number' ? `${props.offsetY}px` : undefined,
          }}
          width={400}
          height={300}
        />
      )}
      getCode={({ props }) => {
        return [
          `import { ScatterChart } from '@mui/x-charts/ScatterChart';`,
          '',
          `<ScatterChart`,
          '  margin={{ top: 70, bottom: 70, left: 100, right:100 }}',
          '  {/** ... */}',
          '  legend={{',
          `    directon: "${props.direction}"`,
          '    position: {',
          `      vertical: "${props.vertical}",`,
          `      horizontal: "${props.horizontal}"`,
          '    }',
          '  }}',
          '  sx={{',
          ...(typeof props.offsetX === 'number'
            ? [`    "--ChartsLegend-rootOffsetX": "${props.offsetX}px",`]
            : []),
          ...(typeof props.offsetY === 'number'
            ? [`    "--ChartsLegend-rootOffsetY": "${props.offsetY}px",`]
            : []),
          '  }}',
          '/>',
        ].join('\n');
      }}
    />
  );
}
