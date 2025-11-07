---
title: Charts - useAxes
productId: x-charts
---

# useAxes

<p class="description">Access axis configuration and properties for cartesian and polar charts.</p>

The `use*Axes` and `use*Axis` hooks provide access to axis configurations and computed properties for both cartesian (x/y) and polar (rotation/radius) charts.

## Cartesian charts

For cartesian charts, you can use `useXAxes`, `useYAxes`, `useXAxis`, and `useYAxis` hooks to access x-axis and y-axis configurations.

### useXAxes / useYAxes

Use these hooks to access all axes of a given direction:

```js
import { useXAxes, useYAxes } from '@mui/x-charts/hooks';

function CustomComponent() {
  // All x-axes
  const { xAxis, xAxisIds } = useXAxes();
  // All y-axes
  const { yAxis, yAxisIds } = useYAxes();
}
```

### useXAxis / useYAxis

Use these hooks to access a specific axis by ID. If no ID is provided, the default axis is returned:

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

For polar charts (such as radar charts), you can use `useRotationAxes`, `useRadiusAxes`, `useRotationAxis`, and `useRadiusAxis` hooks.

### useRotationAxes / useRadiusAxes

```js
import { useRotationAxes, useRadiusAxes } from '@mui/x-charts/hooks';

function CustomComponent() {
  const { rotationAxis, rotationAxisIds } = useRotationAxes();
  const { radiusAxis, radiusAxisIds } = useRadiusAxes();
}
```

### useRotationAxis / useRadiusAxis

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

The following example demonstrates the use of `useXAxes` and `useYAxes` to access all axes in a chart with dual y-axes.
The custom components use these hooks to draw visual indicators showing the axis ranges and display axis metadata:

{{"demo": "UseAxes.js"}}

## Caveats

These hooks must be used within a chart context. See the [hooks overview](/x/react-charts/hooks/) for more information about proper usage.
