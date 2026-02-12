---
title: Charts - Hooks
productId: x-charts
---

# Charts - Hooks

<p class="description">The package provides a set of hooks to access chart data and utilities for building custom components.</p>

## Available hooks

The charts package provides several categories of hooks:

### Series and Data hooks

- [**useSeries**](/x/react-charts/hooks/use-series/) - Access raw series data for all chart types
- Specific series hooks for individual chart types (`useBarSeries`, `useLineSeries`, etc.)
- [**useDataset**](/x/react-charts/hooks/use-dataset/) - Access the dataset used to populate series and axes data, only if `dataset` prop is used.

### Axes hooks

- [**useAxes**](/x/react-charts/hooks/use-axes/) - Access axis configuration and properties for cartesian and polar charts
  - Cartesian axes hooks (`useXAxes`, `useYAxes`, `useXAxis`, `useYAxis`)
  - Polar axes hooks (`useRotationAxes`, `useRadiusAxes`, `useRotationAxis`, `useRadiusAxis`)

### Legend hooks

- [**useLegend**](/x/react-charts/hooks/use-legend/) - Access formatted legend data for creating custom legend components

### Layout and positioning hooks

- [**useDrawingArea**](/x/react-charts/hooks/use-drawing-area/) - Access the chart's drawing area dimensions and coordinates
- [**useScale**](/x/react-charts/hooks/use-scale/) - Access D3 scale functions for coordinate transformations (`useXScale`, `useYScale`)

## Quick start

All chart hooks are available from the `@mui/x-charts/hooks` import, with pro and premium packages also providing additional hooks.

```js
import { useSeries, useLegend, ... } from '@mui/x-charts/hooks';
import { useSeries, useLegend, ... } from '@mui/x-charts-pro/hooks';
import { useSeries, useLegend, ... } from '@mui/x-charts-premium/hooks';
```

## Caveats

All charts hooks must be used within a chart context.
This means a component using those hook should follow one of the below mentioned structure:

1. a `slot` of a chart component
2. a child of a chart component
3. a child of the `<ChartsDataProvider />`

For example if you create a component `<CustomLegend />` that uses the `useLegend()` hook, you could use it as follow:

```jsx
// ✅ Correct usage with slot API
<LineChart
  series={[...]}
  slots={{ legend: CustomLegend }}
/>

// ✅ Correct usage with chart component
<LineChart series={[...]}>
  <CustomLegend /> {/* useLegend works here */}
</LineChart>

// ✅ Correct usage with composition API
<ChartsDataProvider series={[...]}>
  <ChartsSurface>
    <LinePlot />
  </ChartsSurface>
  <CustomLegend /> {/* useLegend works here */}
</ChartsDataProvider>
```

```jsx
// ❌ Incorrect usage - outside chart context
<div>
  <LineChart series={[...]} />
  <CustomLegend /> {/* useLegend will not work here */}
</div>
```
