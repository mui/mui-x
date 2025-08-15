import * as React from 'react';
import { Unstable_SankeyChart as SankeyChart } from '@mui/x-charts-pro/SankeyChart';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';

const data = {
  nodes: [],
  links: [
    { source: 'A', target: 'B', value: 2 },
    { source: 'B', target: 'D', value: 4 },
    { source: 'E', target: 'D', value: 4 },
    { source: 'D', target: 'F', value: 1 },
    { source: 'D', target: 'G', value: 7 },
    { source: 'G', target: 'H', value: 2 },
    { source: 'G', target: 'I', value: 5 },
    { source: 'I', target: 'J', value: 3 },
    { source: 'I', target: 'K', value: 2 },
  ],
};

export default function SankeyNodeAlignment() {
  return (
    <ChartsUsageDemo
      componentName="SankeyChart"
      data={{
        align: {
          knob: 'radio',
          defaultValue: 'justify',
          options: ['justify', 'left', 'right', 'center'],
        },
      }}
      renderDemo={(props) => (
        <SankeyChart
          height={400}
          series={{
            data,
            nodeOptions: {
              align: props.align,
            },
          }}
        />
      )}
      getCode={({ props }) => {
        return `import { Unstable_SankeyChart as SankeyChart } from '@mui/x-charts-pro/SankeyChart';

<SankeyChart
  height={400}
  series={{
    data: {
      // ... your data
    },
    nodeOptions: {
      align: '${props.align}',
    },
  }}
/>`;
      }}
    />
  );
}
