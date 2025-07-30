---
title: Charts - Axis
productId: x-charts
components: ChartsAxis, ChartsReferenceLine, ChartsText, ChartsXAxis, ChartsYAxis, ChartsReferenceLine
---

# Charts - Axis

Axis provides associate values to element positions.

Axes are used in the following charts: `<LineChart />`, `<BarChart />`, `<ScatterChart />`.

## Defining axis

Like your data, axis definition plays a central role in the chart rendering.
It's responsible for the mapping between your data and element positions.

You can define custom axes by using `xAxis` and `yAxis` props.
Those props expect an array of objects.

Here is a demonstration with two lines with the same data.
But one uses a linear, and the other a log axis.
Each axis definition is identified by its property `id`.
Then each series specifies the axis they use with the `xAxisId` and `yAxisId` properties.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';

const sample = [1, 10, 30, 50, 70, 90, 100];

export default function ScaleExample() {
  return (
    <Box sx={{ width: '100%', maxWidth: 500 }}>
      <LineChart
        xAxis={[{ data: sample }]}
        yAxis={[
          { id: 'linearAxis', scaleType: 'linear', position: 'left' },
          { id: 'logAxis', scaleType: 'log', position: 'right' },
        ]}
        series={[
          { yAxisId: 'linearAxis', data: sample, label: 'linear' },
          { yAxisId: 'logAxis', data: sample, label: 'log' },
        ]}
        height={400}
      />
    </Box>
  );
}

```

:::info
The management of those ids is for advanced use cases, such as charts with multiple axes.
Or customized axes.

If you do not provide a `xAxisId` or `yAxisId`, the series will use the first axis defined.

That's why in most of the demonstrations with single x and y axis you will not see definitions of axis `id`, `xAxisId`, or `yAxisId`.
Those demonstrations use the defaultized values.
:::

### Axis type

The axis type is specified by its property `scaleType` which expect one of the following values:

- `'band'`: Split the axis in equal band. Mostly used for bar charts.
- `'point'`: Split the axis in equally spaced points. Mostly used for line charts on categories.
- `'linear'`, `'log'`, `'sqrt'`: Map numerical values to the space available for the chart. `'linear'` is the default behavior.
- `'time'`, `'utc'`: Map JavaScript `Date()` object to the space available for the chart.

### Axis data

The axis definition object also includes a `data` property.
Which expects an array of value coherent with the `scaleType`:

- For `'linear'`, `'log'`, or `'sqrt'` it should contain numerical values
- For `'time'` or `'utc'` it should contain `Date()` objects
- For `'band'` or `'point'` it can contain `string`, or numerical values

Some series types also require specific axis attributes:

- line plots require an `xAxis` to have `data` provided
- bar plots require an `xAxis` with `scaleType="band"` and some `data` provided.

### Axis formatter

Axis data can be displayed in the axes ticks and the tooltip, among other locations.
To modify how data is displayed use the `valueFormatter` property.

The second argument of `valueFormatter` provides some rendering context for advanced use cases.

In the next demo, `valueFormatter` is used to shorten months and introduce a new line for ticks.
It uses the `context.location` to determine where the value is rendered.

```tsx
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const otherSetting = {
  height: 300,
  yAxis: [{ label: 'rainfall (mm)', width: 60 }],
  grid: { horizontal: true },
};

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

const valueFormatter = (value: number | null) => `${value}mm`;

export default function FormatterDemo() {
  return (
    <BarChart
      dataset={dataset}
      xAxis={[
        {
          scaleType: 'band',
          dataKey: 'month',
          valueFormatter: (month, context) =>
            context.location === 'tick'
              ? `${month.slice(0, 3)} \n2023`
              : `${month} 2023`,
          height: 40,
        },
      ]}
      series={[{ dataKey: 'seoul', label: 'Seoul rainfall', valueFormatter }]}
      {...otherSetting}
    />
  );
}

```

#### Ticks without labels

In some cases, you may want to display ticks without labels.
For example, it is common that an axis with a log scale has ticks that are not labeled, as the labels can be too numerous or too complex to display, but are still necessary to indicate that it is a logarithmic scale.

The default tick formatter achieves this by rendering an empty string for ticks that should not show labels.
If you want to customize the formatting, but want to keep the default behavior for ticks without labels, you can check that `context.defaultTickLabel` property is different from the empty string.

```js
<ScatterChart
  xAxis={[
    {
      valueFormatter: (value, context) => {
        if (context.location === 'tick' && context.defaultTickLabel === '') {
          return '';
        }

        return `${value}€`;
      },
    },
  ]}
/>
```

#### Using the D3 formatter

The context gives you access to the axis scale, number of ticks (if applicable) and the default formatted value.
The D3 [tickFormat(tickNumber, specifier)](https://d3js.org/d3-scale/linear#tickFormat) method can be used to adapt the ticks' format based on the scale properties.

```tsx
import * as React from 'react';
import { ScaleLogarithmic } from '@mui/x-charts-vendor/d3-scale';
import { LineChart } from '@mui/x-charts/LineChart';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';

const otherSetting = {
  height: 300,
  grid: { horizontal: true, vertical: true },
};

// https://en.wikipedia.org/wiki/Low-pass_filter
const f0 = 440;
const frequencyResponse = (f: number) => 5 / Math.sqrt(1 + (f / f0) ** 2);

