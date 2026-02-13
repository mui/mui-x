---
title: Charts - useDataset
productId: x-charts
---

# useDataset

<p class="description">Read the dataset array used to populate series and axes in custom components.</p>

The `useDataset()` hook returns the dataset array passed to the chart.
This is useful when:

- Creating custom components that need access to the raw data
- Building data tables or summaries alongside your charts
- Performing calculations on the full dataset

Use [`useSeries()`](/x/react-charts/hooks/use-series/) and [`useAxes()`](/x/react-charts/hooks/use-axes/) for computed series and axes data instead.

## Usage

```js
import { useDataset } from '@mui/x-charts/hooks';

function CustomComponent() {
  const dataset = useDataset();
  // Access the raw dataset array
}
```

`useDataset()` returns the dataset array passed to the chart's `dataset` prop, or `undefined` if no dataset was provided.

## Basic example

The example below shows `useDataset()` used to display dataset statistics above a chart:

{{"demo": "UseDataset.js"}}

## Advanced example

The example below shows how to use the dataset to create a custom data table that stays in sync with the chart:

{{"demo": "UseDatasetAdvanced.js"}}

## Return value

`useDataset()` returns:

| Type                                 | Description                                                                       |
| :----------------------------------- | :-------------------------------------------------------------------------------- |
| `Readonly<DatasetType> \| undefined` | The dataset array passed to the chart, or `undefined` if no dataset was provided. |

The `DatasetType` is an array of objects where each object represents a data point with various properties. For example:

```ts
const dataset = [
  { month: 'Jan', sales: 100, expenses: 80 },
  { month: 'Feb', sales: 150, expenses: 90 },
  { month: 'Mar', sales: 120, expenses: 70 },
];
```

:::info
`useDataset()` returns a value only when the chart uses the `dataset` prop.
If you pass data via the `data` prop on series, it returns `undefined`.
:::

## Caveats

You can only use this hook within a chart context.
See the [hooks overview](/x/react-charts/hooks/) for usage requirements.
