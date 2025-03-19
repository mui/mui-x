import * as React from 'react';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import Stack from '@mui/material/Stack';
import { populationByEducationLevelPercentageSeries } from './populationByEducationLevel';

const curveTypes = ['bump', 'linear', 'step'];

export default function FunnelCurves() {
  return (
    <ChartsUsageDemo
      componentName="Funnel curve"
      data={{
        curveType: {
          knob: 'radio',
          options: curveTypes,
          defaultValue: curveTypes[0],
        },
      }}
      renderDemo={(props) => (
        <Stack sx={{ width: '100%' }}>
          <FunnelChart
            series={[
              {
                curve: props.curveType,
                layout: 'vertical',
                ...populationByEducationLevelPercentageSeries,
              },
            ]}
            height={300}
            slotProps={{ legend: { direction: 'vertical' } }}
          />
          <FunnelChart
            series={[
              {
                curve: props.curveType,
                layout: 'horizontal',
                ...populationByEducationLevelPercentageSeries,
              },
            ]}
            height={300}
            slotProps={{ legend: { direction: 'vertical' } }}
          />
        </Stack>
      )}
      getCode={({ props }) => {
        return `import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';

<FunnelChart
  series={[{ curve: '${props.curveType}' }]}
/>
`;
      }}
    />
  );
}
