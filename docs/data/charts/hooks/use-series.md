---
title: Charts - useSeries
productId: x-charts
---

# useSeries

<p class="description">Access raw series data for all chart types.</p>

The `use[Type]Series` hooks provide access to specific series data for a particular chart type.

## Usage

```js
import { useBarSeries, useLineSeries } from '@mui/x-charts/hooks';

function CustomComponent() {
  const barSeries = useBarSeries(); // Array of bar chart series data
  const lineSeries = useLineSeries(); // Array of line chart series data
}
```

You can also pick specific series by either providing the series id as a parameter, or an array of series ids to get.

```js
const barSeries = useBarSeries('id1');

const barSeries = useBarSeries(['id1', 'id2']);
```

The following hooks exist to access series data specific to each chart type:

- `useBarSeries`
- `useLineSeries`
- `useScatterSeries`
- `usePieSeries`
- `useRadarSeries`
- `useHeatmapSeries`
- `useFunnelSeries`
- `useSankeySeries`

This example demonstrates using the `useBarSeries` hook to access specific bar chart series data:

{{"demo": "UseBarSeries.js"}}

## Advanced usage

The `useSeries` hook can be used to access all series data at once.
In the example below, the `useSeries` hook is used to create a custom component that displays a line over each series max value.

:::warning
It is generally recommended to use the specific series hooks (for example, `useBarSeries`, `useLineSeries`) when working with a specific chart type, as their API is easier to use.
The `useSeries` hook is more suitable for advanced use cases where you need to work with multiple unknown chart types at once.
:::

{{"demo": "UseSeries.js"}}

## Caveats

This hook must be used within a chart context. See the [hooks overview](/x/react-charts/hooks/) for more information about proper usage.
