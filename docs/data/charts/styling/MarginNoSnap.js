import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { BarChart } from '@mui/x-charts/BarChart';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '@mui/x-charts/constants';

const data = ['left', 'right', 'top', 'bottom'].map((propName) => ({
  propName,
  knob: 'number',
  defaultValue: 80,
  step: 1,
  min: 0,
  max: 200,
}));
export default function MarginNoSnap() {
  return (
    <ChartsUsageDemo
      componentName="Margin demos"
      data={data}
      renderDemo={(props) => (
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
                id: DEFAULT_X_AXIS_KEY,
                scaleType: 'band',
                data: ['Page 1', 'Page 2', 'Page 3'],
              },
            ]}
            topAxis={DEFAULT_X_AXIS_KEY}
            rightAxis={DEFAULT_Y_AXIS_KEY}
          />
        </div>
      )}
      getCode={({ props }) => {
        return [
          `import { BarChart } from '@mui/x-charts/BarChart';`,
          '',
          `<BarChart`,
          `  // ...`,
          `  margin={{`,
          `    left: ${props.left},`,
          `    right: ${props.right},`,
          `    top: ${props.top},`,
          `    bottom: ${props.bottom},`,
          `  }}`,
          '/>',
        ].join('\n');
      }}
    />
  );
}
