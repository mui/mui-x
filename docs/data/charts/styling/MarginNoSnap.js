import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { BarChart } from '@mui/x-charts/BarChart';

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
                id: 'x-axis',
                scaleType: 'band',
                data: ['Page 1', 'Page 2', 'Page 3'],
              },
            ]}
            topAxis="x-axis"
            rightAxis={{}}
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
