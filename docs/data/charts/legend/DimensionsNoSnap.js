import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { Chance } from 'chance';

const chance = new Chance(42);

const data = Array.from({ length: 50 }, () => ({
  x: chance.floating({ min: -20, max: 20 }),
  y: chance.floating({ min: -20, max: 20 }),
})).map((d, index) => ({ ...d, id: index }));

const cssVarToKey = {
  '--ChartsLegend-itemWidth': 'item width',
  '--ChartsLegend-itemMarkSize': 'item mark size',
  '--ChartsLegend-labelSpacing': 'label spacing',
  '--ChartsLegend-rootSpacing': 'root spacing',
};
export default function DimensionsNoSnap() {
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
        { propName: 'item width', knob: 'number', defaultValue: 70 },
        { propName: 'item mark size', knob: 'number', defaultValue: 20 },
        { propName: 'label spacing', knob: 'number', defaultValue: 5 },
        { propName: 'root spacing', knob: 'number', defaultValue: 5 },
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
          }}
          margin={{
            top: 100,
            bottom: 30,
          }}
          sx={{
            '--ChartsLegend-itemWidth':
              typeof props['item width'] === 'number'
                ? `${props['item width']}px`
                : undefined,
            '--ChartsLegend-itemMarkSize':
              typeof props['item mark size'] === 'number'
                ? `${props['item mark size']}px`
                : undefined,
            '--ChartsLegend-labelSpacing':
              typeof props['label spacing'] === 'number'
                ? `${props['label spacing']}px`
                : undefined,
            '--ChartsLegend-rootSpacing':
              typeof props['root spacing'] === 'number'
                ? `${props['root spacing']}px`
                : undefined,
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
          '  {/** ... */}',
          '  legend={{',
          `    directon: "${props.direction}"`,
          '  }}',
          '  sx={{',
          ...[
            '--ChartsLegend-itemWidth',
            '--ChartsLegend-itemMarkSize',
            '--ChartsLegend-labelSpacing',
            '--ChartsLegend-rootSpacing',
          ]
            .filter((cssVar) => typeof props[cssVarToKey[cssVar]] === 'number')
            .map((cssVar) => `    '${cssVar}': ${props[cssVarToKey[cssVar]]}px,`),
          '  }}',
          '/>',
        ].join('\n');
      }}
    />
  );
}