const dataset = [
  0.1, 0.5, 0.8, 1, 5, 8, 10, 50, 80, 100, 500, 800, 1_000, 5_000, 8_000, 10_000,
  50_000, 80_000, 100_000, 500_000, 800_000, 1_000_000,
].map((f) => ({ frequency: f, voltage: frequencyResponse(f) }));

export default function FormatterD3() {
  return (
    <LineChart
      dataset={dataset}
      xAxis={[
        {
          scaleType: 'log',
          label: 'f (Hz)',
          dataKey: 'frequency',
          tickNumber: 20,
          valueFormatter: (f, context) => {
            if (context.location === 'tick') {
              const d3Text = (
                context.scale as ScaleLogarithmic<number, number, never>
              ).tickFormat(
                context.tickNumber!,
                'e',
              )(f);

              return d3Text;
            }
            return `${f.toLocaleString()}Hz`;
          },
        },
      ]}
      yAxis={[
        {
          scaleType: 'log',
          label: 'Vo/Vi',
          width: 60,
          valueFormatter: (f, context) => {
            if (context.location === 'tick') {
              const d3Text = (
                context.scale as ScaleLogarithmic<number, number, never>
              ).tickFormat(
                30,
                'f',
              )(f);

              return d3Text;
            }
            return f.toLocaleString();
          },
        },
      ]}
      series={[{ dataKey: 'voltage' }]}
      {...otherSetting}
    >
      <ChartsReferenceLine x={f0} />
    </LineChart>
  );
}

```

### Axis sub domain

By default, the axis domain is computed such that all your data is visible.
To show a specific range of values, you can provide properties `min` and/or `max` to the axis definition.

```js
xAxis={[
  {
    min: 10,
    max: 50,
  },
]}
```

```tsx
import * as React from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { Chance } from 'chance';

const chance = new Chance(42);

const data = Array.from({ length: 200 }, () => ({
  x: chance.floating({ min: -25, max: 25 }),
  y: chance.floating({ min: -25, max: 25 }),
})).map((d, index) => ({ ...d, id: index }));

const minDistance = 10;

export default function MinMaxExample() {
  const [value, setValue] = React.useState<number[]>([-25, 25]);

  const handleChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        setValue([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setValue([clamped - minDistance, clamped]);
      }
    } else {
      setValue(newValue as number[]);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 500 }}>
      <ScatterChart
        xAxis={[
          {
            label: 'x',
            min: value[0],
            max: value[1],
          },
        ]}
        series={[{ data }]}
        height={300}
      />
      <Slider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={-40}
        max={40}
      />
    </Box>
  );
}

```

### Relative axis subdomain

You can adjust the axis range relatively to its data by using the `domainLimit` option.
It can take 3 different values:

- `"nice"` Rounds the domain at human friendly values. It's the default behavior.
- `"strict"` Sets the domain to the min/max value to display.
- `(minValue, maxValue) => { min, max }` Receives the calculated extremums as parameters, and should return the axis domain.

The demo below shows different ways to set the y-axis range.
They always display the same data, going from -15 to 92, but with different `domainLimit` settings.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { BarChart } from '@mui/x-charts/BarChart';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const settings = {
  height: 220,
  series: [{ data: [60, -15, 66, 68, 87, 82, 83, 85, 92, 75, 76, 50, 91] }],
  margin: { top: 20, bottom: 10 },
} as const;

// Extend a value to match a multiple of the step.
function extend(value: number, step: number) {
  if (value > 0) {
    // If >0 go to the next step
    return step * Math.ceil(value / step);
  }
  // If <0 go to the previous step
  return step * Math.floor(value / step);
}

export default function CustomDomainYAxis() {
  const [domainLimit, setDomainLimit] = React.useState<
    'nice' | 'strict' | 'function'
  >('nice');

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        select
        value={domainLimit}
        onChange={(event) =>
          setDomainLimit(event.target.value as 'nice' | 'strict' | 'function')
        }
        label="domain limit"
        sx={{ minWidth: 150, mb: 2 }}
      >
        <MenuItem value="nice">nice</MenuItem>
        <MenuItem value="strict">strict</MenuItem>
        <MenuItem value="function">function</MenuItem>
      </TextField>
      <BarChart
        yAxis={[
          {
            domainLimit:
              domainLimit === 'function'
                ? (min, max) => ({
                    min: extend(min, 10),
                    max: extend(max, 10),
                  })
                : domainLimit,
          },
        ]}
        {...settings}
      />
    </Box>
  );
}

```

### Axis direction

By default, the axes' directions are left to right and bottom to top.
You can change this behavior with the property `reverse`.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';

const dataset = [
  { min: -12, max: -4, precip: 79, month: 'Jan' },
  { min: -11, max: -3, precip: 66, month: 'Feb' },
  { min: -6, max: 2, precip: 76, month: 'Mar' },
  { min: 1, max: 9, precip: 106, month: 'Apr' },
  { min: 8, max: 17, precip: 105, month: 'Mai' },
  { min: 15, max: 24, precip: 114, month: 'Jun' },
  { min: 18, max: 26, precip: 106, month: 'Jul' },
  { min: 17, max: 26, precip: 105, month: 'Aug' },
  { min: 13, max: 21, precip: 100, month: 'Sept' },
  { min: 6, max: 13, precip: 116, month: 'Oct' },
  { min: 0, max: 6, precip: 93, month: 'Nov' },
  { min: -8, max: -1, precip: 93, month: 'Dec' },
];

