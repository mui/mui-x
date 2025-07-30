---
title: React Funnel chart
productId: x-charts
components: FunnelChart, FunnelPlot
---

# Charts - Funnel [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')🧪

Funnel charts allow to express quantity evolution along a process, such as audience engagement, population education levels or yields of multiple processes.

:::info
This feature is in preview. It is ready for production use, but its API, visuals and behavior may change in future minor or patch releases.
:::

## Basics

Funnel charts series must contain a `data` property containing an array of objects.
Each object corresponds to a section of the funnel.
It must contain a property `value` and can have other optional properties, like `label` and `id`.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';

export default function BasicFunnel() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        series={[
          {
            data: [{ value: 200 }, { value: 180 }, { value: 90 }, { value: 50 }],
          },
        ]}
        height={300}
      />
    </Box>
  );
}

```

### Display legends

The funnel chart displays a legend by default.
The only requirement is to provide a `label` value in the data objects.

To disable the legend, set the `hideLegend` prop to `true`.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function FunnelLegend() {
  const [hideLegend, setHideLegend] = React.useState(false);

  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Controls hideLegend={hideLegend} setHideLegend={setHideLegend} />
      <FunnelChart
        series={[
          {
            data: [
              { value: 200, label: 'A' },
              { value: 180, label: 'B' },
              { value: 90, label: 'C' },
              { value: 50, label: 'D' },
            ],
          },
        ]}
        hideLegend={hideLegend}
        {...funnelProps}
      />
    </Box>
  );
}

const funnelProps = {
  height: 300,
  slotProps: { legend: { position: { vertical: 'bottom' } } },
} as const;

function Controls({
  hideLegend,
  setHideLegend,
}: {
  hideLegend: boolean;
  setHideLegend: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={hideLegend}
          onChange={() => setHideLegend((prev) => !prev)}
        />
      }
      label="Hide legend"
    />
  );
}

```

## Pyramid Chart

The pyramid chart is a variation of the funnel chart.

To create a pyramid chart, set the `curve` property to `pyramid` in the series.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';

export default function PyramidFunnel() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        series={[
          {
            curve: 'pyramid',
            data: [{ value: 10 }, { value: 90 }, { value: 180 }, { value: 400 }],
          },
        ]}
        height={300}
      />
    </Box>
  );
}

```

## Labels

The funnel chart displays labels by default.
It shows the `value` of the data item in each section.
To format the labels, a `valueFormatter` function can be provided.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';

export default function FunnelLabels() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        series={[
          {
            data: [
              { value: 200, label: 'A' },
              { value: 180, label: 'B' },
              { value: 90, label: 'C' },
              { value: 50, label: 'D' },
            ],
            valueFormatter: (item, context) =>
              `${item.label}${context.dataIndex} ${item.value}.00`,
          },
        ]}
        {...funnelProps}
      />
    </Box>
  );
}

const funnelProps = {
  height: 300,
  hideLegend: true,
} as const;

```

### Styling labels

The labels can be styled by using the `funnelSectionClasses.label` helper.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import {
  Unstable_FunnelChart as FunnelChart,
  funnelSectionClasses,
} from '@mui/x-charts-pro/FunnelChart';

export default function FunnelLabelStyling() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        series={[
          {
            data: [{ value: 200 }, { value: 180 }, { value: 90 }, { value: 50 }],
          },
        ]}
        sx={{
          [`& .${funnelSectionClasses.label}`]: {
            fill: 'white',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          },
        }}
        {...funnelProps}
      />
    </Box>
  );
}

const funnelProps = {
  height: 300,
  hideLegend: true,
} as const;

```

### Positioning labels

The labels can be positioned relative to the section they represent.
The `sectionLabel` property accepts an object with the following properties:

- `position.vertical`: The vertical position of the label. It can be `top`, `center` or `bottom`.
- `position.horizontal`: The horizontal position of the label. It can be `start`, `middle` or `end`.
- `margin`: The margin between the label and the section.
- `dominantBaseline`: The vertical alignment of the text. It can be `auto`, `baseline`, `text-before-edge`, `text-after-edge`, `central`, `hanging`, or `middle`.
- `textAnchor`: The horizontal alignment of the text. It can be `start`, `middle` or `end`.

The `sectionLabel` property can be set to `false` to hide the labels.
It also accepts a function that receives the data object and should return the label configuration.

```tsx
import * as React from 'react';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import Stack from '@mui/material/Stack';

