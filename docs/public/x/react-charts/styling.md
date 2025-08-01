---
title: Charts - Styling
productId: x-charts
---

# Charts - Styling

This page groups topics about charts customization.

## Colors

### Series color

Series accepts a property `color` which is the base color used to render its components.

```jsx
<LineChart series={[{ ..., color: '#fdb462'}]} />
```

```tsx
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const Tableau10 = [
  '#4e79a7',
  '#f28e2c',
  '#e15759',
  '#76b7b2',
  '#59a14f',
  '#edc949',
  '#af7aa1',
  '#ff9da7',
  '#9c755f',
  '#bab0ab',
];

const chartsParams = {
  height: 300,
};
export default function BasicColor() {
  const [color, setColor] = React.useState('#4e79a7');

  const handleChange = (event: React.MouseEvent<HTMLElement>, nextColor: string) => {
    setColor(nextColor);
  };

  return (
    <Stack direction="column" spacing={2}>
      <LineChart
        {...chartsParams}
        series={[
          {
            data: [15, 23, 18, 19, 13],
            label: 'Example',
            color,
          },
        ]}
      />
      <ToggleButtonGroup value={color} exclusive onChange={handleChange}>
        {Tableau10.map((value) => (
          <ToggleButton key={value} value={value} sx={{ p: 1 }}>
            <div
              style={{
                width: 15,
                height: 15,
                backgroundColor: value,
                display: 'inline-block',
              }}
            />
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Stack>
  );
}

```

### Color palette

Charts come with built-in color palettes to automatically assign colors to series.
If a particular series lacks a color prop, the chart will default to assigning a color based on the series' index.

You can set a custom color palette by using the prop `colors` on chart components (or `<ChartContainer />` if you are using composition).
This prop takes an array of colors, or callback whose input is the theme's mode (`'dark'` or `'light'`) and returns the array of colors.

#### Provided palettes

The library includes three palettes.

