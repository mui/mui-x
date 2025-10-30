import { Unstable_SankeyChart as SankeyChart } from '@mui/x-charts-pro/SankeyChart';
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

export default function SankeyLinkStyling() {
  return (
    <ChartsUsageDemo
      componentName="SankeyChart"
      data={{
        color: {
          knob: 'input',
          defaultValue: '#90a4ae',
        },
        opacity: {
          knob: 'number',
          defaultValue: 0.8,
          min: 0.1,
          max: 1,
          step: 0.1,
        },
        showValues: {
          knob: 'switch',
          defaultValue: true,
        },
      }}
      renderDemo={(props) => (
        <SankeyChart
          height={300}
          series={{
            data,
            linkOptions: {
              color: props.color,
              opacity: props.opacity,
              showValues: props.showValues,
            },
            nodeOptions: {
              showLabels: false,
            },
          }}
        />
      )}
      getCode={({ props }) => {
        return `import { Unstable_SankeyChart as SankeyChart } from '@mui/x-charts-pro/SankeyChart';

<SankeyChart
  height={300}
  series={{
    data: {
      // ... your data
    },
    linkOptions: {
      color: '${props.color}',
      opacity: ${props.opacity},
      showValues: ${props.showValues},
    },
  }}
/>`;
      }}
    />
  );
}
