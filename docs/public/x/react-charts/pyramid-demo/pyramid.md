---
title: React Pyramid chart
productId: x-charts
components: FunnelChart, FunnelPlot
---

# Charts - Pyramid [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')🧪

The pyramid chart is a variation of the funnel chart.

:::info
This feature is in preview. It is ready for production use, but its API, visuals and behavior may change in future minor or patch releases.
:::

## Pyramid Chart

To create a pyramid chart, set the `curve` property to `pyramid` in the series.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';

export default function Pyramid() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        series={[
          {
            curve: 'pyramid',
            data: [{ value: 10 }, { value: 100 }, { value: 1000 }, { value: 10000 }],
          },
        ]}
        height={300}
      />
    </Box>
  );
}

```

## Direction

The pyramid automatically changes its direction based on the provided data. If the values are sorted in ascending order, the pyramid is drawn upright.
If the values are sorted in descending order, the pyramid is drawn upside-down.

In order to manually control the direction of the pyramid, the `funnelDirection` property can be set to either `increasing` or `decreasing`.

This is useful when the data is not sorted, or when you want to enforce a specific direction regardless of the data order.

```tsx
import * as React from 'react';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';
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
        return `import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';

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

```

## Segments

By default, the pyramid chart creates segments with the same height. To make the segments proportional to the values, set `categoryAxis.scaleType` to `linear`.
This adjusts the height of each segment based on the value it represents.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';

// datasource: https://ourworldindata.org/grapher/distribution-of-population-between-different-poverty-thresholds-stacke-bar-2011-ppp?country=~OWID_WRL&tableSearch=world

export default function PyramidSegmentLinear() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        series={[
          {
            curve: 'pyramid',
            data: [
              { label: 'Above $30 a day', value: 16 },
              { label: '$10-$30 a day', value: 25 },
              { label: '$1.90-$10 a day', value: 50 },
              { label: 'Below $1.90 a day', value: 9 },
            ],
            funnelDirection: 'increasing',
          },
        ]}
        categoryAxis={{ scaleType: 'linear' }}
        height={300}
      />
    </Box>
  );
}

```

## Styling

A pyramid chart can be styled in all the same ways as the [funnel chart](/x/react-charts/funnel/#styling).

```tsx
import * as React from 'react';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import Stack from '@mui/material/Stack';
import { populationByEducationLevelPercentageSeries } from '../funnel/populationByEducationLevel';

const curveTypes = ['pyramid', 'step-pyramid'] as const;

export default function PyramidPlayground() {
  return (
    <ChartsUsageDemo
      componentName="Pyramid Chart"
      data={
        {
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
        } as const
      }
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
        return `import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';

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

```
