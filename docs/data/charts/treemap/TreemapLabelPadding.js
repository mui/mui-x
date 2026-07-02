import Stack from '@mui/material/Stack';
import { Treemap } from '@mui/x-charts-pro/Treemap';
import ChartsUsageDemo from 'docs/src/modules/components/ChartsUsageDemo';

const data = {
  id: 'root',
  children: [
    {
      id: 'A',
      children: [
        { id: 'A1', value: 30 },
        { id: 'A2', value: 20 },
        { id: 'A3', value: 12 },
      ],
    },
    {
      id: 'B',
      children: [
        { id: 'B1', value: 25 },
        { id: 'B2', value: 15 },
      ],
    },
  ],
};

export default function TreemapLabelPadding() {
  return (
    <ChartsUsageDemo
      componentName="Treemap label padding"
      data={{
        labelPadding: { knob: 'slider', defaultValue: 4, min: 0, max: 16 },
      }}
      renderDemo={(props) => (
        <Stack sx={{ width: '100%' }}>
          <Treemap
            series={{ data, nodeOptions: { labelPadding: props.labelPadding } }}
            height={300}
          />
        </Stack>
      )}
      getCode={({ props }) => `import { Treemap } from '@mui/x-charts-pro/Treemap';

<Treemap
  series={{
    // ...
    nodeOptions: { labelPadding: ${props.labelPadding} }
  }}
/>
`}
    />
  );
}