const series = [
  { type: 'line', dataKey: 'min', color: '#577399' },
  { type: 'line', dataKey: 'max', color: '#fe5f55' },
  { type: 'bar', dataKey: 'precip', color: '#bfdbf7', yAxisId: 'rightAxis' },
] as const;

export default function ReverseExample() {
  const [reverseX, setReverseX] = React.useState(false);
  const [reverseLeft, setReverseLeft] = React.useState(false);
  const [reverseRight, setReverseRight] = React.useState(false);

  return (
    <Stack sx={{ width: '100%' }}>
      <Stack direction="row">
        <FormControlLabel
          checked={reverseX}
          control={
            <Checkbox onChange={(event) => setReverseX(event.target.checked)} />
          }
          label="reverse x-axis"
          labelPlacement="end"
        />
        <FormControlLabel
          checked={reverseLeft}
          control={
            <Checkbox onChange={(event) => setReverseLeft(event.target.checked)} />
          }
          label="reverse left axis"
          labelPlacement="end"
        />
        <FormControlLabel
          checked={reverseRight}
          control={
            <Checkbox onChange={(event) => setReverseRight(event.target.checked)} />
          }
          label="reverse right axis"
          labelPlacement="end"
        />
      </Stack>
      <Box sx={{ width: '100%' }}>
        <ChartContainer
          series={series}
          xAxis={[
            {
              scaleType: 'band',
              dataKey: 'month',
              label: 'Month',
              reverse: reverseX,
            },
          ]}
          yAxis={[
            { id: 'leftAxis', reverse: reverseLeft, width: 50 },
            { id: 'rightAxis', reverse: reverseRight, position: 'right', width: 50 },
          ]}
          dataset={dataset}
          height={400}
        >
          <ChartsGrid horizontal />
          <BarPlot />
          <LinePlot />
          <MarkPlot />

          <ChartsXAxis />
          <ChartsYAxis axisId="leftAxis" label="temperature (°C)" />
          <ChartsYAxis axisId="rightAxis" label="precipitation (mm)" />
          <ChartsTooltip />
        </ChartContainer>
      </Box>
    </Stack>
  );
}

```

## Grid

You can add a grid in the background of the cartesian chart with the `grid` prop.

It accepts an object with `vertical` and `horizontal` properties.
Setting those properties to `true` displays the grid lines.

If you use composition you can pass those as props to the `<ChartsGrid />` component.

```jsx
<BarChart grid={{ vertical: true }}>

<ChartContainer>
  <ChartsGrid vertical >
</ChartContainer>
```

```tsx
import * as React from 'react';
import { chartsGridClasses } from '@mui/x-charts/ChartsGrid';
import { BarChart } from '@mui/x-charts/BarChart';
import { dataset, valueFormatter } from '../dataset/weather';

const chartSetting = {
  yAxis: [{ label: 'rainfall (mm)', width: 60 }],
  height: 300,
};

export default function GridDemo() {
  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ dataKey: 'month' }]}
      series={[{ dataKey: 'seoul', label: 'Seoul rainfall', valueFormatter }]}
      grid={{ horizontal: true }}
      sx={{
        [`& .${chartsGridClasses.line}`]: { strokeDasharray: '5 3', strokeWidth: 2 },
      }}
      {...chartSetting}
    />
  );
}

```

## Tick position

### Automatic tick position

You can customize the number of ticks with the property `tickNumber`.

:::info
This number is not the exact number of ticks displayed.

Thanks to d3, ticks are placed to be human-readable.
For example, ticks for time axes will be placed on special values (years, days, half-days, ...).

If you set `tickNumber=5` but there are only 4 years to display in the axis, the component might choose to render ticks on the 4 years, instead of putting 5 ticks on some months.
:::

As a helper, you can also provide `tickMinStep` and `tickMaxStep` which will compute `tickNumber` such that the step between two ticks respect those min/max values.

Here the top axis has a `tickMinStep` of half a day, and the bottom axis a `tickMinStep` of a full day.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';

const timeData = [
  new Date(2023, 7, 31),
  new Date(2023, 7, 31, 12),
  new Date(2023, 8, 1),
  new Date(2023, 8, 1, 12),
  new Date(2023, 8, 2),
  new Date(2023, 8, 2, 12),
  new Date(2023, 8, 3),
  new Date(2023, 8, 3, 12),
  new Date(2023, 8, 4),
];

const y1 = [5, 5, 10, 90, 85, 70, 30, 25, 25];
const y2 = [90, 85, 70, 25, 23, 40, 45, 40, 50];

const valueFormatter = (date: Date) =>
  date.getHours() === 0
    ? date.toLocaleDateString('fr-FR', {
        month: '2-digit',
        day: '2-digit',
      })
    : date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
      });

const config = {
  series: [{ data: y1 }, { data: y2 }],
  height: 300,
};
const xAxisCommon = {
  data: timeData,
  scaleType: 'time',
  valueFormatter,
} as const;
export default function TickNumber() {
  return (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      <LineChart
        xAxis={[
          {
            ...xAxisCommon,
            tickMinStep: 3600 * 1000 * 24, // min step: 24h
          },
          {
            ...xAxisCommon,
            id: 'half days',
            position: 'top',
            tickMinStep: 3600 * 1000 * 12, // min step: 12hu
          },
        ]}
        yAxis={[{ position: 'none' }]}
        {...config}
      />
    </Box>
  );
}

```

### Fixed tick positions

If you want more control over the tick position, you can use the `tickInterval` property.

