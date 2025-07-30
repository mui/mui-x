---
title: React Scatter chart
productId: x-charts
components: ScatterChart, ScatterChartPro, ScatterPlot, ChartsGrid
---

# Charts - Scatter

Scatter charts express the relation between two variables, using points in a surface.

## Basics

Scatter chart series should contain a `data` property containing an array of objects.
Those objects require the `x` and `y` properties.
With an optional `id` property if more optimization is needed.

```tsx
import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { data } from './randomData';

export default function BasicScatter() {
  return (
    <ScatterChart
      height={300}
      series={[
        {
          label: 'Series A',
          data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
        },
        {
          label: 'Series B',
          data: data.map((v) => ({ x: v.x1, y: v.y2, id: v.id })),
        },
      ]}
    />
  );
}

```

### Using a dataset

If your data is stored in an array of objects, you can use the `dataset` helper prop.
It accepts an array of objects such as `dataset={[{a: 1, b: 32, c: 873}, {a: 2, b: 41, c: 182}, ...]}`.

You can reuse this data when defining the series.
The scatter series work a bit differently than in other charts.
You need to specify the `datasetKeys` properties which is an object that requires the `x` and `y` keys.
With an optional `id` and `z` keys if needed.

```tsx
import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

export default function ScatterDataset() {
  return (
    <ScatterChart
      dataset={dataset}
      series={[
        { datasetKeys: { id: 'version', x: 'a1', y: 'a2' }, label: 'Series A' },
        { datasetKeys: { id: 'version', x: 'b1', y: 'b2' }, label: 'Series B' },
      ]}
      {...chartSetting}
    />
  );
}

const dataset = [
  {
    version: 'data-0',
    a1: 329.39,
    a2: 391.29,
    b1: 443.28,
    b2: 153.9,
  },
  {
    version: 'data-1',
    a1: 96.94,
    a2: 139.6,
    b1: 110.5,
    b2: 217.8,
  },
  {
    version: 'data-2',
    a1: 336.35,
    a2: 282.34,
    b1: 175.23,
    b2: 286.32,
  },
  {
    version: 'data-3',
    a1: 159.44,
    a2: 384.85,
    b1: 195.97,
    b2: 325.12,
  },
  {
    version: 'data-4',
    a1: 188.86,
    a2: 182.27,
    b1: 351.77,
    b2: 144.58,
  },
  {
    version: 'data-5',
    a1: 143.86,
    a2: 360.22,
    b1: 43.253,
    b2: 146.51,
  },
  {
    version: 'data-6',
    a1: 202.02,
    a2: 209.5,
    b1: 376.34,
    b2: 309.69,
  },
  {
    version: 'data-7',
    a1: 384.41,
    a2: 258.93,
    b1: 31.514,
    b2: 236.38,
  },
  {
    version: 'data-8',
    a1: 256.76,
    a2: 70.571,
    b1: 231.31,
    b2: 440.72,
  },
  {
    version: 'data-9',
    a1: 143.79,
    a2: 419.02,
    b1: 108.04,
    b2: 20.29,
  },
];

const chartSetting = {
  yAxis: [
    {
      label: 'rainfall (mm)',
      width: 60,
    },
  ],
  height: 300,
};

```

## Interaction

