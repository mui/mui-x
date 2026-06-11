---
title: React Bubble chart
productId: x-charts
components: ScatterChart, ScatterChartPro, ScatterChartPremium
---

# Charts - Bubble

<p class="description">A bubble chart extends scatter by mapping data values to point sizes and colors, revealing a third or fourth dimension in two-dimensional space.</p>

## Overview

A bubble chart is a scatter chart where each point can have a variable size and color determined by data values.
The x and y positions encode two variables, while the bubble size and color encode additional ones.

{{"demo": "BubbleChartCO2Emissions.js"}}

## Mapping data to color

As with other charts, you can modify the [series colors](/x/react-charts/styling/#colors) either directly, or with the color palette.

You can also modify the color by using the axes' `colorMap`, which maps values to colors.
Scatter charts use the following, in order of priority:

1. The z-axis color
2. The y-axis color
3. The x-axis color
4. The series color

:::info
The z-axis is a third axis that lets you style scatter points by a value other than position.
Pass it with the `zAxis` prop.

The mapped value can come from the `colorValue` property on each series data point, or from the z-axis data.
You can set the color value in three ways:

```jsx
<ScatterChart
  // First option
  series={[{ data: [{ id: 0, x: 1, y: 1, colorValue: 5 }] }]}
  // Second option
  zAxis={[{ data: [5] }]}
  // Third option
  dataset={[{ price: 5 }]}
  zAxis={[{ dataKey: 'price' }]}
/>
```

:::

See [Styling—Value-based colors](/x/react-charts/styling/#value-based-colors) for the `colorMap` properties.

{{"demo": "ColorScale.js"}}

## Mapping data to size

You can also map a value to the size of each scatter point.

Set a `sizeMap` on a z-axis and point the series to it with the `sizeAxisId` prop.
The mapped value comes from the `sizeValue` property on each data point, or from the z-axis data.

The `sizeMap` supports the same `continuous`, `piecewise`, and `ordinal` types as `colorMap`, but it maps values to a marker radius in pixels.
A series can set both `colorAxisId` and `sizeAxisId` to style points by two values at once.

{{"demo": "SizeScale.js"}}

### Different size scales

By default, a `sizeMap` with type `'continuous'` transforms values with a square root scale.
That makes the values proportional to the surface of the bubble rather than its radius.

You can change that behavior with `sizeMap.interpolator: 'log' | 'linear' | 'sqrt'`, or by providing a function to `sizeMap.size`.

When you do, make the choice explicit in the copy so the size encoding is not misleading.

{{"demo": "DifferentSizeScale.js"}}
