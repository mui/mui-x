---
title: Charts - Areas demonstration
productId: x-charts
components: LineChart, LineElement, LineHighlightElement, LineHighlightPlot, LinePlot, MarkElement, MarkPlot, AreaElement, AreaPlot
---

# Charts - Areas demonstration

This page groups demonstration using area charts.

## SimpleAreaChart

```tsx
import * as React from 'react';
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart';

const margin = { right: 24 };
const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export default function SimpleAreaChart() {
  return (
    <LineChart
      height={300}
      series={[{ data: uData, label: 'uv', area: true, showMark: false }]}
      xAxis={[{ scaleType: 'point', data: xLabels }]}
      sx={{
        [`& .${lineElementClasses.root}`]: {
          display: 'none',
        },
      }}
      margin={margin}
    />
  );
}

```

## StackedAreaChart

```tsx
import * as React from 'react';
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart';

const margin = { right: 24 };
const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const amtData = [2400, 2210, 0, 2000, 2181, 2500, 2100];
const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export default function StackedAreaChart() {
  return (
    <LineChart
      height={300}
      series={[
        { data: uData, label: 'uv', area: true, stack: 'total', showMark: false },
        { data: pData, label: 'pv', area: true, stack: 'total', showMark: false },
        {
          data: amtData,
          label: 'amt',
          area: true,
          stack: 'total',
          showMark: false,
        },
      ]}
      xAxis={[{ scaleType: 'point', data: xLabels }]}
      yAxis={[{ width: 50 }]}
      sx={{
        [`& .${lineElementClasses.root}`]: {
          display: 'none',
        },
      }}
      margin={margin}
    />
  );
}

```

## TinyAreaChart

```tsx
import * as React from 'react';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { AreaPlot } from '@mui/x-charts/LineChart';

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export default function TinyAreaChart() {
  return (
    <ChartContainer
      width={500}
      height={300}
      series={[
        {
          data: uData,
          type: 'line',
          label: 'uv',
          area: true,
          stack: 'total',
        },
      ]}
      xAxis={[{ scaleType: 'point', data: xLabels }]}
    >
      <AreaPlot />
    </ChartContainer>
  );
}

```

## PercentAreaChart

```tsx
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const time = [
  new Date(2015, 1, 0),
  new Date(2015, 2, 0),
  new Date(2015, 3, 0),
  new Date(2015, 4, 0),
  new Date(2015, 5, 0),
  new Date(2015, 6, 0),
  new Date(2015, 7, 0),
];
const a = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const b = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const c = [2400, 2210, 2290, 2000, 2181, 2500, 2100];

const getPercents = (array: number[]) =>
  array.map((v, index) => (100 * v) / (a[index] + b[index] + c[index]));

export default function PercentAreaChart() {
  return (
    <LineChart
      height={300}
      series={[
        {
          data: getPercents(a),
          type: 'line',
          label: 'a',
          area: true,
          stack: 'total',
          showMark: false,
        },
        {
          data: getPercents(b),
          type: 'line',
          label: 'b',
          area: true,
          stack: 'total',
          showMark: false,
        },
        {
          data: getPercents(c),
          type: 'line',
          label: 'c',
          area: true,
          stack: 'total',
          showMark: false,
        },
      ]}
      xAxis={[
        {
          scaleType: 'time',
          data: time,
          min: time[0].getTime(),
          max: time[time.length - 1].getTime(),
        },
      ]}
    />
  );
}

```

## AreaChartConnectNulls

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';

const data = [4000, 3000, 2000, null, 1890, 2390, 3490];
const xData = ['Page A', 'Page B', 'Page C', 'Page D', 'Page E', 'Page F', 'Page G'];
const margin = { right: 24 };

export default function AreaChartConnectNulls() {
  return (
    <Stack sx={{ width: '100%' }}>
      <LineChart
        xAxis={[{ data: xData, scaleType: 'point' }]}
        series={[{ data, showMark: false, area: true }]}
        height={200}
        margin={margin}
      />
      <LineChart
        xAxis={[{ data: xData, scaleType: 'point' }]}
        series={[{ data, showMark: false, area: true, connectNulls: true }]}
        height={200}
        margin={margin}
      />
    </Stack>
  );
}

```

## AreaChartFillByValue

To display multiple colors in the area you can specify a gradient to fill the area (the same method can be applied on other SVG components).

You can pass this gradient definition as a children of the `<LineChart />` and use `sx` to override the area `fill` property.
To do so you will need to use the [`<linearGradient />`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/linearGradient) and [`<stop />`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/stop) SVG elements.

The first part is to get the SVG total height.
Which can be done with the `useDrawingArea()` hook.
It's useful to define the `<linearGradient />` as a vector that goes from the top to the bottom of our SVG container.

Then to define where the gradient should switch from one color to another, you can use the `useYScale` hook to get the y coordinate of value 0.

:::info
The `<stop />` offset is a ratio of gradient vector.
That's why you need to divide the coordinate by the SVG height.
:::

```tsx
import * as React from 'react';
import { ScaleLinear } from 'd3-scale';
import { green, red } from '@mui/material/colors';
import Stack from '@mui/material/Stack';
import { useYScale, useDrawingArea } from '@mui/x-charts/hooks';
import { LineChart, areaElementClasses } from '@mui/x-charts/LineChart';

