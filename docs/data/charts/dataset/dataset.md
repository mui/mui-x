---
title: React Charts - Dataset
productId: x-charts
components: BarChart, LineChart, ScatterChart
---

# Charts - Dataset

<p class="description">Use the dataset prop to provide data as an array of objects, and reference values by key.</p>

## Overview

Charts accept data through the `dataset` prop, which takes an array of objects.
You can reference individual properties by using

- `dataKey` on axes and series that require single field
- `datasetKeys` on series types that require multiple fields (such as scatter, OHLC, and range bar)

This is a convenient alternative to providing `data` directly on each series or axis.
It simplifies configuration when multiple series share the same underlying data source, but has no performance impact.

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

## Multi fields series

These series types require `datasetKeys` or the `valueGetter` to return values in a specific format.

### Scatter series

The scatter series requires `x` and `y` values, and optionally `z` and `id` values.
You can provide these values with `datasetKeys` or with `valueGetter`.

```tsx
series={[
  {
    type: 'scatter',
    datasetKeys: {
      x: 'lng',
      y: 'lat',
      z: 'population',
      id: 'city',
    },
    // Or with valueGetter
    valueGetter: (item) => ({
      x: item.lng,
      y: item.lat,
      z: item.population / 1_000_000,
      id: item.city,
    }),
  },
]}
```

### Heatmap series

The heatmap should return a `[xIndex, yIndex, value]` tuple from the `valueGetter`.

```tsx
series={[
  {
    type: 'heatmap',
    // Or with valueGetter
    valueGetter: (item) => [item.x, item.y, item.temperature],
  },
]}
```

#### OHLC series

The OHLC should return a `[open, high, low, close]` tuple or `null` from the `valueGetter` or use `datasetKeys` to specify which fields to use for these values.

```tsx
series={[
  {
    type: 'ohlc',
    datasetKeys: {
      open: 'openPrice',
      high: 'highPrice',
      low: 'lowPrice',
      close: 'closePrice',
    },
    // Or with valueGetter
    valueGetter: (item) => [item.openPrice, item.highPrice, item.lowPrice, item.closePrice],
  },
]}
```

### Range bar series

The range bar should return a `[start, end]` tuple or `null` from the `valueGetter` or use `datasetKeys` to specify which fields to use for these values.

```tsx
series={[
  {
    type: 'rangeBar',
    datasetKeys: {
      start: 'minTemp',
      end: 'maxTemp',
    },
    // Or with valueGetter
    valueGetter: (item) => [item.minTemp, item.maxTemp],
  },
]}
```
