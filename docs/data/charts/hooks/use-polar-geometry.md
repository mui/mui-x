---
title: Charts - usePolarGeometry
productId: x-charts
---

# `usePolarGeometry()`

<p class="description">Access the geometry of a polar chart to position custom SVG elements and transformations.</p>

The `usePolarGeometry()` returns the geometry of a polar chart, providing access to the chart's center coordinates, scales, and coordinate converters.

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

{{"demo": "UsePolarGeometry.js"}}

## Return value

```ts
// D3Scale is the union of all supported D3 scale types:
// ScaleBand | ScalePoint | ScaleLinear | ScaleLogarithmic | ScaleSymLog | ScalePower | ScaleTime
interface PolarGeometry<
  TAngleScale extends D3Scale = D3Scale,
  TRadiusScale extends D3Scale = D3Scale,
> {
  cx: number; // X coordinate of the chart center within the SVG
  cy: number; // Y coordinate of the chart center within the SVG
  angleScale: TAngleScale; // Maps rotation axis values to angles in radians
  radiusScale: TRadiusScale; // Maps data values to radii (distance from center)
  point: (radius: number, angle: number) => [number, number]; // Polar → Cartesian offset from [cx, cy]
  pointInverse: (x: number, y: number) => [number, number]; // Cartesian offset → [radius, angle in (-π, π)]
}
```

Returns `null` if the chart scales are not ready.

## Caveats

You can only use this hook within a chart context.
See the [hooks overview](/x/react-charts/hooks/) for usage requirements.