export default function FunnelLabelPositioning() {
  return (
    <ChartsUsageDemo
      componentName="Funnel label positioning"
      data={
        {
          horizontal: {
            knob: 'select',
            defaultValue: 'start',
            options: ['start', 'center', 'end'],
          },
          vertical: {
            knob: 'select',
            defaultValue: 'bottom',
            options: ['top', 'middle', 'bottom'],
          },
          textAnchor: {
            knob: 'select',
            defaultValue: 'start',
            options: ['start', 'middle', 'end'],
          },
          dominantBaseline: {
            knob: 'select',
            defaultValue: 'middle',
            options: [
              'auto',
              'baseline',
              'hanging',
              'middle',
              'central',
              'text-after-edge',
              'text-before-edge',
            ],
          },
          offsetX: {
            knob: 'slider',
            defaultValue: -10,
            min: -50,
            max: 50,
          },
          offsetY: {
            knob: 'slider',
            defaultValue: 10,
            min: -50,
            max: 50,
          },
          hide: {
            knob: 'switch',
          },
        } as const
      }
      renderDemo={(props) => (
        <Stack sx={{ width: '100%' }}>
          <FunnelChart
            series={[
              {
                layout: 'vertical',
                data: [
                  { value: 200, label: 'A' },
                  { value: 180, label: 'B' },
                  { value: 90, label: 'C' },
                  { value: 50, label: 'D' },
                ],
                sectionLabel: props.hide
                  ? false
                  : {
                      position: {
                        horizontal: props.horizontal,
                        vertical: props.vertical,
                      },
                      textAnchor: props.textAnchor,
                      dominantBaseline: props.dominantBaseline,
                      offset: {
                        x: props.offsetX,
                        y: props.offsetY,
                      },
                    },
              },
            ]}
            height={300}
            slotProps={{ legend: { direction: 'vertical' } }}
          />
        </Stack>
      )}
      getCode={({ props }) => {
        if (props.hide) {
          return `import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';

<FunnelChart
  series={[
    {
      sectionLabel: false
    }
  ]}
/>
`;
        }

        return `import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';

<FunnelChart
  // Space to display the labels
  series={[
    {
      sectionLabel: {
        position: {
          horizontal: '${props.horizontal}',
          vertical: '${props.vertical}'
        },
        textAnchor: '${props.textAnchor}',
        dominantBaseline: '${props.dominantBaseline}',
        offset: {
          x: ${props.offsetX},
          y: ${props.offsetY}
        }
      }
    }
  ]}
/>
`;
      }}
    />
  );
}

```

## Styling

### Curve interpolation

The interpolation between data points can be customized by the `curve` property.
This property expects one of the following string values, corresponding to the interpolation method: `'linear'`, `'linear-sharp'`, `'bump'`, `'pyramid'`, `'step'` and `'step-pyramid'`.

This series property adds the option to control the interpolation of a series.

```tsx
import * as React from 'react';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import Stack from '@mui/material/Stack';
import { populationByEducationLevelPercentageSeries } from './populationByEducationLevel';

const curveTypes = [
  'bump',
  'linear',
  'linear-sharp',
  'step',
  'pyramid',
  'step-pyramid',
] as const;

export default function FunnelCurves() {
  return (
    <ChartsUsageDemo
      componentName="Funnel curve"
      data={
        {
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
                curve: props.curveType,
                borderRadius: props.borderRadius,
                layout: 'vertical',
                variant: props.variant,
                funnelDirection: 'increasing',
                ...populationByEducationLevelPercentageSeries,
              },
            ]}
            gap={props.gap}
            height={300}
            slotProps={{ legend: { direction: 'vertical' } }}
          />
          <FunnelChart
            series={[
              {
                curve: props.curveType,
                borderRadius: props.borderRadius,
                layout: 'horizontal',
                variant: props.variant,
                funnelDirection: 'increasing',
                ...populationByEducationLevelPercentageSeries,
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
    curve: '${props.curveType}',
    variant: '${props.variant}',
    ${props.curveType === 'bump' ? '// ' : ''}borderRadius: ${props.borderRadius},
  }]}
  gap={${props.gap}}
/>
`;
      }}
    />
  );
}

```

### Gap

The gap between the sections can be customized by the `gap` property.
It accepts a number that represents the gap in pixels.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';

export default function FunnelGap() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        series={[
          {
            data: [{ value: 200 }, { value: 180 }, { value: 90 }, { value: 50 }],
          },
        ]}
        height={300}
        gap={10}
      />
    </Box>
  );
}