Since scatter elements can be small, interactions do not require hovering exactly over an element.
When the pointer is in the drawing area, the closest scatter element will be used for interactions (tooltip or highlights).
To do so, the chart computes [Voronoi cells](https://en.wikipedia.org/wiki/Voronoi_diagram) which map the pointer position to the closest element.

You can define a maximal radius with the `voronoiMaxRadius` prop.
If the distance with the pointer is larger than this radius, no item will be selected.
Or set the `disableVoronoi` prop to `true` to trigger interactions only when hovering exactly over an element instead of Voronoi cells.

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

const data = [
  { x1: 529.39, y1: 643.28, x2: 191.29, y2: -46.1, id: 'data-0' },
  { x1: 296.94, y1: 310.5, x2: -60.4, y2: 17.8, id: 'data-1' },
  { x1: 536.35, y1: 375.23, x2: 82.34, y2: 86.32, id: 'data-2' },
  { x1: 359.44, y1: 395.97, x2: 184.85, y2: 125.12, id: 'data-3' },
  { x1: 388.86, y1: 551.77, x2: -17.73, y2: -55.42, id: 'data-4' },
  { x1: 343.86, y1: 243.25, x2: 160.22, y2: -53.49, id: 'data-5' },
  { x1: 402.02, y1: 576.34, x2: 9.5, y2: 109.69, id: 'data-6' },
  { x1: 584.41, y1: 231.51, x2: 58.93, y2: 36.38, id: 'data-7' },
  { x1: 456.76, y1: 431.31, x2: -129.43, y2: 240.72, id: 'data-8' },
  { x1: 343.79, y1: 308.04, x2: 219.02, y2: -179.71, id: 'data-9' },
  { x1: 303.48, y1: 521.77, x2: -184.11, y2: 284.17, id: 'data-10' },
  { x1: 472.39, y1: 320.18, x2: -10.97, y2: -145.04, id: 'data-11' },
  { x1: 223.57, y1: 566.2, x2: 256.4, y2: 218.5, id: 'data-12' },
  { x1: 419.73, y1: 651.45, x2: 35.96, y2: -18.68, id: 'data-13' },
  { x1: 254.99, y1: 494.8, x2: 234.5, y2: 240.9, id: 'data-14' },
  { x1: 334.13, y1: 321.83, x2: 183.8, y2: 73.52, id: 'data-15' },
  { x1: 212.7, y1: 487.7, x2: 70.8, y2: 146.7, id: 'data-16' },
  { x1: 376.51, y1: 334.06, x2: -80.83, y2: -125.47, id: 'data-17' },
  { x1: 265.05, y1: 304.5, x2: -121.07, y2: -49.1, id: 'data-18' },
  { x1: 362.25, y1: 613.07, x2: -136.29, y2: -173.52, id: 'data-19' },
  { x1: 268.88, y1: 274.68, x2: -49.2, y2: 133.2, id: 'data-20' },
  { x1: 295.29, y1: 560.6, x2: 129.1, y2: 222, id: 'data-21' },
  { x1: 590.62, y1: 530.72, x2: -189.99, y2: 288.06, id: 'data-22' },
];

export default function VoronoiInteraction() {
  const [voronoiMaxRadius, setVoronoiMaxRadius] = React.useState<number>(25);
  const [disableVoronoi, setDisableVoronoi] = React.useState<boolean>(false);
  const [undefinedRadius, setUndefinedRadius] = React.useState<boolean>(true);

  const handleMaxRadiusChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue !== 'number') {
      return;
    }
    setVoronoiMaxRadius(newValue);
  };

  return (
    <Stack direction="column" sx={{ width: '100%' }}>
      <ScatterChart
        height={300}
        disableVoronoi={disableVoronoi}
        voronoiMaxRadius={undefinedRadius ? undefined : voronoiMaxRadius}
        dataset={data}
        series={[
          {
            label: 'Series A',
            data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
          },
          {
            label: 'Series B',
            data: data.map((v) => ({ x: v.x2, y: v.y2, id: v.id })),
          },
        ]}
      />
      <div>
        <Typography id="max-radius-value" gutterBottom>
          max radius
        </Typography>
        <Slider
          value={voronoiMaxRadius}
          onChange={handleMaxRadiusChange}
          valueLabelDisplay="auto"
          min={1}
          max={100}
          aria-labelledby="max-radius-value"
          disabled={disableVoronoi || undefinedRadius}
        />
      </div>
      <Stack direction="row">
        <FormControlLabel
          checked={disableVoronoi}
          control={
            <Checkbox
              onChange={(event) => setDisableVoronoi(event.target.checked)}
            />
          }
          label="disableVoronoi"
          labelPlacement="end"
        />
        <FormControlLabel
          checked={undefinedRadius}
          control={
            <Checkbox
              onChange={(event) => setUndefinedRadius(event.target.checked)}
            />
          }
          label="undefined radius"
          labelPlacement="end"
        />
      </Stack>
    </Stack>
  );
}