This property accepts an array of values.
Ticks will be placed at those values.

For axis with scale type `'point'`, the `tickInterval` property can be a filtering function of the type `(value, index) => boolean`.

In the next demo, both axes are with `scaleType='point'`.
The top axis displays the default behavior.
It shows a tick for each point.
The bottom axis uses a filtering function to only display a tick at the beginning of a day.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { ShowMarkParams } from '@mui/x-charts/models';
import { LineChart } from '@mui/x-charts/LineChart';

export default function TickPosition() {
  return (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      <LineChart
        xAxis={[
          {
            ...xAxisCommon,
            scaleType: 'point',
            tickInterval: (time) => time.getHours() === 0,
            position: 'bottom',
          },
          {
            ...xAxisCommon,
            scaleType: 'point',
            position: 'top',
          },
        ]}
        {...config}
      />
    </Box>
  );
}

const valueFormatter = (date: Date) =>
  date.toLocaleDateString('fr-FR', {
    month: '2-digit',
    day: '2-digit',
  });

const timeData = [
  new Date(2023, 7, 31),
  new Date(2023, 7, 31, 3),
  new Date(2023, 7, 31, 6),
  new Date(2023, 7, 31, 9),
  new Date(2023, 7, 31, 12),
  new Date(2023, 7, 31, 15),
  new Date(2023, 7, 31, 18),
  new Date(2023, 8, 1),
  new Date(2023, 8, 1, 3),
  new Date(2023, 8, 1, 6),
  new Date(2023, 8, 1, 9),
  new Date(2023, 8, 1, 12),
  new Date(2023, 8, 1, 15),
  new Date(2023, 8, 1, 18),
  new Date(2023, 8, 2),
  new Date(2023, 8, 2, 3),
  new Date(2023, 8, 2, 6),
  new Date(2023, 8, 2, 9),
  new Date(2023, 8, 2, 12),
  new Date(2023, 8, 2, 15),
  new Date(2023, 8, 2, 18),
  new Date(2023, 8, 3),
  new Date(2023, 8, 3, 3),
  new Date(2023, 8, 3, 6),
  new Date(2023, 8, 3, 9),
  new Date(2023, 8, 3, 12),
  new Date(2023, 8, 3, 15),
  new Date(2023, 8, 3, 18),
  new Date(2023, 8, 4),
];

const y1 = [
  5, 5.5, 5.3, 4.9, 5, 6.2, 8.9, 10, 15, 30, 80, 90, 94, 93, 85, 86, 75, 70, 68, 50,
  20, 30, 35, 28, 25, 27, 30, 28, 25,
];
const y2 = [
  90, 93, 89, 84, 85, 83, 73, 70, 63, 32, 30, 25, 18, 19, 23, 30, 32, 36, 40, 40, 42,
  45, 46, 42, 39, 40, 41, 43, 50,
];

const showMark = (params: ShowMarkParams) => {
  const { position } = params as ShowMarkParams<Date>;
  return position.getHours() === 0;
};

const config = {
  series: [
    { data: y1, showMark },
    { data: y2, showMark },
  ],
  height: 300,
  yAxis: [{ position: 'none' as const }],
};
const xAxisCommon = {
  data: timeData,
  scaleType: 'time',
  valueFormatter,
} as const;

```

### Filtering ticks label

You can display labels only on a subset of ticks with the `tickLabelInterval` property.
It's a filtering function in the `(value, index) => boolean` form.

For example `tickLabelInterval: (value, index) => index % 2 === 0` will show the label every two ticks.

:::warning
The `value` and `index` arguments are those of the ticks, not the axis data.
:::

By default, ticks are filtered such that their labels do not overlap.
You can override this behavior with `tickLabelInterval: () => true` which forces showing the tick label for each tick.

In this example, the top axis is a reference for the default behavior.
Notice that tick labels do not overflow.

At the bottom, you can see one tick for the beginning and the middle of the day but the tick label is only displayed for the beginning of the day.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { ShowMarkParams } from '@mui/x-charts/models';
import { LineChart } from '@mui/x-charts/LineChart';

export default function TickLabelPosition() {
  return (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      <LineChart
        xAxis={[
          {
            ...xAxisCommon,
            id: 'bottomAxis',
            scaleType: 'point',
            tickInterval: (time) => [0, 12].includes(time.getHours()),
            tickLabelInterval: (time) => time.getHours() === 0,
            position: 'bottom',
          },
          {
            ...xAxisCommon,
            id: 'topAxis',
            scaleType: 'point',
            position: 'top',
          },
        ]}
        yAxis={[{ position: 'none' }]}
        {...config}
      />
    </Box>
  );
}

const valueFormatter = (date: Date) =>
  date.toLocaleDateString('fr-FR', {
    month: '2-digit',
    day: '2-digit',
  });

const timeData = [
  new Date(2023, 7, 31),
  new Date(2023, 7, 31, 3),
  new Date(2023, 7, 31, 6),
  new Date(2023, 7, 31, 9),
  new Date(2023, 7, 31, 12),
  new Date(2023, 7, 31, 15),
  new Date(2023, 7, 31, 18),
  new Date(2023, 8, 1),
  new Date(2023, 8, 1, 3),
  new Date(2023, 8, 1, 6),
  new Date(2023, 8, 1, 9),
  new Date(2023, 8, 1, 12),
  new Date(2023, 8, 1, 15),
  new Date(2023, 8, 1, 18),
  new Date(2023, 8, 2),
  new Date(2023, 8, 2, 3),
  new Date(2023, 8, 2, 6),
  new Date(2023, 8, 2, 9),
  new Date(2023, 8, 2, 12),
  new Date(2023, 8, 2, 15),
  new Date(2023, 8, 2, 18),
  new Date(2023, 8, 3),
  new Date(2023, 8, 3, 3),
  new Date(2023, 8, 3, 6),
  new Date(2023, 8, 3, 9),
  new Date(2023, 8, 3, 12),
  new Date(2023, 8, 3, 15),
  new Date(2023, 8, 3, 18),
  new Date(2023, 8, 4),
];

const y1 = [
  5, 5.5, 5.3, 4.9, 5, 6.2, 8.9, 10, 15, 30, 80, 90, 94, 93, 85, 86, 75, 70, 68, 50,
  20, 30, 35, 28, 25, 27, 30, 28, 25,
];
const y2 = [
  90, 93, 89, 84, 85, 83, 73, 70, 63, 32, 30, 25, 18, 19, 23, 30, 32, 36, 40, 40, 42,
  45, 46, 42, 39, 40, 41, 43, 50,
];

const showMark = (params: ShowMarkParams) => {
  const { position } = params as ShowMarkParams<Date>;
  return position.getHours() === 0;
};

const config = {
  series: [
    { data: y1, showMark },
    { data: y2, showMark },
  ],
  height: 300,
};
const xAxisCommon = {
  data: timeData,
  scaleType: 'time',
  valueFormatter,
} as const;

```

