---
title: React Map chart
productId: x-charts
components: ChartsGeoDataProviderPremium, GeoDataPlot, MapShapePlot, MapShape
---

# Charts - Map [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan') 🧪

<p class="description">Render geographic data.</p>

:::warning
This feature is in preview. It is not yet ready for production use, and its API, visuals and behavior may change in future minor or patch releases.
:::

## Overview

The map provider `ChartsGeoDataProviderPremium` uses three main props:

- `geoData`: an array of geographical objects defining the map (countries, cities, road, ...)
- `projection`: a string that defines how the objects should be projected on the SVG.
- `series`: the data associated to the geographical objects.

The series can be of type `'mapShape'`, `'mapPoint'`, or `'mapLink'`.

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

## Rendering the base map with `GeoDataPlot`

`GeoDataPlot` draws every feature registered on the provider as an SVG path.
It is meant to render the base map—the geography itself—without any data series.
The `fill`, `stroke`, and `strokeWidth` props apply uniformly to all features,
so use them to style the background layer.

{{"demo": "GeoDataPlotDemo.js"}}

## Modifying the projection

The `projection` prop accepts either a d3-geo projection name or a `GeoProjection` instance.

{{"demo": "ProjectionMapShape.js"}}

## Plotting series with `MapShapePlot`

`MapShapePlot` renders one path per item of every series with type `'mapShape'`.

Each item is joined to a GeoJSON feature through its `name` property
(matching `feature.properties.name`).

Stacking it on top of a `GeoDataPlot` is convenient for highlighting a subset of features over the full geography.

{{"demo": "MapShapePlotDemo.js"}}

## Managing the highlight with `highlightScope`

Each `mapShape` series accepts a `highlightScope` property that controls how hovering an item
affects the rendering. The `highlight` option decides which items are emphasized
(`'item'` for the hovered shape only, `'series'` for every shape of the same series), and
the `fade` option decides which items are dimmed
(`'series'` for the rest of the same series, `'global'` for every shape in every series).

{{"demo": "HighlightedMapShape.js"}}

## Managing visibility from the legend

When `toggleVisibilityOnClick` is set on the `ChartsLegend`, clicking on a series toggles
its visibility. Hidden series are skipped by `MapShapePlot` so the underlying base map
stays visible.

{{"demo": "VisibleMapShape.js"}}
