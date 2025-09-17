---
title: Charts - useScale
productId: x-charts
---

# useScale

<p class="description">Access D3 scale functions for coordinate transformations.</p>

The scale hooks provide access to D3 scale functions that can be used to convert data values to pixel coordinates within the chart.
Scale hooks accept an axis id as a parameter.
If provided, the hook returns the scale of the associated axis.
Otherwise it returns the scale of the default axis.

## Cartesian charts

Access the x-axis and y-axis scale function.

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

Access the rotation and radius scale functions for polar charts.

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

### getValueToPositionMapper

A utility function that returns a mapper function for converting values to positions, with special handling for band scales.

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

This example shows how to use scale functions to position custom elements:

{{"demo": "UseScale.js"}}

## Caveats

These hooks must be used within a chart context. See the [hooks overview](/x/react-charts/hooks/) for more information about proper usage.
