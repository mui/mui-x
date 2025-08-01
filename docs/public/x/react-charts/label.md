---
title: Charts - Label
productId: x-charts
components: BarChart, ScatterChart, LineChart, PieChart
---

# Charts - Label

Label is the text reference of a series or data.

## Basic display

To set a series' label, you can pass in a `string` as a series' property `label`.
The provided label will be visible at different locations such as the legend, or the tooltip.

:::info
The Pie chart has some specificity described in its [own section](#pie).
:::

```tsx
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function BasicLabel() {
  return (
    <BarChart
      {...props}
      series={[
        {
          data: [2400, 1398, 9800],
          label: 'label 1',
        },
      ]}
    />
  );
}

const props = {
  height: 300,
  xAxis: [{ data: ['A', 'B', 'C'] }],
  yAxis: [{ width: 50 }],
};

```

## Conditional formatting

The `label` property also accepts a `function` allowing you to change the label content based on location.

The function receives `location` as its first argument which can have the following values:

- `'legend'` to format the label in the [Legend](/x/react-charts/legend/)
- `'tooltip'` to format the label in the [Tooltip](/x/react-charts/tooltip/)

```tsx
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function FunctionLabel() {
  return (
    <BarChart
      {...props}
      series={[
        { data: [2400, 1398, 9800], label: 'simple label' },
        { data: [500, 2398, 4300], label: (location) => `${location} label` },
      ]}
    />
  );
}

const props = {
  height: 300,
  xAxis: [{ data: ['A', 'B', 'C'] }],
  yAxis: [{ width: 50 }],
};

```

## Pie

The [Pie](/x/react-charts/pie/) chart behaves differently due to its nature.
It has labels per slice instead of per series.
It also has one more place where the label can be rendered.

Instead of receiving the `label` as part of the series.
It instead receives it as part of the `data` set inside a series.

Its `location` argument can have the following values:

- `'legend'` to format the label in the [Legend](/x/react-charts/legend/)
- `'tooltip'` to format the label in the [Tooltip](/x/react-charts/tooltip/)
- `'arc'` to format the [Arc label](/x/react-charts/pie/#labels) when `arcLabel` is set to `'label'`

```tsx
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function PieLabel() {
  return (
    <PieChart
      {...props}
      series={[
        {
          data: [
            { id: 0, value: 10, label: (location) => `${location}+A` },
            { id: 1, value: 15, label: (location) => `${location}+B` },
            { id: 2, value: 20, label: (location) => `${location}+C` },
          ],
          type: 'pie',
          arcLabel: 'label',
        },
      ]}
    />
  );
}

const props = {
  width: 200,
  height: 200,
};

```
