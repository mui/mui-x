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
    {
      id: 'C',
      children: [
        { id: 'C1', value: 18 },
        { id: 'C2', value: 10 },
      ],
    },
  ],
};

export default function TreemapStyling() {
  return (
    <ChartsUsageDemo
      componentName="Treemap padding and radius"
      data={{
        borderRadius: { knob: 'slider', defaultValue: 4, min: 0, max: 20 },
        paddingInner: { knob: 'slider', defaultValue: 2, min: 0, max: 20 },
        paddingOuter: { knob: 'slider', defaultValue: 2, min: 0, max: 20 },
        paddingTop: { knob: 'slider', defaultValue: 24, min: 0, max: 40 },
        labelPadding: { knob: 'slider', defaultValue: 4, min: 0, max: 16 },
      }}
      renderDemo={(props) => (
        <Stack sx={{ width: '100%' }}>
          <Treemap
            series={{
              data,
              tiling: {
                paddingInner: props.paddingInner,
                paddingOuter: props.paddingOuter,
                paddingTop: props.paddingTop,
              },
              nodeOptions: {
                borderRadius: props.borderRadius,
                labelPadding: props.labelPadding,
              },
            }}
            height={320}
          />
        </Stack>
      )}
      getCode={({ props }) => `import { Treemap } from '@mui/x-charts-pro/Treemap';

<Treemap
  series={{
    // ...
    tiling: {
      paddingInner: ${props.paddingInner},
      paddingOuter: ${props.paddingOuter},
      paddingTop: ${props.paddingTop}
    },
    nodeOptions: { borderRadius: ${props.borderRadius}, labelPadding: ${props.labelPadding} }
  }}
/>
`}
    />
  );
}
