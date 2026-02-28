---
title: Charts - Hooks
productId: x-charts
---

# Charts - Hooks

<p class="description">Access chart data, scales, legend, and layout from custom components via React hooks.</p>

## Available hooks

Chart hooks expose series data, scales, axes, legend, and layout so you can build custom chart elements (for example, a custom legend or overlay) that stay in sync with the chart.
This page describes the different categories of hooks available.

### Series and Data hooks

- [`useSeries()`](/x/react-charts/hooks/use-series/) - Access raw series data for all chart types
- Specific series hooks for individual chart types (`useBarSeries()`, `useLineSeries()`, etc.)
- [`useDataset()`](/x/react-charts/hooks/use-dataset/) - Access the dataset that populates series and axes.
  Works only when the chart uses the `dataset` prop.

### Axes hooks

- [`useAxes()`](/x/react-charts/hooks/use-axes/) - Access axis configuration and properties for Cartesian and polar charts
  - Cartesian axes hooks (`useXAxes()`, `useYAxes()`, `useXAxis()`, `useYAxis()`)
  - Polar axes hooks (`useRotationAxes()`, `useRadiusAxes()`, `useRotationAxis()`, `useRadiusAxis()`)

### Legend hooks

- [`useLegend()`](/x/react-charts/hooks/use-legend/) - Access formatted legend data to create custom legend components

### Layout and positioning hooks

- [`useDrawingArea()`](/x/react-charts/hooks/use-drawing-area/) - Access the chart's drawing area dimensions and coordinates
- [`useScale()`](/x/react-charts/hooks/use-scale/) - Access D3 scale functions for coordinate transformations (`useXScale()`, `useYScale()`)

## Quick start

Import chart hooks from `@mui/x-charts/hooks`.
Pro and premium packages also provide additional hooks.

```js
import { useSeries, useLegend, ... } from '@mui/x-charts/hooks';
import { useSeries, useLegend, ... } from '@mui/x-charts-pro/hooks';
import { useSeries, useLegend, ... } from '@mui/x-charts-premium/hooks';
```

## Caveats

Use chart hooks only within a chart context.
Place the component that uses them in one of these positions:

1. A slot of a chart component
2. A child of a chart component
3. A child of the `ChartDataProvider` component

For example, if you create a `CustomLegend` component that calls `useLegend()`, you can render it as follows:

```jsx
// ✅ Correct usage as a slot
<LineChart
  series={[...]}
  slots={{ legend: CustomLegend }}
/>

// ✅ Correct usage with chart component
<LineChart series={[...]}>
  <CustomLegend /> {/* useLegend() works here */}
</LineChart>

// ✅ Correct usage when composing a custom chart
<ChartDataProvider series={[...]}>
  <ChartsSurface>
    <LinePlot />
  </ChartsSurface>
  <CustomLegend /> {/* useLegend() works here */}
</ChartDataProvider>
```

```jsx
// ❌ Incorrect: outside chart context
<div>
  <LineChart series={[...]} />
  <CustomLegend /> {/* useLegend() does not work here */}
</div>
```