const margin = { right: 24, bottom: 0 };
const data = [4000, 3000, -1000, 500, -2100, -250, 3490];
const xData = ['Page A', 'Page B', 'Page C', 'Page D', 'Page E', 'Page F', 'Page G'];

type ColorSwitchProps = {
  threshold: number;
  color1: string;
  color2: string;
  id: string;
};

function ColorSwitch({ threshold, color1, color2, id }: ColorSwitchProps) {
  const { top, height, bottom } = useDrawingArea();
  const svgHeight = top + bottom + height;

  const scale = useYScale() as ScaleLinear<number, number>; // You can provide the axis Id if you have multiple ones
  const y0 = scale(threshold); // The coordinate of the origin
  const off = y0 !== undefined ? y0 / svgHeight : 0;

  return (
    <defs>
      <linearGradient
        id={id}
        x1="0"
        x2="0"
        y1="0"
        y2={`${svgHeight}px`}
        gradientUnits="userSpaceOnUse" // Use the SVG coordinate instead of the component ones.
      >
        <stop offset={off} stopColor={color1} stopOpacity={1} />
        <stop offset={off} stopColor={color2} stopOpacity={1} />
      </linearGradient>
    </defs>
  );
}

export default function AreaChartFillByValue() {
  return (
    <Stack direction="column" width="100%" spacing={1}>
      <LineChart
        xAxis={[{ data: xData, scaleType: 'point' }]}
        yAxis={[{ min: -3000, max: 4000, width: 50 }]}
        series={[{ data, showMark: false, area: true }]}
        height={200}
        margin={margin}
        sx={{
          [`& .${areaElementClasses.root}`]: {
            fill: 'url(#switch-color-id-1)',
            filter: 'none', // Remove the default filter.
          },
        }}
      >
        <ColorSwitch
          color1="#11B678" // green
          color2="#FF3143" // red
          threshold={0}
          id="switch-color-id-1"
        />
        <rect x={0} y={0} width={5} height="100%" fill="url(#switch-color-id-1)" />
      </LineChart>

      <LineChart
        xAxis={[{ data: xData, scaleType: 'point' }]}
        yAxis={[{ min: -3000, max: 4000, width: 50 }]}
        series={[{ data, showMark: false, area: true }]}
        height={200}
        margin={margin}
        sx={{
          [`& .${areaElementClasses.root}`]: {
            fill: 'url(#switch-color-id-2)',
            filter: 'none', // Remove the default filter.
          },
        }}
      >
        <ColorPalette id="switch-color-id-2" />

        <rect x={0} y={0} width={5} height="100%" fill="url(#switch-color-id-2)" />
      </LineChart>
    </Stack>
  );
}

function ColorPalette({ id }: { id: string }) {
  const { top, height, bottom } = useDrawingArea();
  const svgHeight = top + bottom + height;

  const scale = useYScale() as ScaleLinear<number, number>; // You can provide the axis Id if you have multiple ones

  return (
    <defs>
      <linearGradient
        id={id}
        x1="0"
        x2="0"
        y1="0"
        y2={`${svgHeight}px`}
        gradientUnits="userSpaceOnUse" // Use the SVG coordinate instead of the component ones.
      >
        <stop
          offset={scale(5000) / svgHeight}
          stopColor={green[400]}
          stopOpacity={1}
        />
        <stop
          offset={scale(4000) / svgHeight}
          stopColor={green[400]}
          stopOpacity={1}
        />
        <stop
          offset={scale(4000) / svgHeight}
          stopColor={green[300]}
          stopOpacity={1}
        />
        <stop
          offset={scale(3000) / svgHeight}
          stopColor={green[300]}
          stopOpacity={1}
        />
        <stop
          offset={scale(3000) / svgHeight}
          stopColor={green[200]}
          stopOpacity={1}
        />
        <stop
          offset={scale(2000) / svgHeight}
          stopColor={green[200]}
          stopOpacity={1}
        />
        <stop
          offset={scale(2000) / svgHeight}
          stopColor={green[100]}
          stopOpacity={1}
        />
        <stop
          offset={scale(1000) / svgHeight}
          stopColor={green[100]}
          stopOpacity={1}
        />
        <stop
          offset={scale(1000) / svgHeight}
          stopColor={green[50]}
          stopOpacity={1}
        />
        <stop offset={scale(0) / svgHeight} stopColor={green[50]} stopOpacity={1} />
        <stop offset={scale(0) / svgHeight} stopColor={red[100]} stopOpacity={1} />
        <stop
          offset={scale(-1000) / svgHeight}
          stopColor={red[100]}
          stopOpacity={1}
        />
        <stop
          offset={scale(-1000) / svgHeight}
          stopColor={red[200]}
          stopOpacity={1}
        />
        <stop
          offset={scale(-2000) / svgHeight}
          stopColor={red[200]}
          stopOpacity={1}
        />
        <stop
          offset={scale(-3000) / svgHeight}
          stopColor={red[300]}
          stopOpacity={1}
        />
      </linearGradient>
    </defs>
  );
}

```
