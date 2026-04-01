import { SankeyChart } from '@mui/x-charts-pro/SankeyChart';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';

const data = {
  nodes: [
    { id: 'A', label: 'Source A' },
    { id: 'B', label: 'Process B' },
    { id: 'C', label: 'Process C' },
    { id: 'D', label: 'Output D' },
  ],
  links: [
    { source: 'A', target: 'B', value: 15 },
    { source: 'A', target: 'C', value: 10 },
    { source: 'B', target: 'D', value: 12 },
    { source: 'C', target: 'D', value: 8 },
  ],
};

export default function SankeyNodeStyling() {
  return (
    <ChartsUsageDemo
      componentName="SankeyChart"
      data={{
        color: {
          knob: 'input',
          defaultValue: '#1976d2',
        },
        width: {
          knob: 'number',
          defaultValue: 15,
          min: 5,
          max: 50,
        },
        padding: {
          knob: 'number',
          defaultValue: 10,
          min: 0,
          max: 50,
        },
        showLabels: {
          knob: 'switch',
          defaultValue: true,
        },
      }}
      renderDemo={(props) => (
        <SankeyChart
          height={300}
          series={{
            data,
            nodeOptions: {
              color: props.color,
              width: props.width,
              padding: props.padding,
              showLabels: props.showLabels,
            },
          }}
        />
      )}
      getCode={({ props }) => {
        return `import { SankeyChart } from '@mui/x-charts-pro/SankeyChart';

<SankeyChart
  height={300}
  series={{
    data: {
      // ... your data
    },
    nodeOptions: {
      color: '${props.color}',
      width: ${props.width},
      padding: ${props.padding},
      showLabels: ${props.showLabels},
    },
  }}
/>`;
      }}
    />
  );
}
