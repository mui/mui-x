---
title: Charts - useAxes
productId: x-charts
---

# useAxes

<p class="description">Read axis configuration and computed properties for cartesian and polar charts in custom components.</p>

The axis hooks expose axis configurations and computed properties for both cartesian (x/y) and polar (rotation/radius) charts.

## Cartesian charts

Use `useXAxes()`, `useYAxes()`, `useXAxis()`, and `useYAxis()` to read x-axis and y-axis configurations.

### Get all axes

Use `useXAxes()` and `useYAxes()` to get all axes of a given direction:

```js
import { useXAxes, useYAxes } from '@mui/x-charts/hooks';

function CustomComponent() {
  // All x-axes
  const { xAxis, xAxisIds } = useXAxes();
  // All y-axes
  const { yAxis, yAxisIds } = useYAxes();
}
```

### Get a specific axis

Use `useXAxis()` and `useYAxis()` to get a specific axis by ID.
If you omit the ID, the hook returns the default axis.

```js
import { useXAxis, useYAxis } from '@mui/x-charts/hooks';

function CustomComponent() {
  // Default x-axis
  const xAxis = useXAxis();
  // Specific x-axis
  const xAxisCustom = useXAxis('customAxisId');

  // Default y-axis
  const yAxis = useYAxis();
  // Specific y-axis
  const yAxisLeft = useYAxis('leftAxis');
}
```

## Polar charts

Use `useRotationAxes()`, `useRadiusAxes()`, `useRotationAxis()`, and `useRadiusAxis()` for polar charts (such as radar charts).

### Get all rotation and radius axes

Use `useRotationAxes()` and `useRadiusAxes()` to get all rotation and radius axes.

```js
import { useRotationAxes, useRadiusAxes } from '@mui/x-charts/hooks';

function CustomComponent() {
  const { rotationAxis, rotationAxisIds } = useRotationAxes();
  const { radiusAxis, radiusAxisIds } = useRadiusAxes();
}
```

### Get a specific axis

Use `useRotationAxis()` and `useRadiusAxis()` to get a specific axis by ID or index.

```js
import { useRotationAxis, useRadiusAxis } from '@mui/x-charts/hooks';

function CustomComponent() {
  // Default rotation axis
  const rotationAxis = useRotationAxis();
  // Specific rotation axis
  const rotationAxisCustom = useRotationAxis('customAxisId');

  // Access by index
  const radiusAxis = useRadiusAxis(0);
  // Access by ID
  const radiusAxisById = useRadiusAxis('radiusAxisId');
}
```

## Usage example

The example below shows `useXAxes()` and `useYAxes()` reading all axes in a chart with dual y-axes.
The custom components use these hooks to draw visual indicators for axis ranges and to display axis metadata.

{{"demo": "UseAxes.js"}}

## Caveats

You can only use these hooks within a chart context.
See the [hooks overview](/x/react-charts/hooks/) for usage requirements.
