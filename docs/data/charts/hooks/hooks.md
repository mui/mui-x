---
title: Charts - Hooks
productId: x-charts
---

# Charts - Hooks

<p class="description">MUI X Charts provides a set of hooks to access chart data and utilities for building custom components.</p>

## Available hooks

The charts package provides several categories of hooks:

### Series hooks

- [**useSeries**](/x/react-charts/hooks/use-series/) - Access raw series data for all chart types
- Specific series hooks for individual chart types (`useBarSeries`, `useLineSeries`, etc.)

### Legend hooks

- [**useLegend**](/x/react-charts/hooks/use-legend/) - Access formatted legend data for creating custom legend components

### Layout and positioning hooks

- [**useDrawingArea**](/x/react-charts/hooks/use-drawing-area/) - Access the chart's drawing area dimensions and coordinates
- [**useScale**](/x/react-charts/hooks/use-scale/) - Access D3 scale functions for coordinate transformations (`useXScale`, `useYScale`)

## Quick start

All chart hooks are available from the `@mui/x-charts/hooks` import:

```js
import {
  useSeries,
  useLegend,
  useDrawingArea,
  useXScale,
  useYScale,
} from '@mui/x-charts/hooks';
```

## Caveats

All charts hooks require being used within a chart context. This means they should be used:

1. **Inside chart components:** Components rendered within chart slots
2. **Within ChartDataProvider:** When using the composition API

```jsx
// ✅ Correct usage with chart component
<LineChart series={[...]}>
  <CustomLegend /> {/* useLegend works here */}
</LineChart>

// ✅ Correct usage with composition API
<ChartDataProvider series={[...]}>
  <ChartsSurface>
    <LinePlot />
  </ChartsSurface>
  <CustomLegend /> {/* useLegend works here */}
</ChartDataProvider>
```

```jsx
// ❌ Incorrect usage - outside chart context
<div>
  <LineChart series={[...]} />
  <CustomLegend /> {/* useLegend will not work here */}
</div>
```
