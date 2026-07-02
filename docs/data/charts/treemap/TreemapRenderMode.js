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
      ],
    },
    {
      id: 'B',
      children: [
        { id: 'B1', value: 25 },
        { id: 'B2', value: 15 },
      ],
    },
    {
      id: 'C',
      children: [
        { id: 'C1', value: 18 },
        { id: 'C2', value: 10 },
      ],
    },
  ],
};

export default function TreemapRenderMode() {
  return (
    <ChartsUsageDemo
      componentName="Treemap render mode"
      data={{
        renderMode: {
          knob: 'select',
          defaultValue: 'all',
          options: ['all', 'leaf'],
        },
      }}
      renderDemo={(props) => (
        <Stack sx={{ width: '100%' }}>
          <Treemap
            series={{ data, nodeOptions: { renderMode: props.renderMode } }}
            height={300}
          />
        </Stack>
      )}
      getCode={({ props }) => `import { Treemap } from '@mui/x-charts-pro/Treemap';

<Treemap
  series={{
    // ...
    nodeOptions: { renderMode: '${props.renderMode}' }
  }}
/>
`}
    />
  );
}