## Position

The axis position can be customized with the `position` property of the axis configuration.
Its value can be:

- `'top'` or `'bottom'` for the x-axis.
- `'left'` or `'right'` for the y-axis.
- `'none'` to hide the axis.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { Chance } from 'chance';

const chance = new Chance(42);

const data = Array.from({ length: 200 }, () => ({
  x: chance.floating({ min: -25, max: 25 }),
  y: chance.floating({ min: -25, max: 25 }),
})).map((d, index) => ({ ...d, id: index }));

const params = {
  series: [{ data }],
  height: 300,
  margin: { top: 12, right: 12, bottom: 20, left: 12 },
};
export default function ModifyAxisPosition() {
  return (
    <Box sx={{ width: '100%', maxWidth: 500 }}>
      <ScatterChart
        {...params}
        xAxis={[{ position: 'top' }]}
        yAxis={[{ position: 'right' }]}
      />
    </Box>
  );
}

```

### Hiding axis

To hide an axis, set its `position` to `'none'`.
The axis is still computed and used for the scaling.

```tsx
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function HidingAxis() {
  return (
    <BarChart
      series={[{ data: [1, 2, 3, 2, 1] }]}
      xAxis={[{ data: ['A', 'B', 'C', 'D', 'E'] }]}
      yAxis={[{ position: 'none' }]}
      height={300}
      width={300}
    />
  );
}

```

### Multiple axes on the same side

You can display multiple axes on the same side.
If two or more axes share the same `position`, they are displayed in the order they are defined from closest to the chart to farthest.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';

const sample = [1, 10, 30, 50, 70, 90, 100];

export default function MultipleAxes() {
  return (
    <Box sx={{ width: '100%', maxWidth: 500 }}>
      <LineChart
        xAxis={[{ data: sample }]}
        yAxis={[
          { id: 'linearAxis', scaleType: 'linear', position: 'left', width: 40 },
          { id: 'logAxis', scaleType: 'log', position: 'left' },
        ]}
        series={[
          { yAxisId: 'linearAxis', data: sample, label: 'linear' },
          { yAxisId: 'logAxis', data: sample, label: 'log' },
        ]}
        height={400}
      />
    </Box>
  );
}

```

### Grouped Axes

You can group axes together by rendering more than one axis on the same side.

```tsx
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { AxisValueFormatterContext } from '@mui/x-charts/internals';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

export default function GroupedAxes() {
  return (
    <BarChart
      xAxis={[
        {
          id: 'months',
          scaleType: 'band',
          data: time,
          valueFormatter: formatShortMonth,
          height: 24,
        },
        {
          scaleType: 'band',
          data: time.filter((_, index) => index % 3 === 0),
          valueFormatter: formatQuarterYear,
          position: 'bottom',
          tickLabelPlacement: 'middle',
          height: 35,
          disableLine: true,
          disableTicks: true,
        },
      ]}
      {...chartConfig}
      sx={{
        [`& .${axisClasses.id}-months .${axisClasses.tickContainer}:nth-child(3n - 1) .${axisClasses.tick}`]:
          { transform: 'scaleY(4)' },
      }}
    />
  );
}

const formatQuarterYear = (date: Date, context: AxisValueFormatterContext) => {
  if (context.location === 'tick') {
    const quarter = Math.floor(date.getMonth() / 3) + 1;
    const year = date.getFullYear().toString().slice(-2);
    return `Q${quarter} '${year}`;
  }
  return date.toLocaleDateString('en-US', { month: 'long' });
};

const formatShortMonth = (date: Date, context: AxisValueFormatterContext) => {
  if (context.location === 'tick') {
    return date.toLocaleDateString('en-US', { month: 'short' });
  }
  return date.toLocaleDateString('en-US', { month: 'long' });
};