```

### Border radius

The border radius of the sections can be customized by the `borderRadius` property.
It accepts a number that represents the radius in pixels.

- The `bump` curve interpolation will not respect the border radius.
- The `linear`, `linear-sharp` and `pyramid` curves respect the border radius to some extent due to the angle of the sections.
- The `step` and `step-pyramid` curves respect the border radius.

To understand how the border radius interacts with the `curve` prop, see the [curve interpolation example](/x/react-charts/funnel/#curve-interpolation) above.

The `borderRadius` property will also behave differently depending on whether the `gap` property is greater than 0.

- If the `gap` is 0, the border radius will be applied to the corners of the sections that are not connected to another section.
- If the `gap` is greater than 0, the border radius will be applied to all the corners of the sections.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';

export default function FunnelBorderRadius() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        series={[
          {
            data: [{ value: 200 }, { value: 180 }, { value: 90 }, { value: 50 }],
            borderRadius: 10,
          },
        ]}
        height={300}
      />
      <FunnelChart
        series={[
          {
            data: [{ value: 200 }, { value: 180 }, { value: 90 }, { value: 50 }],
            borderRadius: 10,
          },
        ]}
        height={300}
        gap={10}
      />
    </Box>
  );
}

```

### Variant

The funnel sections can be displayed in two different styles using the `variant` property:

- `'filled'` (default): Sections have a solid fill and no stroke.
- `'outlined'`: Sections have a translucent fill with a colored stroke around them.

The `outlined` variant creates a more lightweight visual style.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';

export default function FunnelVariant() {
  const data = [
    { value: 200, label: 'Leads' },
    { value: 150, label: 'Calls' },
    { value: 90, label: 'Meetings' },
    { value: 40, label: 'Deals' },
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        series={[
          {
            data,
            variant: 'outlined',
          },
        ]}
        height={300}
      />
    </Box>
  );
}

```

### Colors

The funnel colors can be customized in two ways.

1. You can provide a [color palette](/x/react-charts/styling/#color-palette). Each section of the funnel will be colored according to this palette.
2. You can provide a `color` property in `data` objects, which overrides the palette.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';

export default function FunnelColor() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        colors={['hotpink', 'red']} // Use custom colors
        series={[
          {
            data: [
              { value: 20 }, // Get color from the palette
              { value: 10, color: 'slateblue' }, // Override palette color (red)
              { value: 5 },
            ],
          },
        ]}
        height={300}
      />
    </Box>
  );
}

```

### CSS

The funnel chart can be styled using CSS.

Each section group has a `data-series` attribute that can be used to target specific series sections.

In order to target specific sections, you can use the `:nth-child` or `:nth-child-of-type` selectors as shown in the example below.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import {
  Unstable_FunnelChart as FunnelChart,
  funnelSectionClasses,
} from '@mui/x-charts-pro/FunnelChart';

export default function FunnelDataAttributes() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        {...funnelProps}
        sx={{
          [`[data-series="main"] .${funnelSectionClasses.root}:nth-of-type(1)`]: {
            fill: 'url(#pattern)',
          },
        }}
      >
        <defs>
          <pattern id="pattern" width="50" height="50" patternUnits="userSpaceOnUse">
            <rect width="100%" height="100%" fill="hotpink" />
            <circle fill="slateblue" cx="15" cy="15" r="10" />
            <circle fill="slateblue" cx="40" cy="40" r="10" />
          </pattern>
        </defs>
      </FunnelChart>
    </Box>
  );
}

const funnelProps = {
  height: 300,
  hideLegend: true,
  series: [
    {
      id: 'main',
      data: [{ value: 200 }, { value: 180 }, { value: 90 }, { value: 50 }],
    },
  ],
} as const;

```

## Multiple funnels

By default, multiple series are displayed on top of each other.

Simply provide multiple series to the funnel chart and make sure that they have different colors or styles to differentiate them.

The order of the series determines the display order.
The first series is at the bottom and the last is at the top.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import {
  Unstable_FunnelChart as FunnelChart,
  FunnelChartProps,
} from '@mui/x-charts-pro/FunnelChart';

export default function FunnelStacked() {
  return (
    <Box sx={{ width: '100%', maxWidth: 500 }}>
      <FunnelChart
        sx={{ '.MuiFunnelSection-series-big': { filter: 'brightness(0.7)' } }}
        series={[
          {
            id: 'big',
            data: dataBig,
            sectionLabel: {
              position: { horizontal: 'end' },
              textAnchor: 'start',
              offset: { x: 10 },
            },
          },
          { data: dataSmall, curve: 'bump' },
        ]}
        height={300}
      />
    </Box>
  );
}

const dataBig: FunnelChartProps['series'][any]['data'] = [
  { value: 500, label: 'A1' },
  { value: 280, label: 'B1' },
  { value: 190, label: 'C1' },
  { value: 70, label: 'D1' },
];

const dataSmall: FunnelChartProps['series'][any]['data'] = [
  { value: 200, label: 'A2' },
  { value: 180, label: 'B2' },
  { value: 90, label: 'C2' },
  { value: 50, label: 'D2' },
];

```