```

## Click event

Scatter Chart provides an `onItemClick` handler for handling clicks on specific scatter items.
It has the following signature.

```js
const onItemClick = (
  event, // The mouse event.
  params, // An object that identifies the clicked elements.
) => {};
```

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';

import { ScatterChart } from '@mui/x-charts/ScatterChart';

import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { ScatterItemIdentifier } from '@mui/x-charts/models';

const scatterChartsParams = {
  series: [
    {
      id: 'series-1',
      data: [
        { x: 6.5e-2, y: -1.3, id: 0 },
        { x: -2.1, y: -7.0e-1, id: 1 },
        { x: -7.6e-1, y: -6.7e-1, id: 2 },
        { x: -1.5e-2, y: -2.0e-1, id: 3 },
        { x: -1.4, y: -9.9e-1, id: 4 },
        { x: -1.1, y: -1.5, id: 5 },
        { x: -7.0e-1, y: -2.7e-1, id: 6 },
        { x: -5.1e-1, y: -8.8e-1, id: 7 },
        { x: -4.0e-3, y: -1.4, id: 8 },
        { x: -1.3, y: -2.2, id: 9 },
      ],
      label: 'A',
      highlightScope: {
        highlight: 'item',
      },
    },
    {
      id: 'series-2',
      data: [
        { x: 1.8, y: -1.7e-2, id: 0 },
        { x: 7.1e-1, y: 2.6e-1, id: 1 },
        { x: -1.2, y: 9.8e-1, id: 2 },
        { x: 2.0, y: -2.0e-1, id: 3 },
        { x: 9.4e-1, y: -2.7e-1, id: 4 },
        { x: -4.8e-1, y: -1.6e-1, id: 5 },
        { x: -1.5, y: 1.1, id: 6 },
        { x: 1.3, y: 3.4e-1, id: 7 },
        { x: -4.2e-1, y: 1.0e-1, id: 8 },
        { x: 5.4e-2, y: 4.0e-1, id: 9 },
      ],
      label: 'B',
      highlightScope: {
        highlight: 'item',
      },
    },
  ],
  height: 400,
} as const;

export default function ScatterClick() {
  const [data, setData] = React.useState<ScatterItemIdentifier>();

  const { ...other } = data ?? {};
  const dataDisplayed = data && {
    ...other,
  };
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 0, md: 4 }}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <ScatterChart
          {...scatterChartsParams}
          onItemClick={(_: any, d: ScatterItemIdentifier) => setData(d)}
        />
      </Box>
      <Stack direction="column" sx={{ width: { xs: '100%', md: '40%' } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography>Click on the chart</Typography>
          <IconButton
            aria-label="reset"
            size="small"
            onClick={() => setData(undefined)}
          >
            <UndoOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
        <HighlightedCode
          code={
            dataDisplayed
              ? JSON.stringify(dataDisplayed, null, 1)
              : '// The data will appear here'
          }
          language="json"
          copyButtonHidden
        />
      </Stack>
    </Stack>
  );
}

```

If `disableVoronoi=true`, users need to click precisely on the scatter element, and the mouse event will come from this element.

