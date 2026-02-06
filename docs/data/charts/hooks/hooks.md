---
title: Charts - Hooks
productId: x-charts
---

# Charts - Hooks

<p class="description">Use hooks to access chart data and utilities for building custom components.</p>

## Available hooks

The charts package provides several categories of hooks.

### Series and Data hooks

- [**useSeries()**](/x/react-charts/hooks/use-series/) - Access raw series data for all chart types
- Specific series hooks for individual chart types (`useBarSeries()`, `useLineSeries()`, etc.)
- [**useDataset()**](/x/react-charts/hooks/use-dataset/) - Access the dataset used to populate series and axes data.
  Only works when you use the `dataset` prop.

### Axes hooks

- [**useAxes()**](/x/react-charts/hooks/use-axes/) - Access axis configuration and properties for cartesian and polar charts
  - Cartesian axes hooks (`useXAxes()`, `useYAxes()`, `useXAxis()`, `useYAxis()`)
  - Polar axes hooks (`useRotationAxes()`, `useRadiusAxes()`, `useRotationAxis()`, `useRadiusAxis()`)

### Legend hooks

- [**useLegend()**](/x/react-charts/hooks/use-legend/) - Access formatted legend data to create custom legend components

### Layout and positioning hooks

- [**useDrawingArea()**](/x/react-charts/hooks/use-drawing-area/) - Access the chart's drawing area dimensions and coordinates
- [**useScale()**](/x/react-charts/hooks/use-scale/) - Access D3 scale functions for coordinate transformations (`useXScale()`, `useYScale()`)

## Quick start

Import chart hooks from `@mui/x-charts/hooks`.
Pro and premium packages also provide additional hooks.

```js
import { useSeries, useLegend, ... } from '@mui/x-charts/hooks';
import { useSeries, useLegend, ... } from '@mui/x-charts-pro/hooks';
import { useSeries, useLegend, ... } from '@mui/x-charts-premium/hooks';
```

## Caveats

All chart hooks must be used within a chart context.
A component using these hooks must follow one of these structures:

1. A `slot` of a chart component
2. A child of a chart component
3. A child of the `ChartDataProvider` component

For example, if you create a `CustomLegend` component that uses the `useLegend()` hook, you can use it as follows:

```jsx
// ✅ Correct usage with slot API
<LineChart
  series={[...]}
  slots={{ legend: CustomLegend }}
/>

// ✅ Correct usage with chart component
<LineChart series={[...]}>
  <CustomLegend /> {/* useLegend() works here */}
</LineChart>

// ✅ Correct usage with composition API
<ChartDataProvider series={[...]}>
  <ChartsSurface>
    <LinePlot />
  </ChartsSurface>
  <CustomLegend /> {/* useLegend() works here */}
</ChartDataProvider>
```

```jsx
// ❌ Incorrect usage - outside chart context
<div>
  <LineChart series={[...]} />
  <CustomLegend /> {/* useLegend() will not work here */}
</div>
```
