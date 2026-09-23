---
title: Charts - usePolarGeometry
productId: x-charts
---

# `usePolarGeometry()`

<p class="description">Access the geometry of a polar chart to position custom SVG elements and transformations.</p>

The `usePolarGeometry()` returns the geometry of a polar chart, providing access to the chart's center coordinates, scales, and coordinate converters.

## Usage

The hook returns the chart's center coordinates (`cx`, `cy`), the `angleScale` and `radiusScale`, and the `point`/`pointInverse` converters between polar and Cartesian coordinates.
`angleScale` is the scale of the rotation axis (the angular axis going around the center), and `radiusScale` is the scale of the radius axis (the radial distance from the center).
It returns `null` while the chart scales are not ready.

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

  // point() returns an offset from the center, so add cx/cy
  return <circle cx={cx + x} cy={cy + y} r={5} fill="red" />;
}
```

By default `angleScale` and `radiusScale` are typed as the union of all supported scale types.
Pass the rotation and radius scale names as generic arguments to get precisely typed scales—for example, to call `bandwidth()` on a band rotation axis:

```ts
const geometry = usePolarGeometry<'band', 'linear'>();

if (geometry) {
  // angleScale is ScaleBand, radiusScale is ScaleLinear
  const band = geometry.angleScale.bandwidth();
  const radius = geometry.radiusScale(100);
}
```

{{"demo": "UsePolarGeometry.js"}}

## Caveats

You can only use this hook within a chart context.
See the [hooks overview](/x/react-charts/hooks/) for usage requirements.