Otherwise, the click behavior will be the same as defined in the [interaction section](#interaction) and the mouse event will come from the svg component.

## Styling

### Color scale

As with other charts, you can modify the [series color](/x/react-charts/styling/#colors) either directly, or with the color palette.

You can also modify the color by using axes `colorMap` which maps values to colors.
The scatter charts use by priority:

1. The z-axis color
2. The y-axis color
3. The x-axis color
4. The series color

:::info
The z-axis is a third axis that allows to customize scatter points independently from their position.
It can be provided with `zAxis` props.

The value to map can either come from the `z` property of series data, or from the zAxis data.
Here are three ways to set z value to 5.

```jsx
<ScatterChart
  // First option
  series={[{ data: [{ id: 0, x: 1, y: 1, z: 5 }] }]}
  // Second option
  zAxis={[{ data: [5] }]}
  // Third option
  dataset={[{ price: 5 }]}
  zAxis={[{ dataKey: 'price' }]}
/>
```

:::

Learn more about the `colorMap` properties in the [Styling docs](/x/react-charts/styling/#values-color).

```tsx
import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { ScatterValueType } from '@mui/x-charts/models';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { Chance } from 'chance';

const POINTS_NUMBER = 50;
const chance = new Chance(42);

export default function ColorScale() {
  const [colorX, setColorX] = React.useState<'None' | 'piecewise' | 'continuous'>(
    'piecewise',
  );
  const [colorY, setColorY] = React.useState<'None' | 'piecewise' | 'continuous'>(
    'None',
  );
  const [colorZ, setColorZ] = React.useState<
    'None' | 'piecewise' | 'continuous' | 'ordinal'
  >('None');

  return (
    <Stack direction="column" spacing={1} sx={{ width: '100%', maxWidth: 600 }}>
      <Stack
        direction="row"
        gap={1}
        sx={{
          width: '100%',
          '&>div': {
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        flexWrap="wrap"
      >
        <div>
          <Typography variant="caption">x-axis colorMap</Typography>
          <ToggleButtonGroup
            color="primary"
            size="small"
            exclusive
            value={colorX}
            onChange={(_, value: 'None' | 'piecewise' | 'continuous') =>
              setColorX(value)
            }
            aria-label="Platform"
          >
            <ToggleButton value="None">None</ToggleButton>
            <ToggleButton value="piecewise">piecewise</ToggleButton>
            <ToggleButton value="continuous">continuous</ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div>
          <Typography variant="caption">y-axis colorMap</Typography>
          <ToggleButtonGroup
            color="primary"
            size="small"
            exclusive
            value={colorY}
            onChange={(_, value: 'None' | 'piecewise' | 'continuous') =>
              setColorY(value)
            }
            aria-label="Platform"
          >
            <ToggleButton value="None">None</ToggleButton>
            <ToggleButton value="piecewise">piecewise</ToggleButton>
            <ToggleButton value="continuous">continuous</ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div>
          <Typography variant="caption">z-axis colorMap</Typography>
          <ToggleButtonGroup
            color="primary"
            size="small"
            exclusive
            value={colorZ}
            onChange={(_, value: 'None' | 'piecewise' | 'continuous' | 'ordinal') =>
              setColorZ(value)
            }
            aria-label="Platform"
          >
            <ToggleButton value="None">None</ToggleButton>
            <ToggleButton value="piecewise">piecewise</ToggleButton>
            <ToggleButton value="continuous">continuous</ToggleButton>
            <ToggleButton value="ordinal">ordinal</ToggleButton>
          </ToggleButtonGroup>
        </div>
      </Stack>

      <ScatterChart
        height={300}
        grid={{ horizontal: true, vertical: true }}
        series={series}
        yAxis={[
          {
            min: -3,
            max: 3,
            tickInterval: [-3, -1.5, 0, 1.5, 3],
            colorMap:
              (colorY === 'continuous' && {
                type: 'continuous',
                min: -2,
                max: 2,
                color: ['blue', 'red'],
              }) ||
              (colorY === 'piecewise' && {
                type: 'piecewise',
                thresholds: [-1.5, 0, 1.5],
                colors: ['lightblue', 'blue', 'orange', 'red'],
              }) ||
              undefined,
          },
        ]}
        xAxis={[
          {
            min: -3,
            max: 3,
            tickInterval: [-3, -1.5, 0, 1.5, 3],
            colorMap:
              (colorX === 'continuous' && {
                type: 'continuous',
                min: -2,
                max: 2,
                color: ['green', 'orange'],
              }) ||
              (colorX === 'piecewise' && {
                type: 'piecewise',
                thresholds: [-1.5, 0, 1.5],
                colors: ['#d01c8b', '#f1b6da', '#b8e186', '#4dac26'],
              }) ||
              undefined,
          },
        ]}
        zAxis={[
          {
            data:
              colorZ === 'ordinal'
                ? [
                    ...[...Array(POINTS_NUMBER)].map(() => 'A'),
                    ...[...Array(POINTS_NUMBER)].map(() => 'B'),
                    ...[...Array(POINTS_NUMBER)].map(() => 'C'),
                    ...[...Array(POINTS_NUMBER)].map(() => 'D'),
                  ]
                : undefined,
            colorMap:
              (colorZ === 'continuous' && {
                type: 'continuous',
                min: -2,
                max: 2,
                color: ['green', 'orange'],
              }) ||
              (colorZ === 'piecewise' && {
                type: 'piecewise',
                thresholds: [-1.5, 0, 1.5],
                colors: ['#d01c8b', '#f1b6da', '#b8e186', '#4dac26'],
              }) ||
              (colorZ === 'ordinal' && {
                type: 'ordinal',

                values: ['A', 'B', 'C', 'D'],
                colors: ['#d01c8b', '#f1b6da', '#b8e186', '#4dac26'],
              }) ||
              undefined,
          },
        ]}
      />
      <HighlightedCode
        code={[
          `<ScatterChart`,
          '  /* ... */',
          '  series={[{ data: data.map(point => ({...point, z: point.x + point.y})) }]}',
          // ColorX
          ...(colorX === 'None' ? ['  xAxis={[{}]}'] : []),
          ...(colorX === 'continuous'
            ? [
                '  xAxis={[{',
                `    colorMap: {`,
                `      type: 'continuous',`,
                `      min: -2,`,
                `      max: 2,`,
                `      color: ['green', 'orange']`,
                `    }`,
                '  }]}',
              ]
            : []),
          ...(colorX === 'piecewise'
            ? [
                '  xAxis={[{',
                `    colorMap: {`,
                `      type: 'piecewise',`,
                `      thresholds: [-1.5, 0, 1.5],`,
                `      colors: ['#d01c8b', '#f1b6da', '#b8e186', '#4dac26'],`,
                `    }`,
                '  }]}',
              ]
            : []),

          // ColorY
          ...(colorY === 'None' ? ['  yAxis={[{}]}'] : []),
          ...(colorY === 'continuous'
            ? [
                '  yAxis={[{',
                `    colorMap: {`,
                `      type: 'continuous',`,
                `      min: -2,`,
                `      max: 2,`,
                `      color: ['blue', 'red']`,
                `    }`,
                '  }]}',
              ]
            : []),
          ...(colorY === 'piecewise'
            ? [
                '  yAxis={[{',
                `    colorMap: {`,
                `      type: 'piecewise',`,
                `      thresholds: [-1.5, 0, 1.5],`,
                `      colors: ['lightblue', 'blue', 'orange', 'red'],`,
                `    }`,
                '  }]}',
              ]
            : []),

          // ColorZ
          ...(colorZ === 'None' ? ['  zAxis={[{}]}'] : []),
          ...(colorZ === 'continuous'
            ? [
                '  zAxis={[{',
                `    colorMap: {`,
                `      type: 'continuous',`,
                `      min: -2,`,
                `      max: 2,`,
                `      color: ['green', 'orange'],`,
                `    }`,
                '  }]}',
              ]
            : []),
          ...(colorZ === 'piecewise'
            ? [
                '  zAxis={[{',
                `    colorMap: {`,
                `      type: 'piecewise',`,
                `      thresholds: [-1.5, 0, 1.5],`,
                `      colors: ['#d01c8b', '#f1b6da', '#b8e186', '#4dac26'],`,
                `    }`,
                '  }]}',
              ]
            : []),
          ...(colorZ === 'ordinal'
            ? [
                '  zAxis={[{',
                `    data: ['A', ..., 'B', ..., 'C', ..., 'D', ...],`,
                `    colorMap: {`,
                `      type: 'ordinal',`,
                `      values: ['A', 'B', 'C', 'D'],`,
                `      colors: ['#d01c8b', '#f1b6da', '#b8e186', '#4dac26'],`,
                `    }`,
                '  }]}',
              ]
            : []),
          `/>`,
        ].join('\n')}
        language="jsx"
        copyButtonHidden
      />
    </Stack>
  );
}

const series = [
  {
    data: [
      ...getGaussianSeriesData([-1, -1]),
      ...getGaussianSeriesData([-1, 1]),
      ...getGaussianSeriesData([1, 1]),
      ...getGaussianSeriesData([1, -1]),
    ],
  },
].map((s) => ({
  ...s,
  valueFormatter: (v: ScatterValueType | null) =>
    v && `(${v.x.toFixed(1)}, ${v.y.toFixed(1)})`,
}));

function getGaussianSeriesData(
  mean: [number, number],
  stdev: [number, number] = [0.5, 0.5],
  N: number = 50,
) {
  return [...Array(N)].map((_, i) => {
    const x =
      Math.sqrt(-2.0 * Math.log(1 - chance.floating({ min: 0, max: 0.99 }))) *
        Math.cos(2.0 * Math.PI * chance.floating({ min: 0, max: 0.99 })) *
        stdev[0] +
      mean[0];
    const y =
      Math.sqrt(-2.0 * Math.log(1 - chance.floating({ min: 0, max: 0.99 }))) *
        Math.cos(2.0 * Math.PI * chance.floating({ min: 0, max: 0.99 })) *
        stdev[1] +
      mean[1];
    return { x, y, z: x + y, id: `${mean.join(',')}${i}` };
  });
}

```

### Grid

You can add a grid in the background of the chart with the `grid` prop.

See [Axis—Grid](/x/react-charts/axis/#grid) documentation for more information.

```tsx
import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { data } from './randomData';

export default function GridDemo() {
  return (
    <ScatterChart
      height={300}
      series={[
        {
          label: 'Series A',
          data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
        },
        {
          label: 'Series B',
          data: data.map((v) => ({ x: v.x1, y: v.y2, id: v.id })),
        },
      ]}
      grid={{ vertical: true, horizontal: true }}
    />
  );
}

```

### CSS

You can target scatter markers with the following CSS selectors:

- `[data-series='<series id>']` Selects the group containing markers of the series with the given id.
- `[data-highlighted=true]` Selects markers with highlighted state.
- `[data-faded=true]` Selects markers with faded state.

To select all marker groups, use the `scatterClasses.root` class name.

Here is an example that customizes the look of highlighted items depending on the series they belong to.

```tsx
import * as React from 'react';
import { ScatterChart, ScatterSeries } from '@mui/x-charts/ScatterChart';
import { data } from './randomData';

const series: ScatterSeries[] = [
  {
    id: 'series-1',
    label: 'Series A',
    data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
    highlightScope: { highlight: 'item', fade: 'global' },
  },
  {
    id: 'series-2',
    label: 'Series B',
    data: data.map((v) => ({ x: v.x1, y: v.y2, id: v.id })),
    highlightScope: { highlight: 'item', fade: 'global' },
  },
];

export default function ScatterCSSSelectors() {
  return (
    <ScatterChart
      height={300}
      voronoiMaxRadius={30}
      series={series}
      sx={{
        '& [data-faded=true]': { opacity: 0.4 },
        "& [data-series='series-1'] [data-faded=true]": { fill: 'gray' },
        "& [data-series='series-1'] [data-highlighted=true]": {
          stroke: 'blue',
          strokeWidth: 3,
          fill: 'none',
        },
      }}
    />
  );
}

```

### Shape

The shape of points in a scatter chart can be customized by passing a component to the `marker` slot.

If you want the legend and tooltip to match, then you also need to customize the `labelMarkType` of each series, as shown in the example below.

```tsx
import * as React from 'react';
import { ScatterChart, ScatterMarkerProps } from '@mui/x-charts/ScatterChart';
import { ChartsLabelCustomMarkProps } from '@mui/x-charts/ChartsLabel';
import { data } from './randomData';

export default function ScatterCustomShape() {
  return (
    <ScatterChart
      height={300}
      series={[
        {
          id: '1',
          label: 'Series A',
          data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
          markerSize: 1,
          labelMarkType: StarLabelMark,
        },
        {
          id: '2',
          label: 'Series B',
          data: data.map((v) => ({ x: v.x1, y: v.y2, id: v.id })),
          markerSize: 1,
          labelMarkType: DiamondLabelMark,
        },
      ]}
      slots={{ marker: CustomMarker }}
    />
  );
}

const star =
  'M0,-7.528L1.69,-2.326L7.16,-2.326L2.735,0.889L4.425,6.09L0,2.875L-4.425,6.09L-2.735,0.889L-7.16,-2.326L-1.69,-2.326Z';
const diamond = 'M0,-7.423L4.285,0L0,7.423L-4.285,0Z';

function CustomMarker({
  size,
  x,
  y,
  seriesId,
  isHighlighted,
  isFaded,
  dataIndex,
  color,
  ...other
}: ScatterMarkerProps) {
  const props = {
    x: 0,
    y: 0,
    width: (isHighlighted ? 1.2 : 1) * size,
    height: (isHighlighted ? 1.2 : 1) * size,
    transform: `translate(${x}, ${y})`,
    fill: color,
    opacity: isFaded ? 0.3 : 1,
    ...other,
  };

  return (
    <g {...props}>
      <path
        d={seriesId === '1' ? star : diamond}
        scale={(isHighlighted ? 1.2 : 1) * size}
      />
    </g>
  );
}

function StarLabelMark({ color, ...props }: ChartsLabelCustomMarkProps) {
  return (
    <svg viewBox="-7.423 -7.423 14.846 14.846">
      <path {...props} d={star} fill={color} />
    </svg>
  );
}

function DiamondLabelMark({ color, ...props }: ChartsLabelCustomMarkProps) {
  return (
    <svg viewBox="-7.423 -7.423 14.846 14.846">
      <path {...props} d={diamond} fill={color} />
    </svg>
  );
}

```

### Size

You can customize the size of points in a scatter chart using the `markerSize` prop of every series.
For circles, the `markerSize` is the radius of the point in pixels.

```tsx
import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { data } from './randomData';

export default function ScatterCustomSize() {
  return (
    <ScatterChart
      height={300}
      series={[
        {
          label: 'Series A',
          data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
          markerSize: 8,
        },
        {
          label: 'Series B',
          data: data.map((v) => ({ x: v.x1, y: v.y2, id: v.id })),
          markerSize: 4,
        },
      ]}
    />
  );
}

```

## Plot customization

You can customize the plotting of the data in a scatter chart by providing custom components as `children` of the `ScatterChart` component.

A scatter chart's series can be accessed through the `useScatterSeries` hook.
This hook returns the order of the series and information about the series themselves, including their data points, color, etc.

See [Custom components](/x/react-charts/components/) to learn how to further customize your charts.

```tsx
import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { useScatterSeries, useXScale, useYScale } from '@mui/x-charts/hooks';

const data1 = [
  { x: 95, y: 200, id: 1 },
  { x: 120, y: 100, id: 2 },
  { x: 170, y: 300, id: 3 },
  { x: 140, y: 250, id: 4 },
  { x: 150, y: 400, id: 5 },
  { x: 110, y: 280, id: 6 },
];
const data2 = [
  { x: 300, y: 300, id: 1 },
  { x: 200, y: 700, id: 2 },
  { x: 400, y: 500, id: 3 },
  { x: 340, y: 350, id: 4 },
  { x: 420, y: 280, id: 5 },
];
const series = [
  { id: 's1', data: data1, label: 'Open' },
  { id: 's2', data: data2, label: 'Closed' },
];

function LinkPoints({ seriesId, close }: { seriesId: string; close?: boolean }) {
  const scatter = useScatterSeries(seriesId);
  const xScale = useXScale();
  const yScale = useYScale();

  if (!scatter) {
    return null;
  }
  const { color, data } = scatter;

  if (!data) {
    return null;
  }

  return (
    <path
      fill="none"
      stroke={color}
      strokeWidth={2}
      d={`M ${data.map(({ x, y }) => `${xScale(x)}, ${yScale(y)}`).join(' L')}${
        close ? 'Z' : ''
      }`}
    />
  );
}

export default function CustomScatter() {
  return (
    <ScatterChart series={series} height={300}>
      <LinkPoints seriesId="s1" />
      <LinkPoints seriesId="s2" close />
    </ScatterChart>
  );
}

```

## Composition

Use the `<ChartDataProvider />` to provide `series`, `xAxis`, and `yAxis` props for composition.

In addition to the common chart components available for [composition](/x/react-charts/composition/), you can use the `<ScatterPlot />` component that renders the scatter marks.

Here's how the Scatter Chart is composed:

```jsx
<ChartDataProvider>
  <ChartsWrapper>
    <ChartsLegend />
    <ChartsSurface>
      <ChartsAxis />
      <ChartsGrid />
      <g data-drawing-container>
        {/* Elements able to overflow the drawing area. */}
        <ScatterPlot />
      </g>
      <ChartsOverlay />
      <ChartsAxisHighlight />
    </ChartsSurface>
    <ChartsTooltip trigger="item" />
  </ChartsWrapper>
</ChartDataProvider>
```

:::info
The `data-drawing-container` indicates that children of this element should be considered part of the drawing area, even if they overflow.

See the [Composition—clipping](/x/react-charts/composition/#clipping) for more info.
:::
