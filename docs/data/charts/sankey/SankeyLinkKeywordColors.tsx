import { Unstable_SankeyChart as SankeyChart } from '@mui/x-charts-pro/SankeyChart';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';

const data = {
  nodes: [
    { id: 'Input', label: 'Input' },
    { id: 'ProcessA', label: 'Process A' },
    { id: 'ProcessB', label: 'Process B' },
    { id: 'Output', label: 'Output' },
  ],
  links: [
    { source: 'Input', target: 'ProcessA', value: 30 },
    { source: 'Input', target: 'ProcessB', value: 20 },
    { source: 'ProcessA', target: 'Output', value: 25 },
    { source: 'ProcessB', target: 'Output', value: 15 },
  ],
};

export default function SankeyLinkKeywordColors() {
  return (
    <ChartsUsageDemo
      componentName="SankeyChart"
      data={{
        linkColorMode: {
          knob: 'radio',
          options: ['default', 'source', 'target'],
          defaultValue: 'source',
        },
      }}
      renderDemo={(props) => {
        const linkColor =
          props.linkColorMode === 'default' ? undefined : props.linkColorMode;

        return (
          <SankeyChart
            height={300}
            series={{
              data,
              nodeOptions: {
                showLabels: true,
              },
              linkOptions: {
                color: linkColor,
                opacity: 0.6,
              },
            }}
          />
        );
      }}
      getCode={({ props }) => {
        const linkColor =
          props.linkColorMode === 'default' ? undefined : props.linkColorMode;

        return `import { Unstable_SankeyChart as SankeyChart } from '@mui/x-charts-pro/SankeyChart';

<SankeyChart
  height={300}
  series={{
    data,
    linkOptions: {
      color: ${linkColor ? `'${linkColor}'` : 'undefined'},
      opacity: 0.6,
    },
  }}
/>`;
      }}
    />
  );
}