```tsx
import * as React from 'react';
import { createTheme, useTheme, ThemeProvider } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Chance } from 'chance';
import { ScatterChart, ScatterChartProps } from '@mui/x-charts/ScatterChart';
import { ScatterValueType } from '@mui/x-charts/models';
import {
  blueberryTwilightPalette,
  mangoFusionPalette,
  cheerfulFiestaPalette,
  strawberrySkyPalette,
  rainbowSurgePalette,
  bluePalette,
  greenPalette,
  purplePalette,
  redPalette,
  orangePalette,
  yellowPalette,
  cyanPalette,
  pinkPalette,
} from '@mui/x-charts/colorPalettes';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';

const chance = new Chance(42);

function getGaussianSeriesData(
  mean: [number, number],
  stdev: [number, number] = [0.3, 0.4],
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
    return { x, y, id: i };
  });
}

const legendPlacement: Partial<ScatterChartProps> = {
  slotProps: {
    legend: {
      direction: 'vertical',
    },
  },
};

const series = [
  { label: 'Series 1', data: getGaussianSeriesData([-5, 0]) },
  { label: 'Series 2', data: getGaussianSeriesData([-4, 0]) },
  { label: 'Series 3', data: getGaussianSeriesData([-3, 0]) },
  { label: 'Series 4', data: getGaussianSeriesData([-2, 0]) },
  { label: 'Series 5', data: getGaussianSeriesData([-1, 0]) },
  { label: 'Series 6', data: getGaussianSeriesData([0, 0]) },
  { label: 'Series 7', data: getGaussianSeriesData([1, 0]) },
  { label: 'Series 8', data: getGaussianSeriesData([2, 0]) },
  { label: 'Series 9', data: getGaussianSeriesData([3, 0]) },
  { label: 'Series 10', data: getGaussianSeriesData([4, 0]) },
  { label: 'Series 11', data: getGaussianSeriesData([5, 0]) },
  { label: 'Series 12', data: getGaussianSeriesData([6, 0]) },
  { label: 'Series 13', data: getGaussianSeriesData([7, 0]) },
].map((s) => ({
  ...s,
  valueFormatter: (v: ScatterValueType | null) =>
    v && `(${v.x.toFixed(1)}, ${v.y.toFixed(1)})`,
}));

const categorical = {
  rainbowSurge: rainbowSurgePalette,
  blueberryTwilight: blueberryTwilightPalette,
  mangoFusion: mangoFusionPalette,
  cheerfulFiesta: cheerfulFiestaPalette,
} as const;
const sequential = {
  strawberrySky: strawberrySkyPalette,
  purple: purplePalette,
  blue: bluePalette,
  cyan: cyanPalette,
  green: greenPalette,
  yellow: yellowPalette,
  orange: orangePalette,
  red: redPalette,
  pink: pinkPalette,
} as const;

const categories = {
  ...categorical,
  ...sequential,
} as const;

type PaletteKey = keyof typeof categories;

export default function MuiColorTemplate() {
  const theme = useTheme();
  const [colorScheme, setColorScheme] =
    React.useState<PaletteKey>('blueberryTwilight');
  const [colorMode, setColorMode] = React.useState(theme.palette.mode);

  React.useEffect(() => {
    setColorMode(theme.palette.mode);
  }, [theme.palette.mode]);

  const newTheme = createTheme({ palette: { mode: colorMode } });
  return (
    <ThemeProvider theme={newTheme}>
      <Paper sx={{ width: '100%', p: 2 }} elevation={0}>
        <Stack direction="column" spacing={2}>
          <ScatterChart
            height={400}
            series={series}
            yAxis={[{ min: -1.5, max: 1.5 }]}
            colors={categories[colorScheme]}
            {...legendPlacement}
          />
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems="center"
            justifyContent="space-evenly"
          >
            <div>
              <Button
                sx={{ ml: 1 }}
                onClick={() =>
                  setColorMode((prev) => (prev === 'light' ? 'dark' : 'light'))
                }
                color="inherit"
                endIcon={
                  colorMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />
                }
              >
                {colorMode} mode
              </Button>
            </div>
            <TextField
              select
              sx={{ maxWidth: 1 }}
              value={colorScheme}
              onChange={(event) => setColorScheme(event.target.value as PaletteKey)}
            >
              <ListSubheader>Categorical</ListSubheader>
              {Object.entries(categorical).map(([name, colors]) => (
                <MenuItem key={name} value={name}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    width={'100%'}
                  >
                    <Typography sx={{ mr: 2 }}>{name}</Typography>
                    <div style={{ width: 200, height: 20 }}>
                      {colors(colorMode).map((c) => (
                        <div
                          key={c}
                          style={{
                            width: 20,
                            height: 20,
                            backgroundColor: c,
                            display: 'inline-block',
                          }}
                        />
                      ))}
                    </div>
                  </Stack>
                </MenuItem>
              ))}
              <Divider />
              <ListSubheader>Sequential</ListSubheader>
              {Object.entries(sequential).map(([name, colors]) => (
                <MenuItem key={name} value={name}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    width={'100%'}
                  >
                    <Typography sx={{ mr: 2 }}>{name}</Typography>
                    <div style={{ width: 200, height: 20 }}>
                      {colors(colorMode).map((c) => (
                        <div
                          key={c}
                          style={{
                            width: 20,
                            height: 20,
                            backgroundColor: c,
                            display: 'inline-block',
                          }}
                        />
                      ))}
                    </div>
                  </Stack>
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Stack>
      </Paper>
    </ThemeProvider>
  );
}

```

#### Custom palettes