const time = [
  new Date(2015, 0, 1),
  new Date(2015, 1, 1),
  new Date(2015, 2, 1),
  new Date(2015, 3, 1),
  new Date(2015, 4, 1),
  new Date(2015, 5, 1),
  new Date(2015, 6, 1),
  new Date(2015, 7, 1),
  new Date(2015, 8, 1),
  new Date(2015, 9, 1),
  new Date(2015, 10, 1),
  new Date(2015, 11, 1),
];
const a = [
  4000, 3000, 2000, 2780, 1890, 2390, 3490, 2400, 1398, 9800, 3908, 4800, 2400,
];
const b = [
  2400, 1398, 9800, 3908, 4800, 3800, 4300, 2181, 2500, 2100, 3000, 2000, 3908,
];

const getPercents = (array: number[]) =>
  array.map((v, index) => (100 * v) / (a[index] + b[index]));

const chartConfig = {
  height: 300,
  series: [
    {
      data: getPercents(a),
      label: 'Income',
      valueFormatter: (value: number | null) => `${(value ?? 0).toFixed(0)}%`,
    },
    {
      data: getPercents(b),
      label: 'Expenses',
      valueFormatter: (value: number | null) => `${(value ?? 0).toFixed(0)}%`,
    },
  ],
  yAxis: [
    {
      valueFormatter: (value: number | null) => `${(value ?? 0).toFixed(0)}%`,
    },
  ],
} as const;

```

## Axis customization

You can further customize the axis rendering besides the axis definition.

### Fixing tick label overflow issues

When your tick labels are too long, they are clipped to avoid overflowing.
If you would like to reduce clipping due to overflow, you can [apply an angle to the tick labels](/x/react-charts/axis/#text-customization) or [increase the axis size](/x/react-charts/styling/#placement) to accommodate them.

In the following demo, the size of the x- and y-axes is modified to increase the space available for tick labels.

The first and last tick labels may bleed into the margin. If that margin is not enough to display the label, it might be clipped.
To avoid this, you can use the `margin` prop to increase the space between the chart and the edge of the container.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { BarChart } from '@mui/x-charts/BarChart';

export default function MarginAndLabelPosition() {
  const [fixMargin, setFixMargin] = React.useState(true);

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <FormControlLabel
          checked={fixMargin}
          control={
            <Checkbox onChange={(event) => setFixMargin(event.target.checked)} />
          }
          label="Increase axes size"
          labelPlacement="end"
        />
      </Stack>

      <BarChart
        xAxis={[
          {
            scaleType: 'band',
            dataKey: 'code',
            valueFormatter: (value, context) =>
              context.location === 'tick'
                ? value.split('').join('\n')
                : usAirportPassengers.find((item) => item.code === value)!.fullName,
            label: 'airports',
            height: fixMargin ? 75 : undefined,
          },
        ]}
        // Other props
        height={300}
        dataset={usAirportPassengers}
        series={[
          { dataKey: '2018', label: '2018' },
          { dataKey: '2019', label: '2019' },
          { dataKey: '2020', label: '2020' },
          { dataKey: '2021', label: '2021' },
          { dataKey: '2022', label: '2022' },
        ]}
        hideLegend
        yAxis={[
          {
            valueFormatter: (value: number) => `${(value / 1000).toLocaleString()}k`,
            label: 'passengers',
            width: fixMargin ? 85 : undefined,
          },
        ]}
      />
    </Box>
  );
}

const usAirportPassengers = [
  {
    fullName: 'Hartsfield–Jackson Atlanta International Airport',
    code: 'ATL',
    2022: 45396001,
    2021: 36676010,
    2020: 20559866,
    2019: 53505795,
    2018: 51865797,
  },
  {
    fullName: 'Dallas/Fort Worth International Airport',
    code: 'DFW',
    2022: 35345138,
    2021: 30005266,
    2020: 18593421,
    2019: 35778573,
    2018: 32821799,
  },
  {
    fullName: 'Denver International Airport',
    code: 'DEN',
    2022: 33773832,
    2021: 28645527,
    2020: 16243216,
    2019: 33592945,
    2018: 31362941,
  },
  {
    fullName: "O'Hare International Airport",
    code: 'ORD',
    2022: 33120474,
    2021: 26350976,
    2020: 14606034,
    2019: 40871223,
    2018: 39873927,
  },
  {
    fullName: 'Los Angeles International Airport',
    code: 'LAX',
    2022: 32326616,
    2021: 23663410,
    2020: 14055777,
    2019: 42939104,
    2018: 42624050,
  },
  {
    fullName: 'John F. Kennedy International Airport',
    code: 'JFK',
    2022: 26919982,
    2021: 15273342,
    2020: 8269819,
    2019: 31036655,
    2018: 30620769,
  },
  {
    fullName: 'Harry Reid International Airport',
    code: 'LAS',
    2022: 25480500,
    2021: 19160342,
    2020: 10584059,
    2019: 24728361,
    2018: 23795012,
  },
  {
    fullName: 'Orlando International Airport',
    code: 'MCO',
    2022: 24469733,
    2021: 19618838,
    2020: 10467728,
    2019: 24562271,
    2018: 23202480,
  },
  {
    fullName: 'Miami International Airport',
    code: 'MIA',
    2022: 23949892,
    2021: 17500096,
    2020: 8786007,
    2019: 21421031,
    2018: 21021640,
  },
  {
    fullName: 'Charlotte Douglas International Airport',
    code: 'CLT',
    2022: 23100300,
    2021: 20900875,
    2020: 12952869,
    2019: 24199688,
    2018: 22281949,
  },
  {
    fullName: 'Seattle–Tacoma International Airport',
    code: 'SEA',
    2022: 22157862,
    2021: 17430195,
    2020: 9462411,
    2019: 25001762,
    2018: 24024908,
  },
  {
    fullName: 'Phoenix Sky Harbor International Airport',
    code: 'PHX',
    2022: 21852586,
    2021: 18940287,
    2020: 10531436,
    2019: 22433552,
    2018: 21622580,
  },
  {
    fullName: 'Newark Liberty International Airport',
    code: 'EWR',
    2022: 21572147,
    2021: 14514049,
    2020: 7985474,
    2019: 23160763,
    2018: 22797602,
  },
  {
    fullName: 'San Francisco International Airport',
    code: 'SFO',
    2022: 20411420,
    2021: 11725347,
    2020: 7745057,
    2019: 27779230,
    2018: 27790717,
  },
  {
    fullName: 'George Bush Intercontinental Airport',
    code: 'IAH',
    2022: 19814052,
    2021: 16242821,
    2020: 8682558,
    2019: 21905309,
    2018: 21157398,
  },
  {
    fullName: 'Logan International Airport',
    code: 'BOS',
    2022: 17443775,
    2021: 10909817,
    2020: 6035452,
    2019: 20699377,
    2018: 20006521,
  },
  {
    fullName: 'Fort Lauderdale–Hollywood International Airport',
    code: 'FLL',
    2022: 15370165,
    2021: 13598994,
    2020: 8015744,
    2019: 17950989,
    2018: 17612331,
  },
  {
    fullName: 'Minneapolis–Saint Paul International Airport',
    code: 'MSP',
    2022: 15242089,
    2021: 12211409,
    2020: 7069720,
    2019: 19192917,
    2018: 18361942,
  },
  {
    fullName: 'LaGuardia Airport',
    code: 'LGA',
    2022: 14367463,
    2021: 7827307,
    2020: 4147116,
    2019: 15393601,
    2018: 15058501,
  },
  {
    fullName: 'Detroit Metropolitan Airport',
    code: 'DTW',
    2022: 13751197,
    2021: 11517696,
    2020: 6822324,
    2019: 18143040,
    2018: 17436837,
  },
];

```

