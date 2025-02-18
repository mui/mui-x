// @ts-check
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
      renderDemo={(
        /** @type {{ disableLine: boolean; disableTicks: boolean; label: string; tickSize: number; }} */
        props,
      ) => (
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <ScatterChart
            series={[
              {
                type: 'scatter',
                id: 'linear',
                data,
              },
            ]}
            yAxis={[{ position: 'none' }]}
            xAxis={[
              {
                ...defaultXAxis,
                ...props,
              },
            ]}
            height={300}
          />
        </Box>
      )}
      getCode={(
        /** @type {{props: { disableLine: boolean; disableTicks: boolean; label: string; tickSize: number; }}} */
        { props },
      ) => `import { ScatterChart } from '@mui/x-charts/ScatterChart';

<ScatterChart
  // ...
  xAxis={{
    disableLine: ${props.disableLine},
    disableTicks: ${props.disableTicks},
    label: "${props.label}",
    tickSize: ${props.tickSize},
  }}
/>
`}
    />
  );
}