Those palettes can also be generated by using [d3-scale-chromatic](https://observablehq.com/@d3/color-schemes).
Or any color manipulation library you like.

Here is an example of the d3 Categorical color palette.

```tsx
import * as React from 'react';
import { ScatterChart, ScatterChartProps } from '@mui/x-charts/ScatterChart';
import { ScatterValueType } from '@mui/x-charts/models';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { Chance } from 'chance';

const chance = new Chance(42);

function getGaussianSeriesData(
  mean: [number, number],
  stdev: [number, number] = [0.3, 0.4],
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
    return { x, y, id: i };
  });
}

const legendPlacement: Partial<ScatterChartProps> = {
  slotProps: {
    legend: {
      position: {
        vertical: 'middle',
        horizontal: 'end',
      },
      direction: 'vertical',
    },
  },
};
const series = [
  { label: 'Series 1', data: getGaussianSeriesData([-5, 0]) },
  { label: 'Series 2', data: getGaussianSeriesData([-4, 0]) },
  { label: 'Series 3', data: getGaussianSeriesData([-3, 0]) },
  { label: 'Series 4', data: getGaussianSeriesData([-2, 0]) },
  { label: 'Series 5', data: getGaussianSeriesData([-1, 0]) },
  { label: 'Series 6', data: getGaussianSeriesData([0, 0]) },
  { label: 'Series 7', data: getGaussianSeriesData([1, 0]) },
  { label: 'Series 8', data: getGaussianSeriesData([2, 0]) },
  { label: 'Series 9', data: getGaussianSeriesData([3, 0]) },
  { label: 'Series 10', data: getGaussianSeriesData([4, 0]) },
  { label: 'Series 11', data: getGaussianSeriesData([5, 0]) },
  { label: 'Series 12', data: getGaussianSeriesData([6, 0]) },
  { label: 'Series 13', data: getGaussianSeriesData([7, 0]) },
].map((s) => ({
  ...s,
  valueFormatter: (v: ScatterValueType | null) =>
    v && `(${v.x.toFixed(1)}, ${v.y.toFixed(1)})`,
}));

const categories: { [key: string]: string[] } = {
  Category10: [
    '#1f77b4',
    '#ff7f0e',
    '#2ca02c',
    '#d62728',
    '#9467bd',
    '#8c564b',
    '#e377c2',
    '#7f7f7f',
    '#bcbd22',
    '#17becf',
  ],
  Accent: [
    '#7fc97f',
    '#beaed4',
    '#fdc086',
    '#ffff99',
    '#386cb0',
    '#f0027f',
    '#bf5b17',
    '#666666',
  ],
  Dark2: [
    '#1b9e77',
    '#d95f02',
    '#7570b3',
    '#e7298a',
    '#66a61e',
    '#e6ab02',
    '#a6761d',
    '#666666',
  ],
  Paired: [
    '#a6cee3',
    '#1f78b4',
    '#b2df8a',
    '#33a02c',
    '#fb9a99',
    '#e31a1c',
    '#fdbf6f',
    '#ff7f00',
    '#cab2d6',
    '#6a3d9a',
    '#ffff99',
    '#b15928',
  ],
  Pastel1: [
    '#fbb4ae',
    '#b3cde3',
    '#ccebc5',
    '#decbe4',
    '#fed9a6',
    '#ffffcc',
    '#e5d8bd',
    '#fddaec',
    '#f2f2f2',
  ],
  Pastel2: [
    '#b3e2cd',
    '#fdcdac',
    '#cbd5e8',
    '#f4cae4',
    '#e6f5c9',
    '#fff2ae',
    '#f1e2cc',
    '#cccccc',
  ],
  Set1: [
    '#e41a1c',
    '#377eb8',
    '#4daf4a',
    '#984ea3',
    '#ff7f00',
    '#ffff33',
    '#a65628',
    '#f781bf',
    '#999999',
  ],
  Set2: [
    '#66c2a5',
    '#fc8d62',
    '#8da0cb',
    '#e78ac3',
    '#a6d854',
    '#ffd92f',
    '#e5c494',
    '#b3b3b3',
  ],
  Set3: [
    '#8dd3c7',
    '#ffffb3',
    '#bebada',
    '#fb8072',
    '#80b1d3',
    '#fdb462',
    '#b3de69',
    '#fccde5',
    '#d9d9d9',
    '#bc80bd',
    '#ccebc5',
    '#ffed6f',
  ],
  Tableau10: [
    '#4e79a7',
    '#f28e2c',
    '#e15759',
    '#76b7b2',
    '#59a14f',
    '#edc949',
    '#af7aa1',
    '#ff9da7',
    '#9c755f',
    '#bab0ab',
  ],
};

export default function ColorTemplate() {
  const [colorScheme, setColorScheme] = React.useState('Category10');

  return (
    <Stack direction="column" spacing={2} sx={{ width: '100%', maxWidth: 600 }}>
      <ScatterChart
        height={400}
        series={series}
        yAxis={[{ min: -1.5, max: 1.5 }]}
        colors={categories[colorScheme]}
        {...legendPlacement}
      />
      <TextField
        select
        defaultValue="Category10"
        onChange={(event) => setColorScheme(event.target.value)}
      >
        {Object.entries(categories).map(([name, colors]) => (
          <MenuItem key={name} value={name}>
            <Stack direction="row" alignItems="center">
              <Typography sx={{ mr: 2 }}>{name}</Typography>
              <div style={{ width: 200, height: 20 }}>
                {colors.map((c) => (
                  <div
                    key={c}
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: c,
                      display: 'inline-block',
                    }}
                  />
                ))}
              </div>
            </Stack>
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}

```

### Values color

Colors can also be set according to item values using the `colorMap` property of the corresponding axis.

Learn more about how to use this feature with each chart component in their dedicated docs section:

- [bar charts](/x/react-charts/bars/#color-scale)
- [line charts](/x/react-charts/lines/#color-scale)
- [scatter charts](/x/react-charts/scatter/#color-scale)

The `colorMap` property can accept three kinds of objects defined below.

#### Piecewise color map

The piecewise configuration takes an array of _n_ `thresholds` values and _n+1_ `colors`.

```ts
{
  type: 'piecewise';
  thresholds: Value[];
  colors: string[];
}
```

#### Continuous color map

The continuous configuration lets you map values from `min` to `max` properties to their corresponding colors.

The `color` property can either be an array of two colors to interpolate, or an interpolation function that returns a color corresponding to a number _t_ with a value between 0 and 1.
The [d3-scale-chromatic](https://d3js.org/d3-scale-chromatic) offers a lot of those functions.

Values lower than the `min` get the color of the `min` value; similarly, values higher than the `max` get the color of the `max` value.
By default, the `min`/`max` range is set to 0 / 100.

```ts
{
  type: 'continuous';
  min?: Value;
  max?: Value;
  color: [string, string] | ((t: number) => string);
}
```

#### Ordinal color map

This configuration takes two properties—`values` and `colors`—and maps those values to their respective colors.

If a value is not defined, it will fall back to the `unknownColor`, and if this is also undefined, then it falls back on the series color.

This configuration can be used in Bar Charts to set colors according to string categories.

```ts
{
  type: 'ordinal';
  values: Value[];
  colors: string[];
  unknownColor?: string;
}
```

## Overlay

Charts have a _loading_ and _noData_ overlays that appear if:

- `loading` prop is set to `true`.
- There is no data to display.

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';

const emptySeries = {
  series: [],
  height: 150,
};

export default function Overlay() {
  return (
    <Stack direction={{ md: 'row', xs: 'column' }} sx={{ width: '100%' }}>
      <LineChart loading {...emptySeries} />
      <LineChart {...emptySeries} />
    </Stack>
  );
}

```

### Axis display

You can provide the axes data to display them while loading the data.

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';

const emptySeries = {
  series: [],
  height: 150,
};

export default function OverlayWithAxis() {
  return (
    <Stack direction={{ md: 'row', xs: 'column' }} sx={{ width: '100%' }}>
      <LineChart
        loading
        xAxis={[{ data: [0, 1, 2, 4, 5] }]}
        yAxis={[{ min: 0, max: 10 }]}
        {...emptySeries}
      />
      <LineChart
        yAxis={[{ min: -5, max: 5 }]}
        xAxis={[
          {
            scaleType: 'time',
            data: [
              new Date(2019, 0, 1),
              new Date(2020, 0, 1),
              new Date(2021, 0, 1),
              new Date(2022, 0, 1),
            ],
            tickNumber: 3,
          },
        ]}
        {...emptySeries}
      />
    </Stack>
  );
}

```

### Custom overlay

To modify the default overlay message or translate it, use the `noData` or `loading` key in the [localization](/x/react-charts/localization/).

```jsx
<BarChart
  localeText={{
    loading: 'Data should be available soon.',
    noData: 'Select some data to display.',
  }}
/>
```

For more advanced customization, use the `loadingOverlay` and `noDataOverlay` slots link in the following demo.

```tsx
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useDrawingArea, useXScale, useYScale } from '@mui/x-charts/hooks';

const ratios = [0.2, 0.8, 0.6, 0.5];

const LoadingRect = styled('rect')({
  opacity: 0.2,
  fill: 'lightgray',
});

const LoadingText = styled('text')(({ theme }) => ({
  stroke: 'none',
  fill: theme.palette.text.primary,
  shapeRendering: 'crispEdges',
  textAnchor: 'middle',
  dominantBaseline: 'middle',
}));

function LoadingOverlay() {
  const xScale = useXScale<'band'>();
  const yScale = useYScale();
  const { left, width, height } = useDrawingArea();

  const bandWidth = xScale.bandwidth();

  const [bottom, top] = yScale.range();

  return (
    <g>
      {xScale.domain().map((item, index) => {
        const ratio = ratios[index % ratios.length];
        const barHeight = ratio * (bottom - top);

        return (
          <LoadingRect
            key={index}
            x={xScale(item)}
            width={bandWidth}
            y={bottom - barHeight}
            height={height}
          />
        );
      })}
      <LoadingText x={left + width / 2} y={top + height / 2}>
        Loading data…
      </LoadingText>
    </g>
  );
}

export default function CustomOverlay() {
  return (
    <Stack direction={{ md: 'row', xs: 'column' }} sx={{ width: '100%' }}>
      <BarChart
        slotProps={{
          noDataOverlay: { message: 'No data to display in this chart' },
        }}
        series={[]}
        height={150}
      />
      <BarChart
        loading
        xAxis={[{ data: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] }]}
        slots={{ loadingOverlay: LoadingOverlay }}
        series={[]}
        height={150}
      />
    </Stack>
  );
}

```

## Styling

### Size

By default, charts adapt their sizing to fill their parent element.
However, you can modify this behavior by providing `height` and/or `width` props.

Those will fix the chart's size to the given value (in px).

### Placement

There are two concepts to consider when defining the placement of a chart:

- **`margin`**: The space between the SVG border and the axis or drawing area.
- **`axis size`**: The space taken by the [axis](/x/react-charts/axis/#position). Each axis has its own size.

The axes have a default size.
To update it, use the `xAxis` and `yAxis` configuration as follows:

- **`x-axis`**: Uses the `height` prop to define the space taken by the axis.
- **`y-axis`**: Uses the `width` prop instead.

Axes only take up space in the side they are positioned.
If the axis is not be displayed (`position: 'none'`), they will not take up any space, regardless of their size.

```tsx
import * as React from 'react';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { BarChart } from '@mui/x-charts/BarChart';
import { useDrawingArea, useXAxis, useYAxis } from '@mui/x-charts/hooks';

const defaultMargin = {
  knob: 'number',
  defaultValue: 40,
  step: 1,
  min: 0,
  max: 200,
} as const;

const defaultAxisSize = {
  knob: 'number',
  defaultValue: 30,
  step: 1,
  min: 0,
  max: 200,
} as const;

export default function Margin() {
  return (
    <ChartsUsageDemo
      componentName="Margin demos"
      data={
        {
          left: defaultMargin,
          right: defaultMargin,
          top: defaultMargin,
          bottom: defaultMargin,
          xAxisHeight: defaultAxisSize,
          yAxisWidth: defaultAxisSize,
          hideXAxis: {
            knob: 'switch',
            defaultValue: false,
          },
          hideYAxis: {
            knob: 'switch',
            defaultValue: false,
          },
        } as const
      }
      renderDemo={(props) => (
        <div style={{ width: '100%', margin: 4 }}>
          <BarChart
            series={[{ data: [6, 18, 12] }]}
            height={300}
            margin={{
              left: props.left,
              right: props.right,
              top: props.top,
              bottom: props.bottom,
            }}
            xAxis={[
              {
                id: 'x-axis',
                data: ['Page 1', 'Page 2', 'Page 3'],
                position: props.hideXAxis ? 'none' : 'top',
                height: props.xAxisHeight,
              },
            ]}
            yAxis={[
              {
                id: 'y-axis',
                position: props.hideYAxis ? 'none' : 'right',
                width: props.yAxisWidth,
              },
            ]}
          >
            <MarginVisualization />
            <AxisSizeVisualization />
            <DrawingAreaVisualization />
          </BarChart>
        </div>
      )}
      getCode={({ props }) =>
        `import { BarChart } from '@mui/x-charts/BarChart';

<BarChart
  // ...
  margin={{
    left: ${props.left},
    right: ${props.right},
    top: ${props.top},
    bottom: ${props.bottom},
  }}
  xAxis={[{
    height: ${props.xAxisHeight},
    position: ${props.hideXAxis ? "'none'" : "'top'"}
  }]}
  yAxis={[{
    width: ${props.yAxisWidth}
    position: ${props.hideYAxis ? "'none'" : "'right'"}
  }]}
/>`
      }
    />
  );
}

function MarginVisualization() {
  const { bottom, left, right, top, height, width } = useDrawingArea();
  const xAxis = useXAxis('x-axis');
  const yAxis = useYAxis('y-axis');

  const xSize = (xAxis.position !== 'none' ? xAxis.height : 0) ?? 0;
  const ySize = (yAxis.position !== 'none' ? yAxis.width : 0) ?? 0;

  return (
    <React.Fragment>
      <rect
        x={0}
        y={0}
        width={'100%'}
        height={top - xSize}
        fill="#008080"
        opacity={0.5}
      />
      <rect
        x={0}
        y={height + top}
        width={'100%'}
        height={bottom}
        fill="#008080"
        opacity={0.5}
      />
      <rect
        x={0}
        y={top - xSize}
        width={left}
        height={height + xSize}
        fill="#008080"
        opacity={0.5}
      />
      <rect
        x={width + left + ySize}
        y={top - xSize}
        width={right - ySize}
        height={height + xSize}
        fill="#008080"
        opacity={0.5}
      />
    </React.Fragment>
  );
}

function AxisSizeVisualization() {
  const { left, top, height, width } = useDrawingArea();
  const xAxis = useXAxis('x-axis');
  const yAxis = useYAxis('y-axis');

  return (
    <React.Fragment>
      {xAxis.position !== 'none' && (
        <rect
          x={left}
          y={top - (xAxis.height ?? 0)}
          width={width}
          height={xAxis.height ?? 0}
          fill="#EC407A"
          opacity={0.5}
        />
      )}
      {yAxis.position !== 'none' && (
        <rect
          x={width + left}
          y={top}
          width={yAxis.width ?? 0}
          height={height}
          fill="#EC407A"
          opacity={0.5}
        />
      )}
    </React.Fragment>
  );
}

function DrawingAreaVisualization() {
  const { left, top, height, width } = useDrawingArea();

  return (
    <rect
      x={left}
      y={top}
      width={width}
      height={height}
      fill="#006BD6"
      opacity={0.2}
    />
  );
}

```

### CSS

Since the library relies on SVG for rendering, you can customize them as you do with other MUI System components with CSS overriding.

Chart components accept the `sx` props.
From here, you can target any subcomponents with its class name.

```tsx
import * as React from 'react';
import { BarChart, barElementClasses } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

const labels: string[] = ['Group A', 'Group B', 'Group C', 'Group D', 'Group E'];
const lData: number[] = [42, 24, 56, 45, 3];
const rData: number[] = [57, 7, 19, 16, 22];
const colors: string[] = ['#006BD6', '#EC407A'];

export default function SxStyling(): React.JSX.Element {
  return (
    <BarChart
      sx={(theme) => ({
        [`.${barElementClasses.root}`]: {
          fill: (theme.vars || theme).palette.background.paper,
          strokeWidth: 2,
        },
        [`.MuiBarElement-series-l_id`]: {
          stroke: colors[0],
        },
        [`.MuiBarElement-series-r_id`]: {
          stroke: colors[1],
        },
        [`.${axisClasses.root}`]: {
          [`.${axisClasses.tick}, .${axisClasses.line}`]: {
            stroke: '#006BD6',
            strokeWidth: 3,
          },
          [`.${axisClasses.tickLabel}`]: {
            fill: '#006BD6',
          },
        },
        border: '1px solid rgba(0, 0, 0, 0.1)',
        backgroundImage:
          'linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)',
        backgroundSize: '35px 35px',
        backgroundPosition: '20px 20px, 20px 20px',
        ...theme.applyStyles('dark', {
          borderColor: 'rgba(255,255,255, 0.1)',
          backgroundImage:
            'linear-gradient(rgba(255,255,255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255, 0.1) 1px, transparent 1px)',
        }),
      })}
      xAxis={[{ data: labels }]}
      series={[
        { data: lData, label: 'l', id: 'l_id' },
        { data: rData, label: 'r', id: 'r_id' },
      ]}
      colors={colors}
      height={300}
    />
  );
}

```

### Gradients and patterns

It is possible to use gradients and patterns to fill the charts.
This can be done by passing your gradient or pattern definition as children of the chart component.

Note that the gradient or pattern defined that way is only usable for SVG.
So a direct definition like `color: "url(#Pattern)'` would cause undefined colors in HTML elements.

```tsx
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function GradientTooltip() {
  return (
    <BarChart
      series={[
        {
          label: 'series A',
          data: [50],
          color: 'url(#Pattern)',
        },
        {
          label: 'series B',
          data: [100],
          color: 'url(#Gradient)',
        },
      ]}
      height={200}
    >
      <linearGradient id="Gradient" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0" stopColor="#123456" />
        <stop offset="1" stopColor="#81b2e4" />
      </linearGradient>
      <pattern
        id="Pattern"
        patternUnits="userSpaceOnUse"
        width="20"
        height="40"
        patternTransform="scale(0.5)"
      >
        <rect x="0" y="0" width="100%" height="100%" fill="#123456" />
        <path
          d="M0 30h20L10 50zm-10-20h20L0 30zm20 0h20L20 30zM0-10h20L10 10z"
          strokeWidth="1"
          stroke="#81b2e4"
          fill="none"
        />
      </pattern>
    </BarChart>
  );
}

```
