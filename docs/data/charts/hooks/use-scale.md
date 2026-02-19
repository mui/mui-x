---
title: Charts - Scale hooks
productId: x-charts
---

# Scale hooks

<p class="description">Convert data values to pixel coordinates with D3 scale functions in custom chart components.</p>

The scale hooks expose D3 scale functions that convert data values to pixel coordinates within the chart.
You can pass an axis ID to get that axis's scale; otherwise, the hook returns the default axis scale.

## Cartesian charts

Use `useXScale()` and `useYScale()` to get the x-axis and y-axis scale functions.

```js
import { useXScale, useYScale } from '@mui/x-charts/hooks';

function CustomComponent() {
  const xScale = useXScale(); // Default x-axis
  const xScaleById = useXScale('customAxisId'); // Specific x-axis
  const yScale = useYScale(); // Default y-axis
  const yScaleById = useYScale('leftAxis'); // Specific y-axis

  // Convert data value to pixel coordinate
  const xCoord = xScale(dataValue);
  const yCoord = yScale(dataValue);
}
```

## Polar charts

Use `useRotationScale()` and `useRadiusScale()` to get the rotation and radius scale functions for polar charts.

```js
import { useRotationScale, useRadiusScale } from '@mui/x-charts/hooks';

function CustomComponent() {
  const rotationScale = useRotationScale();
  const rotationScaleById = useRotationScale('rotationAxisId');
  const radiusScale = useRadiusScale();
  const radiusScaleById = useRadiusScale('radiusAxisId');
}
```

## Utility function

### Convert values to positions

`getValueToPositionMapper()` returns a mapper function that converts values to positions, with special handling for band scales.

```js
import { getValueToPositionMapper } from '@mui/x-charts/hooks';

function CustomComponent() {
  const xScale = useXScale();
  const xMapper = getValueToPositionMapper(xScale);

  // For band scales, this centers the position within the band
  const position = xMapper(value);
}
```

## Usage example

The example below shows how to use scale functions to position custom elements:

{{"demo": "UseScale.js"}}

## Caveats

You can only use these hooks within a chart context.
See the [hooks overview](/x/react-charts/hooks/) for usage requirements.