### Rendering

Axes rendering can be further customized. Below is an interactive demonstration of the axis props.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { Chance } from 'chance';

const chance = new Chance(42);

const data = Array.from({ length: 200 }, () => ({
  x: chance.floating({ min: -25, max: 25 }),
  y: chance.floating({ min: -25, max: 25 }),
})).map((d, index) => ({ ...d, id: index }));

const defaultXAxis = {
  disableLine: false,
  disableTicks: false,
  fontSize: 12,
  label: 'My axis',
  tickSize: 6,
};
export default function AxisCustomization() {
  return (
    <ChartsUsageDemo
      componentName="Alert"
      data={{
        disableLine: { knob: 'switch', defaultValue: false },
        disableTicks: { knob: 'switch', defaultValue: false },
        label: { knob: 'input', defaultValue: 'my axis' },
        tickSize: { knob: 'number', defaultValue: 6 },
      }}
      renderDemo={(props) => (
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <ScatterChart
            series={[
              {
                type: 'scatter',
                id: 'linear',
                data,
              },
            ]}
            yAxis={[{ position: 'none' }]}
            xAxis={[
              {
                ...defaultXAxis,
                ...props,
              },
            ]}
            height={300}
          />
        </Box>
      )}
      getCode={({
        props,
      }) => `import { ScatterChart } from '@mui/x-charts/ScatterChart';

<ScatterChart
  // ...
  xAxis={{
    disableLine: ${props.disableLine},
    disableTicks: ${props.disableTicks},
    label: "${props.label}",
    tickSize: ${props.tickSize},
  }}
/>
`}
    />
  );
}

```

### Text customization

To customize the text elements (ticks label and the axis label) use the `tickLabelStyle` and `labelStyle` properties of the axis configuration.

When not set, the default values for the properties `textAnchor` and `dominantBaseline` depend on the value of the `angle` property.
You can test below how the value of `angle` influences them.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import ChartsUsageDemo from 'docsx/src/modules/components/ChartsUsageDemo';
import { BarChart } from '@mui/x-charts/BarChart';
import { dataset, valueFormatter } from '../dataset/weather';

const chartSetting = {
  height: 300,
};

export default function AxisTextCustomization() {
  return (
    <ChartsUsageDemo
      componentName="Alert"
      data={
        {
          angle: { knob: 'number', defaultValue: 45, min: -180, max: 180 },
          textAnchor: {
            knob: 'select',
            defaultValue: 'undefined',
            options: ['undefined', 'start', 'middle', 'end'],
          },
          dominantBaseline: {
            knob: 'select',
            defaultValue: 'undefined',
            options: ['undefined', 'auto', 'central', 'hanging'],
          },
          fontSize: { knob: 'number', defaultValue: 12 },
          labelFontSize: { knob: 'number', defaultValue: 14 },
        } as const
      }
      renderDemo={(props) => (
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <BarChart
            dataset={dataset}
            xAxis={[
              {
                dataKey: 'month',
                label: 'months',
                height: 60,
                labelStyle: {
                  fontSize: props.labelFontSize,
                },
                tickLabelStyle: {
                  angle: props.angle,
                  ...(props.textAnchor === 'undefined'
                    ? {}
                    : { textAnchor: props.textAnchor }),
                  ...(props.dominantBaseline === 'undefined'
                    ? {}
                    : { dominantBaseline: props.dominantBaseline }),
                  fontSize: props.fontSize,
                },
              },
            ]}
            series={[
              { dataKey: 'london', label: 'London', valueFormatter },
              { dataKey: 'paris', label: 'Paris', valueFormatter },
              { dataKey: 'newYork', label: 'New York', valueFormatter },
              { dataKey: 'seoul', label: 'Seoul', valueFormatter },
            ]}
            {...chartSetting}
          />
        </Box>
      )}
      getCode={({ props }) => `import { BarChart } from '@mui/x-charts/BarChart';

