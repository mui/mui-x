---
title: React Map chart Projection and Zoom
productId: x-charts
components: ChartsGeoDataProviderPremium, GeoDataPlot, MapImagePlot, MapShapePlot, MapShape, Graticule, FocusedMapShape
---

# Charts - Projection and Zoom [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan') 🧪

<p class="description">Choose the right projection for your data and let users explore the map.</p>

:::warning
This feature is in preview. It is not yet ready for production use, and its API, visuals and behavior may change in future minor or patch releases.
:::

## Choosing a projection

A map projection converts spherical (longitude, latitude) coordinates into flat (x, y) screen coordinates.
Every projection involves trade-offs—no flat map can preserve area, shape, distance, and direction all at once.

| Use case               | Recommended projection                    |
| :--------------------- | :---------------------------------------- |
| World overview         | `"naturalEarth1"`, `"equalEarth"`         |
| Navigation / web tiles | `"mercator"`                              |
| Globe feel             | `"orthographic"`                          |
| Area comparisons       | `"equalEarth"`, `"cylindricalEqualArea"`  |
| Polar regions          | `"stereographic"`, `"azimuthalEqualArea"` |

Pass the projection name as a string or a `GeoProjection` instance to the `projection` prop of `ChartsGeoDataProviderPremium`.

## Modifying the projection

The `projection` prop accepts either a d3-geo projection name or a `GeoProjection` instance.
You can fine-tune the projection with three additional props:

- `translate: [tx, ty]` — shift the projected map within the SVG
- `rotate: [lambda, phi, gamma]` — rotate coordinates before applying the projection. To center the map on a coordinate (longitude, latitude), use `rotate={[-longitude, -latitude]}`
- `scale: number` — set the zoom level. If omitted, the scale is chosen automatically to fit `geoData` in the drawing area. Note that some projections can produce infinite coordinates with extreme scale values.

{{"demo": "ProjectionMapShape.js"}}
