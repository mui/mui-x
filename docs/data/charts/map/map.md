---
title: React Map chart
productId: x-charts
components: ChartsGeoDataProviderPremium, GeoDataPlot, MapImagePlot, MapShapePlot, MapShape, Graticule, FocusedMapShape
---

# Charts - Map [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan') 🧪

<p class="description">Render geographic data on an interactive map.</p>

:::warning
This feature is in preview. It is not yet ready for production use, and its API, visuals and behavior may change in future minor or patch releases.
:::

## Overview

The map chart is built around `ChartsGeoDataProviderPremium`, which takes three main props:

- `geoData`: a [GeoJSON](https://geojson.org/) `FeatureCollection` defining the geography (countries, regions, roads, …)
- `projection`: a string or `GeoProjection` instance that controls how coordinates are mapped onto the SVG plane
- `series`: data associated with geographic features

Series can be of type `'mapShape'`, `'mapPoint'`, or `'mapLink'`.

{{"demo": "BasicGeoDataPlot.js"}}

## Projections

A projection converts spherical coordinates (longitude, latitude) into flat (x, y) screen coordinates.
Different projections make different trade-offs between area accuracy, shape accuracy, and visual appearance.
Common built-in projections include:

- `"naturalEarth1"` — a pseudocylindrical projection that gives a pleasing world map
- `"mercator"` — preserves angles; standard for web maps but heavily distorts polar areas
- `"orthographic"` — renders a globe view; useful to convey the spherical nature of the Earth
- `"equalEarth"` — area-accurate alternative to Natural Earth

See [Projection and Zoom](/x/react-charts/map-projection/) for a full guide on choosing and customizing projections.

## GeoJSON data

`geoData` accepts any GeoJSON `FeatureCollection`.
Features can be country borders, administrative regions, sales territories, or any other geographic shapes.

This example loads two `FeatureCollection` objects—country borders and the [PB2002](https://github.com/fraxen/tectonicplates) tectonic plate model—into a single `geoData` as two `mapShape` series.
`MapShapePlot` wraps each series in a group with a `data-series` attribute so CSS can style the layers independently.
Toggle between a flat `naturalEarth1` map and an `orthographic` globe.

{{"demo": "TectonicPlates.js"}}

## Composition

`ChartsGeoDataProviderPremium` fits the projection to the chart's drawing area.
Slot components like `GeoDataPlot` and `MapShapePlot` read the projection and data through the `useGeoData` and `useGeoPath` hooks.

```tsx
<Unstable_ChartsGeoDataProviderPremium
  geoData={geoData}
  projection="naturalEarth1"
  height={360}
>
  <ChartsSurface>
    <GeoDataPlot />
    <MapShapePlot />
  </ChartsSurface>
</Unstable_ChartsGeoDataProviderPremium>
```

## Rendering the base map with `GeoDataPlot`

`GeoDataPlot` draws every feature in `geoData` as an SVG path without any data series.
Use it as the background layer; the `fill`, `stroke`, and `strokeWidth` props apply uniformly to all features.

{{"demo": "GeoDataPlotDemo.js"}}

## Adding a raster base map with `MapImagePlot`

`MapImagePlot` draws a raster image—such as a satellite mosaic—under the vector layers.
The image is reprojected to match the chart's `projection`, so it follows the geography instead of staying a flat rectangle.

Pass the image URL through the `href` prop.
The source is assumed to be equirectangular and to cover the whole globe; use `imageBounds` (`[[west, south], [east, north]]`) when it covers a smaller extent.

```tsx
<ChartsSurface>
  <MapImagePlot href="/static/mars-viking.jpg" />
  <MapShapePlot />
</ChartsSurface>
```

The provider is not tied to Earth—`geoData` accepts any GeoJSON `FeatureCollection`.
The demo below maps the 30 USGS Mars Chart quadrangles colored by mean elevation over a Viking surface mosaic, with notable landmarks and mission sites.

{{"demo": "MarsMap.js"}}

:::warning
Reprojection reads image pixels on a canvas, so the source must be same-origin or served with CORS headers.
:::