<ScatterChart
  // ...
  xAxis={[
    {
      labelStyle: {
        fontSize: ${props.labelFontSize},
      },
      tickLabelStyle: {
        angle: ${props.angle},${
          props.textAnchor === 'undefined'
            ? ''
            : `
        textAnchor: '${props.textAnchor}',`
        }${
          props.dominantBaseline === 'undefined'
            ? ''
            : `
        dominantBaseline: '${props.dominantBaseline}',`
        }
        fontSize: ${props.fontSize},
      },
    },
  ]}
/>`}
    />
  );
}

```

## Composition

If you are using composition, you have to provide the axis settings in the `<ChartContainer />` by using `xAxis` and `yAxis` props.

It will provide all the scaling properties to its children, and allows you to use `<XAxis/>` and `<YAxis/>` components as children.
Those components require an `axisId` prop to link them to an axis you defined in the `<ChartContainer />`.

You can choose their position with `position` prop which accepts `'top'`/`'bottom'` for `<XAxis />` and `'left'`/`'right'` for `<YAxis />`.
Other props are similar to the ones defined in the [previous section](/x/react-charts/axis/#rendering).

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { LinePlot } from '@mui/x-charts/LineChart';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';

export default function AxisWithComposition() {
  return (
    <Box sx={{ width: '100%', maxWidth: 600 }}>
      <ChartContainer
        xAxis={[
          {
            scaleType: 'band',
            data: ['Q1', 'Q2', 'Q3', 'Q4'],
            id: 'quarters',
            label: 'Quarters',
            height: 50,
          },
        ]}
        yAxis={[
          { id: 'money', position: 'right', width: 65 },
          { id: 'quantities', position: 'left', width: 65 },
        ]}
        series={[
          {
            type: 'line',
            id: 'revenue',
            yAxisId: 'money',
            data: [5645, 7542, 9135, 12221],
          },
          {
            type: 'bar',
            id: 'cookies',
            yAxisId: 'quantities',
            data: [3205, 2542, 3135, 8374],
          },
          {
            type: 'bar',
            id: 'icecream',
            yAxisId: 'quantities',
            data: [1645, 5542, 5146, 3735],
          },
        ]}
        height={400}
      >
        <BarPlot />
        <LinePlot />
        <ChartsXAxis
          axisId="quarters"
          label="2021 quarters"
          labelStyle={{ fontSize: 18 }}
        />
        <ChartsYAxis axisId="quantities" label="# units sold" />
        <ChartsYAxis axisId="money" label="revenue" />
      </ChartContainer>
    </Box>
  );
}

```

### Reference line

The `<ChartsReferenceLine />` component add a reference line to the charts.
You can provide an `x` or `y` prop to get a vertical or horizontal line respectively at this value.

You can add a `label` to this reference line.
It can be placed with `labelAlign` prop which accepts `'start'`, `'middle'`, and `'end'` values.
Elements can be styled with `lineStyle` and `labelStyle` props.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { LinePlot } from '@mui/x-charts/LineChart';
import { LineSeriesType } from '@mui/x-charts/models';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';

const timeData = [
  new Date(2023, 7, 31),
  new Date(2023, 7, 31, 12),
  new Date(2023, 8, 1),
  new Date(2023, 8, 1, 12),
  new Date(2023, 8, 2),
  new Date(2023, 8, 2, 12),
  new Date(2023, 8, 3),
  new Date(2023, 8, 3, 12),
  new Date(2023, 8, 4),
];

const y1 = [5, 5, 10, 90, 85, 70, 30, 25, 25];
const y2 = [90, 85, 70, 25, 23, 40, 45, 40, 50];

const config = {
  series: [
    { type: 'line', data: y1 },
    { type: 'line', data: y2 },
  ] as LineSeriesType[],
  height: 400,
  xAxis: [
    {
      data: timeData,
      scaleType: 'time',
      valueFormatter: (date: Date) =>
        date.getHours() === 0
          ? date.toLocaleDateString('fr-FR', {
              month: '2-digit',
              day: '2-digit',
            })
          : date.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
            }),
    } as const,
  ],
};

export default function ReferenceLine() {
  return (
    <Box sx={{ width: '100%', maxWidth: 600 }}>
      <ChartContainer {...config}>
        <LinePlot />
        <ChartsReferenceLine
          x={new Date(2023, 8, 2, 9)}
          lineStyle={{ strokeDasharray: '10 5' }}
          labelStyle={{ fontSize: '10', lineHeight: 1.2 }}
          label={`Wake up\n9AM`}
          labelAlign="start"
        />
        <ChartsReferenceLine y={50} label="Middle value" labelAlign="end" />
        <ChartsXAxis />
        <ChartsYAxis />
      </ChartContainer>
    </Box>
  );
}

```
