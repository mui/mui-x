---
title: React Heatmap chart
productId: x-charts
components: Heatmap, HeatmapPlot, HeatmapTooltip, HeatmapTooltipContent
---

# Charts - Heatmap [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

Heatmap charts visually represents data with color variations to highlight patterns and trends across two dimensions.

## Basics

Heatmap charts series must contain a `data` property containing an array of 3-tuples.
The first two numbers in each tuple correspond to the x and y indexes of the cell, respectively.
The third number is the value for the given cell.

```jsx
<Heatmap
  series={[
    {
      data: [
        [0, 2, 2.7], // Cell (0, 2) receives the value 2.7
        [1, 2, 4.5], // Cell (1, 2) receives the value 4.5
      ],
    },
  ]}
/>
```

You can specify x and y ticks with the `xAxis` and `yAxis` props.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { Heatmap } from '@mui/x-charts-pro/Heatmap';
import { data } from './dumbData';

export default function BasicHeatmap() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Heatmap
        xAxis={[{ data: [1, 2, 3, 4] }]}
        yAxis={[{ data: ['A', 'B', 'C', 'D', 'E'] }]}
        series={[{ data }]}
        height={300}
      />
    </Box>
  );
}

```

## Color mapping

To customize the color mapping, use the `zAxis` configuration.
You can either use the piecewise or continuous [color mapping](https://mui.com/x/react-charts/styling/#values-color).

```tsx
import * as React from 'react';
import { interpolateBlues } from 'd3-scale-chromatic';
import { Heatmap } from '@mui/x-charts-pro/Heatmap';
import { HeatmapValueType } from '@mui/x-charts-pro/models';

const dataset = [
  {
    london: 59,
    paris: 57,
    newYork: 86,
    seoul: 21,
    month: 'January',
  },
  {
    london: 50,
    paris: 52,
    newYork: 78,
    seoul: 28,
    month: 'February',
  },
  {
    london: 47,
    paris: 53,
    newYork: 106,
    seoul: 41,
    month: 'March',
  },
  {
    london: 54,
    paris: 56,
    newYork: 92,
    seoul: 73,
    month: 'April',
  },
  {
    london: 57,
    paris: 69,
    newYork: 92,
    seoul: 99,
    month: 'May',
  },
  {
    london: 60,
    paris: 63,
    newYork: 103,
    seoul: 144,
    month: 'June',
  },
  {
    london: 59,
    paris: 60,
    newYork: 105,
    seoul: 319,
    month: 'July',
  },
  {
    london: 65,
    paris: 60,
    newYork: 106,
    seoul: 249,
    month: 'August',
  },
  {
    london: 51,
    paris: 51,
    newYork: 95,
    seoul: 131,
    month: 'September',
  },
  {
    london: 60,
    paris: 65,
    newYork: 97,
    seoul: 55,
    month: 'October',
  },
  {
    london: 67,
    paris: 64,
    newYork: 76,
    seoul: 48,
    month: 'November',
  },
  {
    london: 61,
    paris: 70,
    newYork: 103,
    seoul: 25,
    month: 'December',
  },
];

const data = dataset.flatMap(
  ({ london, paris, newYork, seoul }, monthIndex): HeatmapValueType[] => [
    [0, monthIndex, london],
    [1, monthIndex, paris],
    [2, monthIndex, newYork],
    [3, monthIndex, seoul],
  ],
);

const xData = ['London', 'Paris', 'NewYork', 'Seoul'];
const yData = dataset.flatMap(({ month }) => month);

export default function ColorConfig() {
  return (
    <Heatmap
      height={400}
      width={600}
      xAxis={[{ data: xData }]}
      yAxis={[{ data: yData, width: 80 }]}
      series={[{ data }]}
      zAxis={[
        {
          min: 20,
          max: 300,
          colorMap: {
            type: 'continuous',
            color: interpolateBlues,
          },
        },
      ]}
    />
  );
}

```

## Highlight

You can chose to highlight the hovered element by setting `highlightScope.highlight` to `'item'`.
To fade the other item, set `highlightScope.fade` to `'global'`.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { Heatmap } from '@mui/x-charts-pro/Heatmap';
import { data } from './dumbData';

export default function HighlightHeatmap() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Heatmap
        xAxis={[{ data: [1, 2, 3, 4] }]}
        yAxis={[{ data: ['A', 'B', 'C', 'D', 'E'] }]}
        series={[{ data, highlightScope: { highlight: 'item', fade: 'global' } }]}
        height={300}
      />
    </Box>
  );
}

```

