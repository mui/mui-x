import * as React from 'react';
import Box from '@mui/material/Box';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { Chance } from 'chance';

const chance = new Chance(42);

const data = Array.from({ length: 200 }, () => ({
  x: chance.floating({ min: -25, max: 25 }),
  y: chance.floating({ min: -25, max: 25 }),
})).map((d, index) => ({ ...d, id: index }));

const defaultXAxis = {
  disableLine: false,
  disableTicks: false,
  fontSize: 12,
  label: 'My axis',
  tickSize: 6,
};
export default function AxisCustomizationNoSnap() {
  return (
    <ChartsUsageDemo
      componentName="Alert"
      data={[
        { propName: 'disableLine', knob: 'switch', defaultValue: false },
        { propName: 'disableTicks', knob: 'switch', defaultValue: false },
        { propName: 'label', knob: 'input', defaultValue: 'my axis' },
        { propName: 'tickSize', knob: 'number', defaultValue: 6 },
      ]}
      renderDemo={(props) => (
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <ScatterChart
            series={[
              {
                type: 'scatter',
                id: 'linear',
                data,
              },
            ]}
            leftAxis={null}
            bottomAxis={{
              ...defaultXAxis,
              ...props,
            }}
            height={300}
            margin={{ top: 10, left: 20, right: 20 }}
          />
        </Box>
      )}
      getCode={({ props }) =>
        [
          `import { ScatterChart } from '@mui/x-charts/ScatterChart';`,
          '',
          `<ScatterChart`,
          '  {/** ... */}',
          `  bottomAxis={{`,
          ...Object.keys(props)
            .filter((prop) => props[prop] !== defaultXAxis[prop])
            .map(
              (prop) =>
                `    ${prop}: ${
                  typeof props[prop] === 'string' ? `"${props[prop]}"` : props[prop]
                },`,
            ),
          '  }}',
          '/>',
        ].join('\n')
      }
    />
  );
}
