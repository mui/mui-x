---
title: Charts - Bar demonstration
productId: x-charts
components: BarChart, BarElement, BarPlot
---

# Charts - Bar demonstration

This page groups demonstration using bar charts.

## TinyBarChart

```tsx
import * as React from 'react';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';

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

export default function TinyBarChart() {
  return (
    <ChartContainer
      width={500}
      height={300}
      series={[{ data: uData, label: 'uv', type: 'bar' }]}
      xAxis={[{ scaleType: 'band', data: xLabels }]}
    >
      <BarPlot />
    </ChartContainer>
  );
}

```

## SimpleBarChart

```tsx
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export default function SimpleBarChart() {
  return (
    <BarChart
      height={300}
      series={[
        { data: pData, label: 'pv', id: 'pvId' },
        { data: uData, label: 'uv', id: 'uvId' },
      ]}
      xAxis={[{ data: xLabels }]}
      yAxis={[{ width: 50 }]}
    />
  );
}

```

## StackedBarChart

```tsx
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export default function StackedBarChart() {
  return (
    <BarChart
      height={300}
      series={[
        { data: pData, label: 'pv', id: 'pvId', stack: 'total' },
        { data: uData, label: 'uv', id: 'uvId', stack: 'total' },
      ]}
      xAxis={[{ data: xLabels }]}
      yAxis={[{ width: 50 }]}
    />
  );
}

```

## MixedBarChart

```tsx
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const amtData = [2400, 2210, 2290, 2000, 2181, 2500, 2100];

const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export default function MixedBarChart() {
  return (
    <BarChart
      height={300}
      series={[
        { data: pData, label: 'pv', stack: 'stack1' },
        { data: amtData, label: 'amt' },
        { data: uData, label: 'uv', stack: 'stack1' },
      ]}
      xAxis={[{ data: xLabels }]}
      yAxis={[{ width: 50 }]}
    />
  );
}

```

## PositiveAndNegativeBarChart

```tsx
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, -9800, 3908, 4800, -3800, 4300];

const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export default function PositiveAndNegativeBarChart() {
  return (
    <BarChart
      height={300}
      series={[
        { data: pData, label: 'pv' },
        { data: uData, label: 'uv' },
      ]}
      xAxis={[{ data: xLabels }]}
      yAxis={[{ width: 60, max: 10000 }]}
    />
  );
}

```

## BarChartStackedBySign

```tsx
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const pData = [2400, 1398, -9800, 3908, 4800, -3800, 4300];
const uData = [4000, -3000, -2000, 2780, -1890, 2390, 3490];

const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export default function BarChartStackedBySign() {
  return (
    <BarChart
      height={300}
      series={[
        { data: pData, label: 'pv', id: 'pvId', stack: 'stack1' },
        { data: uData, label: 'uv', id: 'uvId', stack: 'stack1' },
      ]}
      xAxis={[{ data: xLabels }]}
      yAxis={[{ width: 60 }]}
    />
  );
}

```

## BiaxialBarChart

```tsx
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];

const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export default function BiaxialBarChart() {
  return (
    <BarChart
      height={300}
      series={[
        {
          data: pData,
          label: 'pv',
          id: 'pvId',

          yAxisId: 'leftAxisId',
        },
        {
          data: uData,
          label: 'uv',
          id: 'uvId',

          yAxisId: 'rightAxisId',
        },
      ]}
      xAxis={[{ data: xLabels }]}
      yAxis={[
        { id: 'leftAxisId', width: 50 },
        { id: 'rightAxisId', position: 'right' },
      ]}
    />
  );
}

```

## Population pyramid

```tsx
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';

const ageGroups = [
  '100+ yrs',
  '95-99 yrs',
  '90-94 yrs',
  '85-89 yrs',
  '80-84 yrs',
  '75-79 yrs',
  '70-74 yrs',
  '65-69 yrs',
  '60-64 yrs',
  '55-59 yrs',
  '50-54 yrs',
  '45-49 yrs',
  '40-44 yrs',
  '35-39 yrs',
  '30-34 yrs',
  '25-29 yrs',
  '20-24 yrs',
  '15-19 yrs',
  '10-14 yrs',
  '5-9 yrs',
  '0-4 yrs',
];

const male = [
  1139, 8291, 50323, 201240, 476263, 696606, 1012668, 1478069, 2042614, 2068112,
  2258061, 2061862, 2067075, 1808706, 1796779, 1933726, 1620461, 1183580, 1189663,
  1097221, 766227,
];

const female = [
  5770, 36739, 168603, 445118, 762492, 899933, 1152098, 1585781, 2105499, 2045845,
  2231491, 2000130, 1967944, 1673805, 1593655, 1695058, 1484776, 1104293, 1122176,
  1044863, 727814,
];

const numberFormatter = Intl.NumberFormat('en-US', {
  useGrouping: true,
});
const numberWithSuffixFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
});
const valueFormatter = (population: number | null) =>
  population ? `${numberFormatter.format(Math.abs(population))}` : '';

export default function PopulationPyramidBarChart() {
  return (
    <Stack width="100%" sx={{ mx: [0, 4] }}>
      <Typography variant="h6" component="span" textAlign="center">
        South Korea Population Pyramid - 2022
      </Typography>
      <BarChart
        height={500}
        layout="horizontal"
        margin={{ right: 0, left: 0 }}
        series={[
          {
            data: male.map((population) => -population),
            label: 'Male',
            type: 'bar',
            valueFormatter,
            stack: 'stack',
          },
          {
            data: female,
            label: 'Female',
            type: 'bar',
            valueFormatter,
            stack: 'stack',
          },
        ]}
        yAxis={[
          {
            data: ageGroups,
            width: 60,
            disableLine: true,
            disableTicks: true,
          },
        ]}
        xAxis={[
          {
            valueFormatter: (population: number) =>
              numberWithSuffixFormatter.format(Math.abs(population)),
            disableLine: true,
            disableTicks: true,
            domainLimit(min, max) {
              const extremum = Math.max(-min, max);
              const roundedExtremum = Math.ceil(extremum / 100_000) * 100_000;
              return { min: -roundedExtremum, max: roundedExtremum };
            },
          },
        ]}
        grid={{ vertical: true }}
      />
      <Typography variant="caption">Source: KOSIS</Typography>
    </Stack>
  );
}

```
