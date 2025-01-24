// @ts-check
import * as React from 'react';
import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import Stack from '@mui/material/Stack';
import { populationByEducationLevelPercentage } from './populationByEducationLevel';

const curveTypes = [
  'bumpY',
  'bumpX',
  'linear',
  'catmullRom',
  'monotoneX',
  'monotoneY',
  'natural',
  'step',
  'stepBefore',
  'stepAfter',
];

export default function FunnelCurvesNoSnap() {
  return (
    <ChartsUsageDemo
      componentName="Pie shape"
      data={[
        {
          propName: `curveType`,
          knob: 'radio',
          options: curveTypes,
          defaultValue: curveTypes[0],
        },
      ]}
      renderDemo={(
        /** @type {{ curveType: import('@mui/x-charts/models').CurveType; }} */
        props,
      ) => (
        <Stack sx={{ width: '100%' }}>
          <FunnelChart
            series={[
              {
                curve: props.curveType,
                layout: 'vertical',
                valueFormatter: (item) => `${item.value}%`,
                data: Object.values(populationByEducationLevelPercentage).map(
                  (value) => ({ value }),
                ),
              },
            ]}
            height={300}
          />
          <FunnelChart
            series={[
              {
                curve: props.curveType,
                layout: 'horizontal',
                valueFormatter: (item) => `${item.value}%`,
                data: Object.values(populationByEducationLevelPercentage).map(
                  (value) => ({ value }),
                ),
              },
            ]}
            height={300}
          />
        </Stack>
      )}
      getCode={(
        /** @type {{props:{ curveType: import('@mui/x-charts/models').CurveType; }}} */
        { props },
      ) => {
        return `import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';

<FunnelChart
  series={[
    {
      curve: '${props.curveType}',
      // ...
    },
  ]}
/>
`;
      }}
    />
  );
}
