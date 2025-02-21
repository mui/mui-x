// @ts-check
import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { BarChart } from '@mui/x-charts/BarChart';

const data = ['left', 'right', 'top', 'bottom'].map((propName) => ({
  propName,
  knob: 'number',
  defaultValue: 60,
  step: 1,
  min: 0,
  max: 200,
}));
export default function Margin() {
  return (
    <ChartsUsageDemo
      componentName="Margin demos"
      data={data}
      renderDemo={(
        /** @type {{ left: number; right: number; top: number; bottom: number; }} */
        props,
      ) => (
        <div style={{ width: '100%', margin: 4 }}>
          <BarChart
            series={[{ data: [6, 18, 12] }]}
            height={300}
            margin={{
              left: props.left,
              right: props.right,
              top: props.top,
              bottom: props.bottom,
            }}
            xAxis={[
              {
                id: 'x-axis',
                scaleType: 'band',
                data: ['Page 1', 'Page 2', 'Page 3'],
                position: 'top',
              },
            ]}
            yAxis={[{ position: 'right' }]}
          />
        </div>
      )}
      getCode={(
        /** @type {{props: { left: number; right: number; top: number; bottom: number; }}} */
        { props },
      ) => `import { BarChart } from '@mui/x-charts/BarChart';

<BarChart
  // ...
  margin={{
    left: ${props.left},
    right: ${props.right},
    top: ${props.top},
    bottom: ${props.bottom},
  }}
/>`}
    />
  );
}
