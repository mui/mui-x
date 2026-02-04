import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import Stack from '@mui/material/Stack';
import { populationByEducationLevelPercentageSeries } from '../funnel/populationByEducationLevel';

const curveTypes = ['pyramid', 'step-pyramid'];

export default function PyramidPlayground() {
  return (
    <ChartsUsageDemo
      componentName="Pyramid Chart"
      data={{
        direction: {
          knob: 'radio',
          options: ['vertical', 'horizontal'],
          defaultValue: 'vertical',
        },
        curveType: {
          knob: 'radio',
          options: curveTypes,
          defaultValue: curveTypes[0],
        },
        gap: {
          knob: 'slider',
          defaultValue: 0,
          min: 0,
          max: 20,
        },
        borderRadius: {
          knob: 'slider',
          defaultValue: 0,
          min: 0,
          max: 20,
        },
        variant: {
          knob: 'select',
          options: ['filled', 'outlined'],
          defaultValue: 'filled',
        },
      }}
      renderDemo={(props) => (
        <Stack sx={{ width: '100%' }}>
          <FunnelChart
            series={[
              {
                layout: props.direction,
                curve: props.curveType,
                variant: props.variant,
                borderRadius: props.borderRadius,
                data: [...populationByEducationLevelPercentageSeries.data].reverse(),
              },
            ]}
            gap={props.gap}
            height={300}
            slotProps={{ legend: { direction: 'vertical' } }}
          />
        </Stack>
      )}
      getCode={({ props }) => {
        return `import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';

<FunnelChart
  series={[{ 
    layout: '${props.direction}',
    curve: '${props.curveType}',
    variant: '${props.variant}',
    borderRadius: ${props.borderRadius},
  }]}
  gap={${props.gap}}
/>
`;
      }}
    />
  );
}
