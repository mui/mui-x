---
title: React Map chart
productId: x-charts
components: ChartsGeoDataProviderPremium, GeoDataPlot, MapImagePlot, MapShapePlot, MapShape, MapPointPlot, MapPoint, FocusedMapPoint, Graticule, FocusedMapShape
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
- `series`: the data associated to the geographical objects of type `'mapShape'`.

{{"demo": "BasicGeoDataPlot.js"}}

## Composition

The provider accepts a GeoJSON `FeatureCollection` and a d3-geo projection
(either a name or a `GeoProjection` instance). `GeoDataPlot` consumes them via the
`useGeoData` and `useGeoPath` hooks, fits the projection to the chart's drawing area,
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

### Rendering any GeoJSON shapes

`geoData` accepts any GeoJSON `FeatureCollection`; the features don't have to be
country borders. Administrative regions, sales territories, watersheds, or the
tectonic plates used below render the same way.

This example loads the [PB2002](https://github.com/fraxen/tectonicplates) plate
model together with country borders into a single `geoData`, as two `mapShape` series.
`MapShapePlot` wraps each series in a group carrying a `data-series` attribute,
so one plot renders both layers and CSS styles them independently: colored plates
below, country outlines on top for orientation.
Toggle between a flat `naturalEarth1` map and an `orthographic` globe.

{{"demo": "TectonicPlates.js"}}

## Rendering the base map with `GeoDataPlot`

`GeoDataPlot` draws every feature registered on the provider as an SVG path.
It is meant to render the base map—the geography itself—without any data series.
The `fill`, `stroke`, and `strokeWidth` props apply uniformly to all features,
so use them to style the background layer.

{{"demo": "GeoDataPlotDemo.js"}}

## Adding a base map raster with `MapImagePlot`

`MapImagePlot` draws a raster base map—such as a satellite mosaic—under the series.
The image is reprojected to match the chart's `projection`, so it follows the geography
instead of staying a flat rectangle, even when the projection curves the map.

Pass the image URL through the `href` prop. The source is assumed to be equirectangular and
to cover the whole globe; use `imageBounds` (`[[west, south], [east, north]]`) when it covers
a smaller extent.

```tsx
<ChartsSurface>
  <MapImagePlot href="/static/mars-viking.jpg" />
  <MapShapePlot />
</ChartsSurface>
```

The provider is not tied to Earth—`geoData` accepts any GeoJSON `FeatureCollection`.
The demo below maps the 30 USGS Mars Chart quadrangles colored by mean elevation over a
Viking surface mosaic, with notable landmarks and mission sites, and a projection toggle.

{{"demo": "MarsMap.js"}}

:::warning
Reprojection reads the image pixels on a canvas, so the source must be same-origin or served
with CORS headers.
:::

## Modifying the projection

The `projection` prop accepts either a d3-geo projection name or a `GeoProjection` instance.

{{"demo": "ProjectionMapShape.js"}}

### Conic projections

Conic projections take two standard `parallels` as part of their definition.
The map distortion is minimal along those parallels.
So it's recommended to keep those parallels close to the area you want to display.

Here you can try different countries and play with projection and parallels to see its impact.

{{"demo": "CountryProjectionShape.js"}}

## Plotting series with `MapShapePlot`

`MapShapePlot` renders one path per item of every series with type `'mapShape'`.

Stacking it on top of a `GeoDataPlot` is convenient for highlighting a subset of features over the full geography.

{{"demo": "MapShapePlotDemo.js"}}

## Plotting points with `MapPointPlot`

`MapPointPlot` renders a marker per item of every series with type `'mapPoint'`, positioned at the item's `coordinates` (`[longitude, latitude]`).

Points hidden by the projection, such as those on the far side of an `orthographic` globe, are not rendered. Set `showLabels` to render each point's label next to its marker.

{{"demo": "MapPointPlotDemo.js"}}

## Matching features with `geoFeatureKey`

By default, a series item is joined to a GeoJSON feature through the feature's `name` property
(`feature.properties.name`).
When your `geoData` identifies features with another property, use the `geoFeatureKey` prop.
It accepts either a string or a function:

- **String**: the name of the property to read, so `feature.properties[geoFeatureKey]` is used as the key.

  ```tsx
  <Unstable_ChartsGeoDataProviderPremium geoData={geoData} geoFeatureKey="iso_a3">
    {/* series items now match feature.properties.iso_a3 */}
  </Unstable_ChartsGeoDataProviderPremium>
  ```

- **Function**: called with each feature and returning the key to use (or `null` to ignore the feature).
  This is convenient to give several features the same key so a single series item targets them all.

  ```tsx
  <Unstable_ChartsGeoDataProviderPremium
    geoData={geoData}
    geoFeatureKey={(feature) =>
      feature.properties?.name === 'Somaliland'
        ? 'Somalia'
        : (feature.properties?.name ?? null)
    }
  >
    {/* ... */}
  </Unstable_ChartsGeoDataProviderPremium>
  ```

The resolved key is what `mapShape` series items match against through their `name` property
(or the `name` field of their dataset/`valueGetter`).

In the demo below, the world atlas stores Somalia and Somaliland as two separate features.
But the data from Our World in Data merge them.
Returning `'Somalia'` for both gives them the same key, so the single `{ name: 'Somalia' }`
series item highlights the two shapes at once.

{{"demo": "GeoFeatureKeyMapShape.js"}}

## Mapping values to colors

Each `mapShape` data point accepts a `colorValue` property used to compute its fill through
a color axis defined with the `zAxis` prop.
The axis `colorMap` configuration accepts the usual `'continuous'`, `'piecewise'`, or `'ordinal'` types.

When no `colorValue` is provided, the item's `value` is used as a fallback.

```tsx
<Unstable_ChartsGeoDataProviderPremium
  geoData={geoData}
  series={[
    {
      type: 'mapShape',
      data: countries.map((country) => ({
        name: country.name,
        colorValue: country.internetUsage,
      })),
    },
  ]}
  zAxis={[
    {
      colorMap: {
        type: 'continuous',
        min: 0,
        max: 100,
        color: ['#e3f2fd', '#0d47a1'],
      },
    },
  ]}
>
  {/* ... */}
</Unstable_ChartsGeoDataProviderPremium>
```

If several `zAxis` are defined, the series can target one explicitly with the `colorAxisId` property.

By default shapes with unknown values are ignored.
Specify the `unknownColor` property in the `colorMap` to render them.

:::info
By using `unknownColor` instead of displaying the `GeoDataPlot` as a background, you enable the tooltip for those shapes without data.
:::

{{"demo": "ColorScaleMapShape.js"}}

## Using a dataset

If your data is stored in an array of objects, you can pass it once on the provider with the `dataset` prop and let each series read its fields with `datasetKeys`.
The `name` key is required to match each entry with a GeoJSON feature; `label`, `value`, and `colorValue` are optional.

```tsx
<Unstable_ChartsGeoDataProviderPremium
  geoData={geoData}
  dataset={countries}
  series={[
    {
      type: 'mapShape',
      datasetKeys: {
        name: 'code',
        label: 'country',
        colorValue: 'internetUsage',
      },
    },
  ]}
>
  {/* ... */}
</Unstable_ChartsGeoDataProviderPremium>
```

When the dataset values need to be transformed, use `valueGetter` instead of `datasetKeys`. It receives the dataset item and must return a `MapShapeValueType`.

```tsx
series={[
  {
    type: 'mapShape',
    valueGetter: (item) => ({
      name: item.code,
      label: item.country,
      colorValue: item.internetUsage / 100,
    }),
  },
]}
```

See the [Dataset](/x/react-charts/dataset/) page to learn more.

## Click event

`MapShapePlot` accepts an `onItemClick` callback fired when the user clicks on a shape.
It receives the click event and a `MapShapeItemIdentifier` that identifies the clicked item
through its `seriesId` and `name`.

{{"demo": "MapShapeClick.js"}}

## Managing the highlight with `highlightScope`

Each `mapShape` series accepts a `highlightScope` property that controls how hovering an item
affects the rendering. The `highlight` option decides which items are emphasized
(`'item'` for the hovered shape only, `'series'` for every shape of the same series), and
the `fade` option decides which items are dimmed
(`'series'` for the rest of the same series, `'global'` for every shape in every series).

{{"demo": "HighlightedMapShape.js"}}

## Zoom

### Interaction

Set prop `zoom` to `true` to enable zoom interactions.
This props also accept a configuration objects.

The zoom interaction modifies the projection center such that the user pointer stay on top of the same geographical coordinate during the gesture.
If modifying the center does not succeed, it modifies the translation.

The zoom object has two properties to limit this behavior:

- `rotationAllowed`: `'both' | 'both+roll' | 'longitude' | 'none'` Limit how the center can be modified
- `translationAllowed`: `'both' | 'x' | 'y' | 'none'` Limit how the translation can be modified

:::info
The **rotation** is a applied on the 3D sphere before projecting it to the 2D plan.

The **translation** is applied after the projection, it allows drag it but does not impact the projection.

The rotation allows infinite dragging because a rotation of 360deg bring user back to the initial point.
But for some projection rotating the sphere along latitude or roll angles can have two impacts:

- Cylindrical projections usually represent latitude/longitude as horizontal/vertical lines. Rotating along latitude or using the roll will transform those straight lines into curves.
- Cylindrical and conic projections will apply different distortion to shapes according to the latitude/roll angle. So shapes will vary while dragging the map.

:::

By default, both are derived from the chosen projection so each map behaves as expected without extra configuration:

- azimuthal (globe-like) projections: `{ rotationAllowed: 'both', translationAllowed: 'none' }`
- cylindrical: `{ rotationAllowed: 'long', translationAllowed: 'y' }`
- conic: `{ rotationAllowed: 'none', translationAllowed: 'both' }`

:::info
With azimuthal projections, you can replace `rotationAllowed: 'both'` by `'both+roll'` to get a smoother dragging interaction.
But the north/south axis will move more easily.
:::

You can also modify the zoom result with:

- `minZoomLevel`/`maxZoomLevel`: Clamp the `zoomLevel` between those two values.
- `maxEmptySpace`: The maximal space left empty while dragging the map. It's a ratio of the drawing area size. For example `maxEmptySpace=0.2` means you can not leave more than 20% of the drawing area empty when dragging the map.

{{"demo": "MapZoomOptions.js"}}

### Control

The maps have a `view` and `onViewChange` props that allow to controll the zoom.

The view is made of three properties:

- `zoomLevel`: `number` A scaling ratio such that `1` correspond to the scale where all objects fit in the drawing area.
- `center`: `[number, number]` The long/lat coordinates in degree of the point at the center of the projection.
- `translation`: `[number, number]` The translation of the map as a ratio of the drawing area.

{{"demo": "MapZoomControl.js"}}

## Managing visibility from the legend

When `toggleVisibilityOnClick` is set on the `ChartsLegend`, clicking on a series toggles
its visibility. Hidden series are skipped by `MapShapePlot` so the underlying base map
stays visible.

{{"demo": "VisibleMapShape.js"}}

## Exporting

Maps can be exported as an image or as a PDF, like any other chart.
See the [Export](/x/react-charts/export/) page for the complete documentation.

{{"demo": "ExportMap.js"}}

## Common practice

### Removing Antarctica

World maps often has no data for Antarctica.
There are two ways to remove it:.

- Render only the countries in series by removing the `<GeoDataPlot />`
- Filter out Antarctica from the `geoData`

{{"demo": "RemoveAntarctica.js"}}
