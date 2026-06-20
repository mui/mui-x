---
title: Charts - usePolarGeometry
productId: x-charts
---

# `usePolarGeometry()`

<p class="description">Access the geometry of a polar chart to position custom SVG elements and transformations.</p>

The `usePolarGeometry()` returns the geometry of a polar chart, providing access to the chart's center coordinates, angle and radius scales, and a helper function to convert polar coordinates to Cartesian coordinates.

## Usage

```js
import { usePolarGeometry } from '@mui/x-charts/hooks';

function PolarGeometryOverlay() {
  const geometry = usePolarGeometry();

  if (!geometry) {
    return null; // Chart scales not ready or axes don't meet requirements
  }

  const { cx, cy, point } = geometry;

  // Example: Position a custom marker at a specific radius and angle
  const [x, y] = point(100, Math.PI / 4); // radius: 100px, angle: 45 degrees

  return <circle cx={x} cy={y} r={5} fill="red" />;
}
```

{{"demo": "UsePolarGeometryExample.js"}}

## Return value

```ts
interface PolarGeometry {
  cx: number; // Chart center X coordinate
  cy: number; // Chart center Y coordinate
  angleScale: (rotationAxis: string) => number | undefined; // Maps rotation axis values to angles
  bandwidth: number; // Angular bandwidth of bands on rotation axis
  radiusScale: (value: number) => number; // Maps data values to radii
  point: (radius: number, angle: number) => [number, number]; // Converts polar to Cartesian coordinates
}
```

Returns `null` if the chart scales are not ready or the axes don't meet the requirements (rotation axis must be band/point scale, radius axis must be continuous).

## Caveats

You can only use this hook within a chart context.
See the [hooks overview](/x/react-charts/hooks/) for usage requirements.
