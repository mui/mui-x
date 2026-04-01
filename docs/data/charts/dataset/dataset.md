---
title: React Charts - Dataset
productId: x-charts
components: BarChart, LineChart, ScatterChart
---

# Charts - Dataset

<p class="description">Use the dataset prop to provide data as an array of objects, and reference values by key.</p>

## Overview

Charts accept data through the `dataset` prop, which takes an array of objects.
You can reference individual properties by using `dataKey` on axes and series.

This is an alternative to providing `data` directly on each series or axis.
It simplifies configuration when multiple series share the same underlying data source.

{{"demo": "DatasetBasic.js"}}

## Value getter

The `valueGetter` property allows you to transform values from the dataset before they are used.
This is useful when your dataset contains values in a format that the chart does not support directly, such as date strings or values stored as strings.

### Axis value getter

You can use `valueGetter` on axis configuration to transform axis values.
A common use case is converting date strings to `Date` objects for time-based axes.

The function receives the full dataset item and should return the axis value.
It can be used as an alternative to `dataKey`.

```tsx
xAxis={[
  {
    scaleType: 'time',
    // Convert ISO date strings to Date objects
    valueGetter: (item) => new Date(item.date),
  },
]}
```

{{"demo": "AxisValueGetter.js"}}

### Series value getter

You can use `valueGetter` on series to transform values extracted from the dataset.
For example, converting string values to numbers.

```tsx
series={[
  {
    // Convert string values to numbers
    valueGetter: (item) => parseFloat(item.revenue),
  },
]}
```

{{"demo": "SeriesValueGetter.js"}}

### Special series value getters

These series types require the `valueGetter` to return values in a specific format.

#### Scatter series

The `valueGetter` receives the full dataset item and should return a `ScatterValueType` object.
It can be used as an alternative to `datasetKeys`.

```tsx
series={[
  {
    valueGetter: (item) => ({
      x: item.lng,
      y: item.lat,
      z: item.population / 1_000_000,
      id: item.city,
    }),
  },
]}
```

#### Heatmap series

The heatmap `valueGetter` should return a `[xIndex, yIndex, value]` tuple.

```tsx
series={[
  {
    type: 'heatmap',
    valueGetter: (item) => [item.x, item.y, item.temperature],
  },
]}
```

#### OHLC series

The OHLC `valueGetter` should return a `[open, high, low, close]` tuple or `null`.

```tsx
series={[
  {
    type: 'ohlc',
    valueGetter: (item) => [item.open, item.high, item.low, item.close],
  },
]}
```
