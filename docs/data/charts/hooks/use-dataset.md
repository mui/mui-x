---
title: Charts - useDataset
productId: x-charts
---

# useDataset

<p class="description">Access the dataset used to populate series and axes data.</p>

The `useDataset` hook provides access to the dataset array that was passed to the chart. This is useful when you need to access the raw data for custom components or calculations.

To access the computed series and axes data, use the [useSeries](/x/react-charts/hooks/use-series/) and `useAxes` hooks instead.

## Usage

```js
import { useDataset } from '@mui/x-charts/hooks';

function CustomComponent() {
  const dataset = useDataset();
  // Access the raw dataset array
}
```

The hook returns the dataset array that was passed to the `dataset` prop of the chart, or `undefined` if no dataset was provided.

## Basic example

This example demonstrates using the `useDataset` hook to display dataset statistics above a chart:

{{"demo": "UseDataset.js"}}

## Advanced example

This example shows how to use the dataset to create a custom data table that synchronizes with the chart:

{{"demo": "UseDatasetAdvanced.js"}}

## Return value

The hook returns:

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
The `useDataset` hook only works when using the `dataset` prop. If you're passing data directly to series via the `data` prop, this hook will return `undefined`.
:::

## When to use

The `useDataset` hook is particularly useful when:

- Creating custom components that need access to the raw data
- Building data tables or summaries alongside your charts
- Performing calculations on the full dataset

## Caveats

This hook must be used within a chart context. See the [hooks overview](/x/react-charts/hooks/) for more information about proper usage.