By default highlighted/faded effect is obtained by applying the CSS property `filter: saturate(...)` to cells.
To modify this styling, use the `heatmapClasses.highlighted` and `heatmapClasses.faded` CSS classes to override the applied style.

In the following demo, we replace the highlight saturation by a border radius and reduce the saturation of the faded cells.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { Heatmap, heatmapClasses } from '@mui/x-charts-pro/Heatmap';
import { data } from './dumbData';

export default function HighlightClasses() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Heatmap
        sx={{
          [`.${heatmapClasses.cell}`]: {
            [`&.${heatmapClasses.highlighted}`]: {
              filter: 'none', // Remove the default filter effect.
              rx: '10px', // Round the corners
            },
            [`&.${heatmapClasses.faded}`]: {
              filter: 'saturated(95%)', // Reduce the faded default saturation
            },
          },
        }}
        xAxis={[{ data: [1, 2, 3, 4] }]}
        yAxis={[{ data: ['A', 'B', 'C', 'D', 'E'] }]}
        series={[
          {
            data,
            highlightScope: {
              highlight: 'item',
              fade: 'global',
            },
          },
        ]}
        height={300}
      />
    </Box>
  );
}

```

## Common features

The heatmap shares several features with other charts.
This section only explains the details that are specific to the heatmap.
If you'd like to learn more about the shared features, you can visit their dedicated pages.

### Axes

The Heatmap axes can be customized like any other chart axis.
The available options are available in the [axis customization page](/x/react-charts/axis/#axis-customization).

### Tooltip

The Heatmap has an item tooltip that can be customized as described in the [Tooltip documentation page](/x/react-charts/tooltip/).

The only difference of the Heatmap Tooltip is its default content.
You can import the default tooltip, or only its content as follows:

```js
import { HeatmapTooltip, HeatmapTooltipContent } from '@mui/x-charts/Heatmap',
```

The Heatmap has an item tooltip that can be customized as described in the [Tooltip documentation page](/x/react-charts/tooltip/).

The specificity of the Heatmap Tooltip is its default content.
You can import the default tooltip, or only its content as follow:

```js
import { HeatmapTooltip, HeatmapTooltipContent } from '@mui/x-charts/Heatmap',
```

### Legend

The Heatmap comes with a legend which is by default the [ContinuousColorLegend](/x/react-charts/legend/#color-legend).

To display it set `hideLegend` to `false`.
You can modify it with `slots.legend` and `slotProps.legend`.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { Heatmap } from '@mui/x-charts-pro/Heatmap';
import { data } from './dumbData';

export default function HeatmapLegend() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Heatmap
        xAxis={[{ data: [1, 2, 3, 4] }]}
        yAxis={[{ data: ['A', 'B', 'C', 'D', 'E'] }]}
        series={[{ data }]}
        height={300}
        hideLegend={false}
        slotProps={{
          legend: {
            direction: 'vertical',
            position: { vertical: 'middle' },
            sx: { height: 200 },
          },
        }}
      />
    </Box>
  );
}

```

## Custom item

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { Heatmap } from '@mui/x-charts-pro/Heatmap';
import { data } from './dumbData';

function CustomCell(props: any) {
  const { x, y, width, height, ownerState, ...other } = props;

  return (
    <React.Fragment>
      <rect
        {...other}
        x={x + 4}
        y={y + 4}
        width={width - 2 * 4}
        height={height - 2 * 4}
        fill={ownerState.color}
        clipPath={ownerState.isHighlighted ? undefined : 'inset(0px round 10px)'}
      />
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        pointerEvents="none"
      >
        {ownerState.value}
      </text>
    </React.Fragment>
  );
}
export default function CustomItem() {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Heatmap
        slots={{ cell: CustomCell }}
        xAxis={[{ data: [1, 2, 3, 4] }]}
        yAxis={[{ data: ['A', 'B', 'C', 'D', 'E'] }]}
        series={[{ data, highlightScope: { highlight: 'item' } }]}
        height={300}
      />
    </Box>
  );
}

```
