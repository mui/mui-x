---
title: Charts - useSeries
productId: x-charts
---

# useSeries

<p class="description">Access raw series data for all chart types.</p>

The `useXxxSeries` hook provides access to specific series data for a particular chart type.

## Usage

It is recommended to use the specific series hooks (e.g., `useBarSeries`, `useLineSeries`) when working with a specific chart type, as their API is easier to use.

```js
import { useBarSeries, useLineSeries } from '@mui/x-charts/hooks';

function CustomComponent() {
  const barSeries = useBarSeries();
  const lineSeries = useLineSeries();
  // barSeries: Object containing bar chart series data
  // lineSeries: Object containing line chart series data
}
```

- `useBarSeries` - Access bar chart series data
- `useLineSeries` - Access line chart series data
- `useScatterSeries` - Access scatter chart series data
- `usePieSeries` - Access pie chart series data
- `useRadarSeries` - Access radar chart series data
- `useHeatmapSeries` - Access heatmap chart series data
- `useFunnelSeries` - Access funnel chart series data

This example demonstrates using the `useBarSeries` hook to access specific bar chart series data:

{{"demo": "UseBarSeriesDemo.js"}}

## Advanced usage

:::warning
It is generally recommended to use the specific series hooks (e.g., `useBarSeries`, `useLineSeries`) when working with a specific chart type, as their API is easier to use.
The `useSeries` hook is more suitable for advanced use cases where you need to work with multiple unknown chart types at once.
:::

The `useSeries` hook can be used to access all series data at once.
In the example below, the `useSeries` hook is used to create a custom component that displays a line over each series max value.

{{"demo": "UseSeriesDemo.js"}}

## Caveats

This hook requires being used within a chart context. See the [hooks overview](/x/react-charts/hooks/) for more information about proper usage.
