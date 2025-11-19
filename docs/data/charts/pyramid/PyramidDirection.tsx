import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import Stack from '@mui/material/Stack';
import { populationByEducationLevelPercentageSeries } from '../funnel/populationByEducationLevel';

export default function PyramidDirection() {
  return (
    <ChartsUsageDemo
      componentName="Pyramid Chart"
      data={
        {
          direction: {
            displayName: 'Direction',
            knob: 'radio',
            options: ['auto', 'increasing', 'decreasing'],
            defaultValue: 'auto',
          },
        } as const
      }
      renderDemo={(props) => (
        <Stack sx={{ width: '100%' }}>
          <FunnelChart
            series={[
              {
                data: populationByEducationLevelPercentageSeries.data,
                curve: 'pyramid',
                funnelDirection: props.direction,
              },
            ]}
            height={300}
          />
        </Stack>
      )}
      getCode={({ props }) => {
        return `import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';

<FunnelChart
  series={[{
    curve: 'pyramid',
    funnelDirection: '${props.direction}',
    ...
  }]}
/>
`;
      }}
    />
  );
}
