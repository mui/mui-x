---
title: React Radar chart
productId: x-charts
components: RadarChart, RadarGrid, RadarSeriesArea, RadarSeriesMarks, RadarSeriesPlot, RadarMetricLabels, RadarAxisHighlight, RadarDataProvider
---

# Charts - Radar 🧪

<p class="description">Radar allows to compare multivariate data in a 2D chart.</p>

:::warning
🚧 This component is under development 🚧

Not all the feature are implemented and its API might change in the future if needed to integrate the upcoming features.
:::

## Basics

A radar chart is defined by two main props:

- The `series` prop which provides the values to display thanks to the `data` property.
- The `radar` prop which defines the radar axes.

{{"demo": "BasicRadar.js"}}

## Multi-series

You can plot multiple series on the same radar chart.

{{"demo": "MultiSeriesRadar.js"}}

## Series options

Radar series support `hideMark` and `fillArea` parameter to modify the rendering of the series.

{{"demo": "DemoRadarVisualisation.js"}}

## Axis

The `metrics` property of `radar` takes an array with one item per corner of the radar.
This item can either be:

- A string used as the axis label. The other properties are populated from the data.
- An object with the following properties:
  - `name`: The label associated to the axis.
  - `min`: The minimum value along this direction (by default 0).
  - `max`: The maximum value along this direction (by default the maximum value along this direction).

{{"demo": "RadarAxis.js" }}

## Grid

The radar chart displays a grid behind the series that can be configured with:

- `startAngle` The rotation angle of the entire chart in degrees.
- `divisions` The number of divisions of the grid.
- `shape` The grid shape that can be `circular` or `sharp`.
- `stripeColor` The callback that defines stripe colors. Set it to `null` to remove stripes.

{{"demo": "DemoRadar.js" }}

## Highlight

### Axis highlight

By default the radar highlight values of a same axis.
With composition you can add this behavior with the `<RadarAxisHighlight />` component.

{{"demo": "DemoRadarAxisHighlight.js" }}

### Series highlight

To set the highlight on series, use the `highlight` prop with `'series'` value.
This highlight can be controlled with `highlightedItem` value and `onHighlightChange` callback.

With composition you can pass those props to the `RadarDataProvider`.

This demo shows a controlled highlight.
Notice the impact of the series order in the highlight interaction.
The UK series is the last item of the `series` prop.
Such that its area renders on top of the others.
Otherwise, the other area would catch the pointer event, making it impossible to highlight it.

{{"demo": "DemoRadarSeriesHighlight.js" }}

### Disabling highlight

To remove highlight, set the `highlight` prop to `'none'`.

## Tooltip

Like other charts, the radar chart [tooltip](/x/react-charts/tooltip/) can be customized with slots.
The `trigger` prop of the `tooltip` slot accepts the following values:

- `'axis'`—the user's mouse position is associated with a metric. The tooltip displays data about all series along this specific metric.
- `'item'`—when the user's mouse hovers over a radar area, the tooltip displays data about this series.
- `'none'`—disable the tooltip.

{{"demo": "RadarTooltip.js" }}

## Composition

Use the `<RadarDataProvider />` to provide `series` and `radar` props for composition.

In addition to the common chart components available for [composition](/x/react-charts/composition/), you can use the following components:

- For axes
  - `<RadarGrid />` renders the grid and stripes.
  - `<RadarMetricLabels />` renders metric labels around the grid.
- For data
  - `<RadarSeriesPlot />` renders series (the area and the marks) on top of each other.
  - `<RadarSeriesArea />` renders series area.
  - `<RadarSeriesMarks />` renders series marks.
- For interaction
  - `<RadarAxisHighlight />` renders line and marks along the highlighted axis.

:::info
The `<RadarSeriesPlot />` renders all series together, such that the area of the second series is on top of the marks of the the first one.

The `<RadarSeriesArea />` and `<RadarSeriesMarks />` allow to render all marks on top of all areas.
It also allows rendering some components between the areas and the marks.
:::

{{"demo": "CompositionExample.js" }}

Here is how the Radar Chart is composed:

```jsx
<RadarDataProvider>
  <ChartsWrapper>
    <ChartsLegend />
    <ChartsSurface>
      {/* The background of the chart */}
      <RadarGrid />
      <RadarMetricLabels />
      {/* The data with axis highlight on top of area and below marks */}
      <RadarSeriesArea />
      <RadarAxisHighlight />
      <RadarSeriesMarks />
      {/* Other components */}
      <ChartsOverlay />
      <ChartsTooltip />
    </ChartsSurface>
  </ChartsWrapper>
</RadarDataProvider>
```
