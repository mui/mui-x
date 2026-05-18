---
title: React Map chart
productId: x-charts
components: ChartsGeoDataProviderPremium, GeoDataPlot, MapShapePlot, MapShape
---

# Charts - Map [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan') 🧪

<p class="description">Render geographic features projected to SVG.</p>

:::warning
This feature is in preview. It is not yet ready for production use, and its API, visuals and behavior may change in future minor or patch releases.
:::

## Overview

The map building blocks are composed manually for now: `ChartsGeoDataProviderPremium` registers
the `geoData` and `projection` with the chart store, and `GeoDataPlot` reads them back to render
the features as SVG paths inside a `ChartsSurface`.

{{"demo": "BasicGeoDataPlot.js"}}

## Composition

The provider accepts a GeoJSON `FeatureCollection` and a d3-geo projection
(either a name or a `GeoProjection` instance). `GeoDataPlot` consumes them via the
`useGeoData` and `useProjection` hooks, fits the projection to the chart's drawing area,
and renders one `<path>` per feature.

```tsx
<Unstable_ChartsGeoDataProviderPremium
  geoData={geoData}
  projection="naturalEarth1"
  height={360}
>
  <ChartsSurface>
    <GeoDataPlot />
  </ChartsSurface>
</Unstable_ChartsGeoDataProviderPremium>
```
