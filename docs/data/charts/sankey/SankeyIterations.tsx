import { Unstable_SankeyChart as SankeyChart } from '@mui/x-charts-pro/SankeyChart';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';

const data = {
  nodes: [
    { id: 'A', label: 'Energy' },
    { id: 'B', label: 'Coal' },
    { id: 'C', label: 'Gas' },
    { id: 'D', label: 'Oil' },
    { id: 'E', label: 'Electricity' },
    { id: 'F', label: 'Heat' },
    { id: 'G', label: 'Residential' },
    { id: 'H', label: 'Commercial' },
    { id: 'I', label: 'Industrial' },
  ],
  links: [
    { source: 'A', target: 'B', value: 30 },
    { source: 'A', target: 'C', value: 25 },
    { source: 'A', target: 'D', value: 20 },
    { source: 'B', target: 'E', value: 25 },
    { source: 'C', target: 'E', value: 20 },
    { source: 'C', target: 'F', value: 5 },
    { source: 'D', target: 'F', value: 18 },
    { source: 'E', target: 'G', value: 15 },
    { source: 'E', target: 'H', value: 20 },
    { source: 'E', target: 'I', value: 10 },
    { source: 'F', target: 'G', value: 8 },
    { source: 'F', target: 'H', value: 10 },
    { source: 'F', target: 'I', value: 5 },
  ],
};

export default function SankeyIterations() {
  return (
    <ChartsUsageDemo
      componentName="SankeyChart"
      data={{
        iterations: {
          knob: 'slider',
          defaultValue: 32,
          min: 1,
          max: 100,
        },
      }}
      renderDemo={(props) => (
        <SankeyChart
          height={400}
          series={{
            data,
            iterations: props.iterations,
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
    iterations: ${props.iterations},
  }}
/>`;
      }}
    />
  );
}
