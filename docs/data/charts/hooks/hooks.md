---
title: Charts - Hooks
productId: x-charts
---

# Charts - Hooks

<p class="description">MUI X Charts provides a set of hooks to access chart data and utilities for building custom components.</p>

The `@mui/x-charts/hooks` package provides hooks that allow you to access internal chart state and create custom chart components.

## Installation

The hooks are available as part of the `@mui/x-charts` package:

```bash
npm install @mui/x-charts
```

## Import

```js
import { useLegend, useSeries, useDrawingArea } from '@mui/x-charts/hooks';
```

## Available hooks

### Legend hooks

#### useLegend

Access formatted legend data for creating custom legend components.

```js
import { useLegend } from '@mui/x-charts/hooks';

function CustomLegend() {
  const { items } = useLegend();
  // items: Array of legend items with id, label, color, markType
}
```

**Requirements:** Must be used within a chart data provider context.

**Returns:** `{ items: LegendItemParams[] }`

{{"demo": "UseLegendDemo.js"}}

[See detailed documentation](/x/react-charts/legend/#uselegend-hook)

### Series hooks

#### useSeries

Access raw series data for all chart types.

```js
import { useSeries } from '@mui/x-charts/hooks';

function CustomComponent() {
  const series = useSeries();
  // series: Object containing all series data organized by type
}
```

#### useBarSeries

Access bar chart series data specifically.

```js
import { useBarSeries } from '@mui/x-charts/hooks';

function BarCustomComponent() {
  const barSeries = useBarSeries();
  // Access bar-specific series data
}
```

#### useLineSeries

Access line chart series data specifically.

```js
import { useLineSeries } from '@mui/x-charts/hooks';

function LineCustomComponent() {
  const lineSeries = useLineSeries();
  // Access line-specific series data
}
```

#### usePieSeries

Access pie chart series data specifically.

```js
import { usePieSeries } from '@mui/x-charts/hooks';

function PieCustomComponent() {
  const pieSeries = usePieSeries();
  // Access pie-specific series data
}
```

#### useScatterSeries

Access scatter chart series data specifically.

```js
import { useScatterSeries } from '@mui/x-charts/hooks';

function ScatterCustomComponent() {
  const scatterSeries = useScatterSeries();
  // Access scatter-specific series data
}
```

### Layout and positioning hooks

#### useDrawingArea

Access the chart's drawing area dimensions and coordinates.

```js
import { useDrawingArea } from '@mui/x-charts/hooks';

function CustomOverlay() {
  const { left, top, width, height } = useDrawingArea();
  // Position custom elements within the chart area
}
```

**Returns:** `{ left: number, top: number, width: number, height: number }`

#### useScale

Access D3 scale functions for coordinate transformations.

```js
import { useXScale, useYScale } from '@mui/x-charts/hooks';

function CustomComponent() {
  const xScale = useXScale();
  const yScale = useYScale();
  
  // Convert data values to pixel coordinates
  const xCoord = xScale(dataValue);
  const yCoord = yScale(dataValue);
}
```

### Utility hooks

#### useChartId

Get a unique identifier for the current chart instance.

```js
import { useChartId } from '@mui/x-charts/hooks';

function CustomComponent() {
  const chartId = useChartId();
  // Unique ID for this chart instance
}
```

#### useItemHighlighted

Access information about highlighted chart items.

```js
import { useItemHighlighted } from '@mui/x-charts/hooks';

function CustomComponent() {
  const highlightedItem = useItemHighlighted();
  // Information about the currently highlighted item
}
```

## Context requirements

Most hooks require being used within a chart context. This means they should be used:

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

// ❌ Incorrect usage - outside chart context
<div>
  <LineChart series={[...]} />
  <CustomLegend /> {/* useLegend will not work here */}
</div>
```

## Common patterns

### Custom legend with hooks

```jsx
import { useLegend } from '@mui/x-charts/hooks';
import { ChartsLabelMark } from '@mui/x-charts/ChartsLabel';

function CustomLegend() {
  const { items } = useLegend();
  
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      {items.map((item) => (
        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ChartsLabelMark type={item.markType} color={item.color} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
```

### Custom overlay with positioning

```jsx
import { useDrawingArea, useXScale, useYScale } from '@mui/x-charts/hooks';

function CustomOverlay() {
  const { left, top } = useDrawingArea();
  const xScale = useXScale();
  const yScale = useYScale();
  
  // Position a custom element at data coordinates (5, 100)
  const x = left + xScale(5);
  const y = top + yScale(100);
  
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: 4,
        borderRadius: 4,
      }}
    >
      Custom marker
    </div>
  );
}
```

### Combining multiple hooks

```jsx
import { useSeries, useDrawingArea } from '@mui/x-charts/hooks';

function SeriesStats() {
  const series = useSeries();
  const { width, height } = useDrawingArea();
  
  const totalSeries = Object.values(series).reduce(
    (count, seriesData) => count + (seriesData?.seriesOrder.length || 0),
    0
  );
  
  return (
    <div style={{ padding: 16 }}>
      <p>Chart dimensions: {width} × {height}</p>
      <p>Total series: {totalSeries}</p>
    </div>
  );
}
```

## TypeScript support

All hooks are fully typed when using TypeScript:

```tsx
import { useLegend, LegendItemParams } from '@mui/x-charts/hooks';

function TypedCustomLegend() {
  const { items }: { items: LegendItemParams[] } = useLegend();
  
  return (
    <div>
      {items.map((item: LegendItemParams) => (
        <div key={item.id}>
          {item.label}
        </div>
      ))}
    </div>
  );
}
```