## Highlight

The hovered element can be highlighted by setting `highlightScope.highlight` property to one of the possible values.

To fade elements which are not hovered, set the `highlightScope.fade` property.

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import { FadeOptions, HighlightOptions } from '@mui/x-charts/context';
import { populationByEducationLevelPercentageSeriesLabeled } from './populationByEducationLevel';

export default function HighlightFunnel() {
  const [highlight, setHighlight] = React.useState<HighlightOptions>('item');
  const [fade, setFade] = React.useState<FadeOptions>('global');

  return (
    <Stack spacing={1} sx={{ width: '100%' }}>
      <Stack spacing={1} direction={{ xs: 'column', sm: 'row' }}>
        <FunnelChart
          series={[
            {
              ...populationByEducationLevelPercentageSeriesLabeled,
              highlightScope: {
                highlight,
                fade,
              },
            },
          ]}
          {...funnelChartParams}
        />
        <FunnelChart
          series={[
            {
              ...populationByEducationLevelPercentageSeriesLabeled,
              variant: 'outlined',
              highlightScope: {
                highlight,
                fade,
              },
            },
          ]}
          {...funnelChartParams}
        />
      </Stack>

      <Controls
        highlight={highlight}
        setHighlight={setHighlight}
        fade={fade}
        setFade={setFade}
      />
    </Stack>
  );
}

const funnelChartParams = {
  height: 300,
  hideLegend: true,
};

function Controls({
  highlight,
  setHighlight,
  fade,
  setFade,
}: {
  highlight: string;
  setHighlight: React.Dispatch<React.SetStateAction<HighlightOptions>>;
  fade: string;
  setFade: React.Dispatch<React.SetStateAction<FadeOptions>>;
}) {
  return (
    <Stack
      direction={{ xs: 'row', xl: 'column' }}
      spacing={3}
      justifyContent="center"
      flexWrap="wrap"
      useFlexGap
    >
      <TextField
        select
        label="highlight"
        value={highlight}
        onChange={(event) => setHighlight(event.target.value as HighlightOptions)}
        sx={{ minWidth: 150 }}
      >
        <MenuItem value={'none'}>none</MenuItem>
        <MenuItem value={'item'}>item</MenuItem>
        <MenuItem value={'series'}>series</MenuItem>
      </TextField>
      <TextField
        select
        label="fade"
        value={fade}
        onChange={(event) => setFade(event.target.value as FadeOptions)}
        sx={{ minWidth: 150 }}
      >
        <MenuItem value={'none'}>none</MenuItem>
        <MenuItem value={'series'}>series</MenuItem>
        <MenuItem value={'global'}>global</MenuItem>
      </TextField>
    </Stack>
  );
}

```

## Category axis

The funnel chart uses a category axis as the default axis.
This axis always follows the orientation of the chart.

The funnel chart does not display an axis by default.
To display a category axis, pass a `position` and a list of `categories` to the `categoryAxis` props.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import { populationByEducationLevelPercentageSeriesLabeled } from './populationByEducationLevel';

export default function FunnelCategoryAxis() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        series={[populationByEducationLevelPercentageSeriesLabeled]}
        categoryAxis={{
          categories: ['First', 'Second', 'Third', 'Fourth', 'Fifth'],
          position: 'left',
          disableLine: true,
          disableTicks: true,
          size: 60,
        }}
        {...funnelProps}
      />
    </Box>
  );
}

const funnelProps = {
  height: 300,
  hideLegend: true,
} as const;

```

### Scaled sections

By default, the sections have the same size because they use the `band` scale type.
A linear scale, is also available, and will scale the the sections based on their value.
To do so, set the `scaleType` property to `linear` in the `categoryAxis`.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { Unstable_FunnelChart as FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import { populationByEducationLevelPercentageSeriesLabeled } from './populationByEducationLevel';

export default function FunnelLinearScale() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FunnelChart
        series={[populationByEducationLevelPercentageSeriesLabeled]}
        categoryAxis={{ scaleType: 'linear' }}
        {...funnelProps}
      />
    </Box>
  );
}

const funnelProps = {
  height: 300,
  hideLegend: true,
} as const;

```
