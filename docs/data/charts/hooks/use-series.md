---
title: Charts - Series hooks
productId: x-charts
---

# Series hooks

<p class="description">Get raw series data for custom components, by chart type or all at once.</p>

The series hooks return raw series data for a given chart type.
Use the hook that matches your chart (for example, `useBarSeries()` for bar charts, `useLineSeries()` for line charts).

## Usage

```js
import { useBarSeries, useLineSeries } from '@mui/x-charts/hooks';

function CustomComponent() {
  const barSeries = useBarSeries(); // Array of bar chart series data
  const lineSeries = useLineSeries(); // Array of line chart series data
}
```

You can get specific series by passing a series ID, or an array of series IDs.

```js
const barSeries = useBarSeries('id1');

const barSeries = useBarSeries(['id1', 'id2']);
```

The series hooks for each chart type are:

- `useBarSeries()`
- `useLineSeries()`
- `useScatterSeries()`
- `usePieSeries()`
- `useRadarSeries()`
- `useHeatmapSeries()`
- `useFunnelSeries()`
- `useSankeySeries()`

The example below shows `useBarSeries()` returning bar chart series data:

{{"demo": "UseBarSeries.js"}}

## Advanced usage

`useSeries()` returns all series data at once.
The example below uses it to build a custom component that draws a line over each series max value.

:::warning
It's preferable to use type-specific series hooks (for example, `useBarSeries()`, `useLineSeries()`) when you work with a single chart type, since their API is simpler.
Use `useSeries()` when you need to handle multiple or unknown chart types at once.
:::

{{"demo": "UseSeries.js"}}

## Caveats

You can only use these hooks within a chart context.
See the [hooks overview](/x/react-charts/hooks/) for usage requirements.
